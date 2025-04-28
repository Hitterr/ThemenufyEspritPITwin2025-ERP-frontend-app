import React, { useEffect, useState, useMemo } from "react";
import { Card, Table, Alert, Row, Col, Form, Button, Tab, Nav } from "react-bootstrap";
import Swal from "sweetalert2";
import useRecipeStore from "../../../store/useRecipeStore";
import useConsumptionHistoryStore from "../../../store/useConsumptionHistoryStore";
import useSupplierStore from "../../../store/supplierStore";
import useRestaurantStore from "../../../store/RestaurantStore"; // Your provided store
import RadialBarChart from "../../../../jsx/components/Sego/Home/RadialBarChart";

// Reusable component for displaying recipe summary (without Ingredient Costs and Historical Usage)
const RecipeSummary = ({ recipe, suppliers, desiredMargin, suggestedPrices, setSuggestedPrices }) => {
  const calculateRecipeCost = (items) => {
    let totalCost = 0;
    const ingredientCosts = [];

    for (const item of items) {
      const ingredientId = item.ingredientId._id.toString();
      const quantity = item.quantity;

      let cheapestPrice = null;
      suppliers.forEach((supplier) => {
        const supplierIng = supplier.ingredients.find(
          (si) => si.ingredientId.toString() === ingredientId
        );
        if (supplierIng) {
          const price = supplierIng.pricePerUnit;
          if (cheapestPrice === null || price < cheapestPrice) {
            cheapestPrice = price;
          }
        }
      });

      if (cheapestPrice === null) {
        return { error: `No supplier found for ingredient ID: ${ingredientId}`, totalCost: 0, ingredientCosts: [] };
      }

      const cost = cheapestPrice * quantity;
      totalCost += cost;

      ingredientCosts.push({
        ingredientName: item.ingredientId.libelle,
        quantity,
        unit: item.ingredientId.unit,
        pricePerUnit: cheapestPrice,
        totalCost: cost,
      });
    }

    return { totalCost, ingredientCosts };
  };

  const suggestSalePrice = (recipeId, costPerServing) => {
    if (desiredMargin < 0 || desiredMargin > 100) {
      Swal.fire({
        icon: "error",
        title: "Invalid Margin",
        text: "Profit margin must be between 0 and 100.",
      });
      return;
    }

    const marginFraction = desiredMargin / 100;
    const suggestedPrice = (costPerServing / (1 - marginFraction)).toFixed(2);

    setSuggestedPrices((prev) => ({
      ...prev,
      [recipeId]: suggestedPrice,
    }));

    Swal.fire({
      icon: "success",
      title: "Price Suggested!",
      text: `Suggested price per serving: $${suggestedPrice}`,
    });
  };

  const { totalCost, error: costError } = calculateRecipeCost(recipe.items);
  const costPerServing = (totalCost / recipe.servings).toFixed(2);
  const profitMargin = (((recipe.salePrice - Number(costPerServing)) / recipe.salePrice) * 100).toFixed(2);

  return (
    <div className="mb-5">
      <h4>Recipe: {recipe.name}</h4>
      {costError ? (
        <Alert variant="danger">{costError}</Alert>
      ) : (
        <Row className="mb-3">
          <Col>
            <h5>Total Cost: ${totalCost.toFixed(2)}</h5>
            <h5>Cost per Serving: ${costPerServing}</h5>
            <h5>Current Sale Price per Serving: ${recipe.salePrice.toFixed(2)}</h5>
            <h5>Current Profit Margin: ${profitMargin}%</h5>
            <p>Servings: {recipe.servings}</p>
            <Button
              variant="primary"
              className="light btn-rounded"
              onClick={() => suggestSalePrice(recipe._id, Number(costPerServing))}
            >
              Suggest New Sale Price
            </Button>
            {suggestedPrices[recipe._id] && (
              <Alert variant="info" className="mt-2">
                Suggested Sale Price per Serving: ${suggestedPrices[recipe._id]}
              </Alert>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

// Reusable component for displaying detailed recipe info (with Ingredient Costs and Historical Usage)
const RecipeDetails = ({ recipe, suppliers, consumptionData, desiredMargin, suggestedPrices, setSuggestedPrices }) => {
  const calculateRecipeCost = (items) => {
    let totalCost = 0;
    const ingredientCosts = [];

    for (const item of items) {
      const ingredientId = item.ingredientId._id.toString();
      const quantity = item.quantity;

      let cheapestPrice = null;
      suppliers.forEach((supplier) => {
        const supplierIng = supplier.ingredients.find(
          (si) => si.ingredientId.toString() === ingredientId
        );
        if (supplierIng) {
          const price = supplierIng.pricePerUnit;
          if (cheapestPrice === null || price < cheapestPrice) {
            cheapestPrice = price;
          }
        }
      });

      if (cheapestPrice === null) {
        return { error: `No supplier found for ingredient ID: ${ingredientId}`, totalCost: 0, ingredientCosts: [] };
      }

      const cost = cheapestPrice * quantity;
      totalCost += cost;

      ingredientCosts.push({
        ingredientName: item.ingredientId.libelle,
        quantity,
        unit: item.ingredientId.unit,
        pricePerUnit: cheapestPrice,
        totalCost: cost,
      });
    }

    return { totalCost, ingredientCosts };
  };

  const aggregateIngredientUsage = () => {
    const usage = {};

    consumptionData.forEach((entry) => {
      if (
        entry.restaurantId?.toString() === recipe.restaurantId.toString() &&
        entry.ingredientId?._id &&
        recipe.items.some(
          (item) => item.ingredientId._id.toString() === entry.ingredientId._id.toString()
        )
      ) {
        const ingId = entry.ingredientId._id.toString();
        if (!usage[ingId]) {
          usage[ingId] = { totalQty: 0, ingredientName: entry.ingredientId.libelle || "Unknown" };
        }
        usage[ingId].totalQty += entry.qty;
      }
    });

    return Object.values(usage);
  };

  const suggestSalePrice = (recipeId, costPerServing) => {
    if (desiredMargin < 0 || desiredMargin > 100) {
      Swal.fire({
        icon: "error",
        title: "Invalid Margin",
        text: "Profit margin must be between 0 and 100.",
      });
      return;
    }

    const marginFraction = desiredMargin / 100;
    const suggestedPrice = (costPerServing / (1 - marginFraction)).toFixed(2);

    setSuggestedPrices((prev) => ({
      ...prev,
      [recipeId]: suggestedPrice,
    }));

    Swal.fire({
      icon: "success",
      title: "Price Suggested!",
      text: `Suggested price per serving: $${suggestedPrice}`,
    });
  };

  const { totalCost, ingredientCosts, error: costError } = calculateRecipeCost(recipe.items);
  const costPerServing = (totalCost / recipe.servings).toFixed(2);
  const profitMargin = (((recipe.salePrice - Number(costPerServing)) / recipe.salePrice) * 100).toFixed(2);
  const usageData = aggregateIngredientUsage();

  return (
    <div className="mb-5">
      <h4>Recipe: {recipe.name}</h4>
      {costError ? (
        <Alert variant="danger">{costError}</Alert>
      ) : (
        <>
          <Row className="mb-3">
            <Col>
              <h5>Total Cost: ${totalCost.toFixed(2)}</h5>
              <h5>Cost per Serving: ${costPerServing}</h5>
              <h5>Current Sale Price per Serving: ${recipe.salePrice.toFixed(2)}</h5>
              <h5>Current Profit Margin: ${profitMargin}%</h5>
              <p>Servings: {recipe.servings}</p>
              <Button
                variant="primary"
                className="light btn-rounded"
                onClick={() => suggestSalePrice(recipe._id, Number(costPerServing))}
              >
                Suggest New Sale Price
              </Button>
              {suggestedPrices[recipe._id] && (
                <Alert variant="info" className="mt-2">
                  Suggested Sale Price per Serving: ${suggestedPrices[recipe._id]}
                </Alert>
              )}
            </Col>
          </Row>

          <h5>Ingredient Costs</h5>
          <Table striped bordered hover className="mb-4">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Price per Unit ($)</th>
                <th>Total Cost ($)</th>
              </tr>
            </thead>
            <tbody>
              {ingredientCosts.map((ing, index) => (
                <tr key={index}>
                  <td>{ing.ingredientName}</td>
                  <td>{ing.quantity}</td>
                  <td>{ing.unit}</td>
                  <td>{ing.pricePerUnit.toFixed(2)}</td>
                  <td>{ing.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h5>Historical Ingredient Usage</h5>
          {usageData.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Total Quantity Used</th>
                </tr>
              </thead>
              <tbody>
                {usageData.map((usage, index) => (
                  <tr key={index}>
                    <td>{usage.ingredientName}</td>
                    <td>{usage.totalQty}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No usage data available for this recipe.</p>
          )}
        </>
      )}
    </div>
  );
};

const RecipeCostDashboard = () => {
  const { recipes, loading: recipesLoading, error: recipesError, fetchRecipes } = useRecipeStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const {
    consumptions: consumptionData,
    isLoading: consumptionLoading,
    error: consumptionError,
    fetchConsumptions,
  } = useConsumptionHistoryStore();
  const { restaurants, fetchRestaurants } = useRestaurantStore(); // Use your store

  const [desiredMargin, setDesiredMargin] = useState(50);
  const [suggestedPrices, setSuggestedPrices] = useState({});
  const [suppliersLoading, setSuppliersLoading] = useState(false);
  const [suppliersError, setSuppliersError] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState("all");

  // Fetch restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Fetch data when restaurantId changes
  useEffect(() => {
    if (selectedRestaurantId) {
      useConsumptionHistoryStore.getState().setFilterCriteria({
        restaurantId: selectedRestaurantId,
      });
      const fetchData = async () => {
        setSuppliersLoading(true);
        setSuppliersError(null);
        try {
          await Promise.all([fetchRecipes(), fetchSuppliers(), fetchConsumptions()]);
        } catch (error) {
          setSuppliersError(error.message || "Failed to fetch data");
        } finally {
          setSuppliersLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedRestaurantId, fetchRecipes, fetchSuppliers, fetchConsumptions]);

  // Reset recipe selection when restaurant changes
  useEffect(() => {
    setSelectedRecipeId("all");
  }, [selectedRestaurantId]);

  // Memoize recipe metrics using dynamic data based on selected restaurant and recipe
  const recipeMetrics = useMemo(() => {
    const calculateCost = (items) => {
      let totalCost = 0;
      for (const item of items) {
        const ingredientId = item.ingredientId._id.toString();
        const quantity = item.quantity;

        let cheapestPrice = null;
        suppliers.forEach((supplier) => {
          const supplierIng = supplier.ingredients.find(
            (si) => si.ingredientId.toString() === ingredientId
          );
          if (supplierIng) {
            const price = supplierIng.pricePerUnit;
            if (cheapestPrice === null || price < cheapestPrice) {
              cheapestPrice = price;
            }
          }
        });

        if (cheapestPrice !== null) {
          totalCost += cheapestPrice * quantity;
        }
      }
      return totalCost;
    };

    const filteredRecipes = selectedRestaurantId
      ? recipes.filter((recipe) => recipe.restaurantId.toString() === selectedRestaurantId)
      : recipes;

    const totalRecipes = filteredRecipes.length;

    const totalCostOfAllRecipes = filteredRecipes.reduce((sum, recipe) => {
      const cost = calculateCost(recipe.items);
      return sum + (cost || 0);
    }, 0);

    let totalCost = 0;
    let totalServings = 0;
    let profitMargin = 0;
    let radialValue = 0;

    if (selectedRecipeId === "all") {
      totalCost = totalCostOfAllRecipes;
      totalServings = filteredRecipes.reduce((sum, recipe) => sum + recipe.servings, 0);

      profitMargin = filteredRecipes.length
        ? filteredRecipes.reduce((sum, recipe) => {
            const cost = calculateCost(recipe.items);
            const costPerServing = cost / recipe.servings;
            const margin = ((recipe.salePrice - costPerServing) / recipe.salePrice) * 100;
            return sum + (isNaN(margin) ? 0 : margin);
          }, 0) / filteredRecipes.length
        : 0;

      radialValue = 100;
    } else {
      const selectedRecipe = filteredRecipes.find((recipe) => recipe._id === selectedRecipeId);
      if (selectedRecipe) {
        totalCost = calculateCost(selectedRecipe.items);
        totalServings = selectedRecipe.servings;
        const costPerServing = totalCost / selectedRecipe.servings;
        profitMargin = ((selectedRecipe.salePrice - costPerServing) / selectedRecipe.salePrice) * 100;
        profitMargin = isNaN(profitMargin) ? 0 : profitMargin;

        radialValue = totalCostOfAllRecipes > 0 ? ((totalCost / totalCostOfAllRecipes) * 100).toFixed(2) : 0;
      }
    }

    console.log(`Selected Restaurant ID: ${selectedRestaurantId}, Selected Recipe ID: ${selectedRecipeId}, Radial Value: ${radialValue}, Total Cost: ${totalCost}, Total Cost of All Recipes: ${totalCostOfAllRecipes}`);

    return {
      totalRecipes,
      totalCost,
      totalServings,
      profitMargin,
      radialValue,
      totalCostOfAllRecipes,
    };
  }, [recipes, suppliers, selectedRestaurantId, selectedRecipeId]);

  // Log when the chart's series prop changes
  useEffect(() => {
    console.log(`RadialBarChart series updated to: ${recipeMetrics.radialValue}`);
  }, [recipeMetrics.radialValue]);

  // Filter recipes based on selected restaurant and recipe
  const displayedRecipes = selectedRecipeId === "all"
    ? []
    : recipes.filter((recipe) => recipe._id === selectedRecipeId && recipe.restaurantId.toString() === selectedRestaurantId);

  const selectedRecipe = selectedRecipeId === "all"
    ? null
    : recipes.find((recipe) => recipe._id === selectedRecipeId && recipe.restaurantId.toString() === selectedRestaurantId);

  const isLoading = recipesLoading || suppliersLoading || consumptionLoading;
  const error = recipesError || suppliersError || consumptionError;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="row">
      <div className="col-xl-6">
        <div className="card">
          <Tab.Container defaultActiveKey="all">
            <div className="card-header d-sm-flex flex-wrap d-block pb-0 border-0">
              <div className="me-auto pe-3">
                <h4 className="text-black fs-20">Recipe Cost Summary</h4>
                <p className="fs-13 mb-0 text-black">
                  Overview of recipe costs and margins
                </p>
              </div>
              <div className="card-action card-tabs mt-3 mt-sm-0 mb-3 mt-sm-0">
                <Nav as="ul" className="nav nav-tabs" role="tablist">
                  <Nav.Item as="li" className="nav-item">
                    <Nav.Link className="nav-link" eventKey="all" role="tab">
                      All Recipes
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li" className="nav-item">
                    <Nav.Link className="nav-link" eventKey="ingredients" role="tab">
                      Ingredients
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </div>
            <div className="card-body">
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Select Restaurant</Form.Label>
                    <Form.Select
                      value={selectedRestaurantId}
                      onChange={(e) => setSelectedRestaurantId(e.target.value)}
                    >
                      <option value="">Select a restaurant</option>
                      {restaurants.map((restaurant) => (
                        <option key={restaurant._id} value={restaurant._id}>
                          {restaurant.nameRes}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Select Recipe</Form.Label>
                    <Form.Select
                      value={selectedRecipeId}
                      onChange={(e) => setSelectedRecipeId(e.target.value)}
                      disabled={!selectedRestaurantId}
                    >
                      <option value="all">All Recipes</option>
                      {recipes
                        .filter((recipe) => recipe.restaurantId.toString() === selectedRestaurantId)
                        .map((recipe) => (
                          <option key={recipe._id} value={recipe._id}>
                            {recipe.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Tab.Content className="tab-content">
                {["all", "ingredients"].map((tabKey) => (
                  <Tab.Pane key={tabKey} eventKey={tabKey} className="tab-pane fade">
                    <div className="row align-items-center">
                      <div className="col-sm-6">
                        <RadialBarChart
                          key={`${selectedRestaurantId}-${selectedRecipeId}`}
                          series={recipeMetrics.radialValue}
                        />
                      </div>
                      <div className="col-sm-6 mb-sm-0 mb-3 text-center">
                        <h3 className="fs-28 text-black font-w600">
                          ${recipeMetrics.totalCost.toFixed(2)}
                        </h3>
                        <span className="mb-1 d-block">
                          {selectedRecipeId === "all" ? "Total Recipe Cost" : "Recipe Cost vs. Total"}
                        </span>
                        <p className="fs-14 mb-1">
                          {recipeMetrics.radialValue}% of ${recipeMetrics.totalCostOfAllRecipes.toFixed(2)} total cost
                        </p>
                        <p className="fs-14">
                          {selectedRecipeId === "all" ? "All recipes combined" : "Total cost of all recipes"}
                        </p>
                        <Button
                          variant="primary"
                          className="light btn-rounded"
                          onClick={() => {
                            Swal.fire({
                              icon: "info",
                              title: selectedRecipeId === "all" ? "Total Cost Analysis" : "Cost Analysis",
                              html: selectedRecipeId === "all"
                                ? `Total Cost of All Recipes: $${recipeMetrics.totalCostOfAllRecipes.toFixed(2)}<br>` +
                                  `Percentage: 100% (All recipes)`
                                : `Selected Recipe Cost: $${recipeMetrics.totalCost.toFixed(2)}<br>` +
                                  `Total Cost of All Recipes: $${recipeMetrics.totalCostOfAllRecipes.toFixed(2)}<br>` +
                                  `Percentage: ${recipeMetrics.radialValue}% of total`,
                            });
                          }}
                        >
                          More Details
                        </Button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            {recipeMetrics.totalRecipes}
                          </h3>
                          <span className="fs-18 text-primary">Total Recipes</span>
                        </div>
                      </div>
                      <div className="col-sm-4 mb-md-0 mb-3">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            {recipeMetrics.totalServings}
                          </h3>
                          <span className="fs-18 text-primary">Servings</span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="p-3 border rounded">
                          <h3 className="fs-32 text-black font-w600 mb-1">
                            {recipeMetrics.profitMargin.toFixed(2)}%
                          </h3>
                          <span className="fs-18 text-primary">Profit Margin</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      {tabKey === "all" && (
                        <>
                          <Row className="mb-3">
                            <Col md={4}>
                              <Form.Group>
                                <Form.Label>Desired Profit Margin (%)</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={desiredMargin}
                                  onChange={(e) => setDesiredMargin(Number(e.target.value))}
                                  min="0"
                                  max="100"
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          {displayedRecipes.length > 0 && (
                            displayedRecipes.map((recipe) => (
                              <RecipeSummary
                                key={recipe._id}
                                recipe={recipe}
                                suppliers={suppliers}
                                desiredMargin={desiredMargin}
                                suggestedPrices={suggestedPrices}
                                setSuggestedPrices={setSuggestedPrices}
                              />
                            ))
                          )}
                        </>
                      )}

                      {tabKey === "ingredients" && (
                        <div className="mb-5">
                          {selectedRecipe ? (
                            <RecipeDetails
                              recipe={selectedRecipe}
                              suppliers={suppliers}
                              consumptionData={consumptionData}
                              desiredMargin={desiredMargin}
                              suggestedPrices={suggestedPrices}
                              setSuggestedPrices={setSuggestedPrices}
                            />
                          ) : (
                            <Alert variant="info">No recipes available.</Alert>
                          )}
                        </div>
                      )}
                    </div>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

export default RecipeCostDashboard;