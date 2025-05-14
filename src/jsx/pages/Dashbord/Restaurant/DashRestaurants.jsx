import React, { useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { GlobalFilter } from "../../../components/table/FilteringTable/GlobalFilter";
import AdminModal from "../SuperAdmin/AdminModal";
import AdminTable from "../SuperAdmin/AdminTable";
import PaginationControls from "../SuperAdmin/PaginationControls";
import useRestaurantStore from "../../../store/RestaurantStore";
import { Plus, FileText } from "lucide-react";
import RestaurantModal from "./RestaurantModal";
export default function RestoDb() {
  const {
    restaurants,
    fetchRestaurants,
    purchaseOrders,
    purchaseOrderFile,
    generatePurchaseOrder,
    clearPurchaseOrders,
  } = useRestaurantStore();
  const [modalState, setModalState] = React.useState({
    show: false,
    isEditMode: false,
    selectedRestaurant: null,
    viewMode: false,
  });
  const [tableState, setTableState] = React.useState({
    globalFilter: "",
    currentPage: 1,
    sortOrder: "asc",
  });
  const [selectedRestaurantName, setSelectedRestaurantName] =
    React.useState("");
  const [format, setFormat] = React.useState("pdf");
  const [error, setError] = React.useState("");
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(restaurants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Restaurants");
    XLSX.writeFile(workbook, "restaurants.xlsx");
  };
  const openModal = (restaurant = null, isEdit = false, viewMode = false) => {
    console.log("Ouverture du modal avec :", {
      show: true,
      isEditMode: isEdit,
      selectedRestaurant: restaurant,
      viewMode,
    });
    setModalState({
      show: true,
      isEditMode: isEdit,
      selectedRestaurant: restaurant,
      viewMode,
    });
  };
  const handleGeneratePurchaseOrder = async () => {
    if (!selectedRestaurantName) {
      setError("Please select a restaurant");
      return;
    }
    setError("");
    clearPurchaseOrders();
    const selectedRestaurant = restaurants.find(
      (restaurant) => restaurant.nameRes === selectedRestaurantName
    );
    if (!selectedRestaurant) {
      setError("Selected restaurant not found");
      return;
    }
    const result = await generatePurchaseOrder(selectedRestaurant._id, format);
    if (!result.success) {
      setError(result.message);
    } else if (result.file) {
      const url = window.URL.createObjectURL(result.file.blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", result.file.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };
  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <Row className="w-100 align-items-center justify-content-between">
            {/* Add Button (Left) */}
            <Col xs={12} md={2} className="mb-2 mb-md-0">
              <Button
                variant="success"
                className="w-100"
                onClick={() => openModal()}
              >
                <Plus size={20} />
              </Button>
            </Col>
            {/* Restaurant and Format Dropdowns (Center) */}
            <Col xs={12} md={6} className="mb-2 mb-md-0">
              <Row className="align-items-center">
                <Col xs={6} md={6}>
                  <Form.Group controlId="restaurantSelect">
                    <Form.Label className="mb-1">Restaurant</Form.Label>
                    <Form.Select
                      value={selectedRestaurantName}
                      onChange={(e) =>
                        setSelectedRestaurantName(e.target.value)
                      }
                    >
                      <option value="">Select Restaurant</option>
                      {restaurants.map((restaurant) => (
                        <option key={restaurant._id} value={restaurant.nameRes}>
                          {restaurant.nameRes || restaurant.address}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={6} md={6}>
                  <Form.Group controlId="formatSelect">
                    <Form.Label className="mb-1">Format</Form.Label>
                    <Form.Select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <option value="pdf">PDF</option>
                      <option value="xlsx">Excel</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            {/* Export and Generate Buttons (Right) */}
            <Col
              xs={12}
              md={4}
              className="d-flex justify-content-md-end mb-2 mb-md-0"
            >
              <Row className="w-100">
                <Col xs={6} md={6}>
                  <Button
                    variant="info"
                    className="w-100"
                    onClick={handleGeneratePurchaseOrder}
                    disabled={!selectedRestaurantName}
                  >
                    <FileText size={20} className="me-2" />
                    Generate
                  </Button>
                </Col>
                <Col xs={6} md={6}>
                  <Button
                    variant="info"
                    className="w-100"
                    onClick={exportToExcel}
                  >
                    <i className="fa fa-file-excel fa-md me-2" />
                    Export
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          {error && (
            <div
              className="alert alert-danger rounded"
              role="alert"
              style={{ padding: "10px" }}
            >
              {error}
            </div>
          )}
          <GlobalFilter
            filter={tableState.globalFilter}
            setFilter={(val) =>
              setTableState((prev) => ({ ...prev, globalFilter: val }))
            }
          />
          <AdminTable
            admins={restaurants}
            tableState={tableState}
            setTableState={setTableState}
            openModal={openModal}
            type="restaurant"
          />
          <PaginationControls
            tableState={tableState}
            setTableState={setTableState}
            admins={restaurants}
          />
        </div>
      </div>
      <RestaurantModal
        modalState={modalState}
        setModalState={setModalState}
        type="restaurant"
      />
    </div>
  );
}
