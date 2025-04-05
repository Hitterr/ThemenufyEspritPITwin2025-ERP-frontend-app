import { useEffect, useState } from "react";
import useIngredientStore from "../../store/ingredientStore";
import { Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaPencilAlt, FaPlus, FaTrash, FaFilter } from "react-icons/fa";
import IngredientFilters from "./components/IngredientFilters";
import IngredientPagination from "./components/IngredientPagination";
const Ingredients = () => {
	const { filteredIngredients, fetchIngredients, deleteIngredient } =
		useIngredientStore();
	const [loading, setLoading] = useState(true);
	const [showFilters, setShowFilters] = useState(false);
	// Add pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 2;
	useEffect(() => {
		loadIngredients();
	}, []);
	const loadIngredients = async () => {
		await fetchIngredients();
		setLoading(false);
	};
	const handleDelete = async (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const success = await deleteIngredient(id);
				if (success) {
					Swal.fire("Deleted!", "Ingredient has been deleted.", "success");
				} else {
					Swal.fire("Error!", "Failed to delete ingredient.", "error");
				}
			}
		});
	};
	if (loading) {
		return <div>Loading...</div>;
	}
	// Calculate pagination
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredIngredients.slice(
		indexOfFirstItem,
		indexOfLastItem
	);
	const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};
	// Update the return statement to include pagination and use currentItems
	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-3">
				<Button variant="primary" onClick={() => setShowFilters(!showFilters)}>
					<FaFilter className="me-1" /> Filters
				</Button>
				<Link to="/ingredients/add">
					<Button variant="success">
						<FaPlus />
					</Button>
				</Link>
			</div>
			{showFilters && <IngredientFilters onClose={() => setShowFilters(false)} />}
			<Card>
				<Card.Body>
					<div className="table-responsive">
						<Table className="table-hover">
							<thead>
								<tr>
									<th>Name</th>
									<th>Type</th>
									<th>Stock</th>
									<th>Price</th>
									<th>Status</th>
									<th className="text-center" style={{ width: "150px" }}>
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{currentItems.map((ingredient) => (
									<tr key={ingredient._id}>
										<td>{ingredient.libelle}</td>
										<td>{ingredient.type}</td>
										<td>
											{ingredient.quantity} {ingredient.unit}
										</td>
										<td>${ingredient.price}</td>
										<td>
											<span
												className={`badge ${
													ingredient.disponibility ? "bg-success" : "bg-danger"
												}`}
											>
												{ingredient.disponibility ? "Available" : "Unavailable"}
											</span>
										</td>
										<td>
											<div className="d-flex justify-content-center gap-2">
												<Link
													to={`/ingredients/${ingredient._id}`}
													className="btn btn-sm btn-info"
													title="View"
												>
													<FaEye />
												</Link>
												<Link
													to={`/ingredients/edit/${ingredient._id}`}
													className="btn btn-sm btn-secondary"
													title="Edit"
												>
													<FaPencilAlt />
												</Link>
												<Button
													variant="danger"
													size="sm"
													title="Delete"
													onClick={() => handleDelete(ingredient._id)}
												>
													<FaTrash />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
					{filteredIngredients.length > 0 ? (
						<IngredientPagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					) : (
						<div className="text-center py-3">No ingredients found</div>
					)}
				</Card.Body>
			</Card>
		</>
	);
};
export default Ingredients;
