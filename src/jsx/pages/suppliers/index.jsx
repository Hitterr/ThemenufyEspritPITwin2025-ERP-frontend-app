import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import useSupplierStore from "../../store/supplierStore";
import SupplierFilters from "./components/SupplierFilters";
import SupplierPagination from "./components/SupplierPagination";
import Swal from "sweetalert2";
import { Filter, Plus } from "lucide-react";
const Suppliers = () => {
	const {
		filteredSuppliers,
		fetchSuppliers,
		deleteSupplier,
		pagination,
		setFilterCriteria,
	} = useSupplierStore();
	const [loading, setLoading] = useState(true);
	const [showFilters, setShowFilters] = useState(false);
	useEffect(() => {
		loadSuppliers();
	}, []);
	const loadSuppliers = async () => {
		await fetchSuppliers();
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
				try {
					const success = await deleteSupplier(id);
					if (success) {
						await loadSuppliers();
						setFilterCriteria({ page: 1 });
						Swal.fire("Deleted!", "Supplier has been deleted.", "success");
					} else {
						throw new Error("Failed to delete supplier");
					}
				} catch (error) {
					Swal.fire(
						"Error!",
						error.response?.data?.message || "Failed to delete supplier.",
						"error"
					);
				}
			}
		});
	};
	const handlePageChange = (pageNumber) => {
		setFilterCriteria({ page: pageNumber });
	};
	if (loading)
		return <div style={{ textAlign: "center", padding: "1rem" }}>Loading...</div>;
	return (
		<Card>
			<Card.Header>
				<Row className="w-100 justify-content-between align-items-center">
					<Col xs={4} md={2} className="">
						<Link to="/suppliers/add">
							<Button variant="success" className="w-100 h-100">
								<Plus size={20} />
							</Button>
						</Link>{" "}
					</Col>{" "}
					<Col xs={4} md={2} className="">
						<Button
							variant="primary"
							onClick={() => setShowFilters(!showFilters)}
							className="w-100 h-100"
						>
							<Filter size={20} />
						</Button>
					</Col>
				</Row>
			</Card.Header>
			<Card.Body>
				<div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3"></div>
				{showFilters && <SupplierFilters onClose={() => setShowFilters(false)} />}
				<div className="table-responsive">
					<Table hover className="">
						<thead>
							<tr>
								<th style={{ padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem" }}>
									Name
								</th>
								<th style={{ padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem" }}>
									Email
								</th>
								<th
									className="d-none d-md-table-cell"
									style={{ padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem" }}
								>
									Status
								</th>
								<th
									className="d-none d-lg-table-cell"
									style={{ padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem" }}
								>
									Restaurant
								</th>
								<th
									className="text-center"
									style={{
										width: "150px",
										padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem",
									}}
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredSuppliers.map((supplier) => (
								<tr key={supplier._id}>
									<td style={{ padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem" }}>
										{supplier.name}
									</td>
									<td style={{ padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem" }}>
										{supplier.contact.email}
									</td>
									<td
										className="d-none d-md-table-cell"
										style={{ padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem" }}
									>
										<span
											className={`badge ${
												supplier.status === "active"
													? "bg-success"
													: supplier.status === "pending"
													? "bg-warning"
													: supplier.status === "suspended"
													? "bg-danger"
													: supplier.status === "inactive"
													? "bg-secondary"
													: "bg-secondary"
											}`}
											style={{ fontSize: window.innerWidth < 768 ? "0.7rem" : "0.8rem" }}
										>
											{supplier.status}
										</span>
									</td>
									<td
										className="d-none d-lg-table-cell"
										style={{ padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem" }}
									>
										{supplier.restaurantId ? supplier.restaurantId.nameRes : "N/A"}
									</td>
									<td style={{ padding: window.innerWidth < 768 ? "0.4rem" : "0.5rem" }}>
										<div className="d-flex flex-column flex-md-row justify-content-center gap-2">
											<Link
												to={`/suppliers/${supplier._id}`}
												className="btn btn-sm btn-info flex-grow-1"
												title="View"
												style={{
													minWidth: "40px",
													padding: window.innerWidth < 768 ? "0.3rem" : "0.25rem 0.5rem",
												}}
											>
												<FaEye />
											</Link>
											<Link
												to={`/suppliers/edit/${supplier._id}`}
												state={{ redirectTo: "/suppliers" }}
												className="btn btn-sm btn-secondary flex-grow-1"
												title="Edit"
												style={{
													minWidth: "40px",
													padding: window.innerWidth < 768 ? "0.3rem" : "0.25rem 0.5rem",
												}}
											>
												<FaPencilAlt />
											</Link>
											<Button
												variant="danger"
												size=" among the smallest available in Bootstrap"
												title="Delete"
												onClick={() => handleDelete(supplier._id)}
												className="flex-grow-1"
												style={{
													minWidth: "40px",
													padding: window.innerWidth < 768 ? "0.3rem" : "0.25rem 0.5rem",
												}}
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
				{filteredSuppliers.length > 0 ? (
					<SupplierPagination
						currentPage={pagination.page}
						totalPages={pagination.pages}
						onPageChange={handlePageChange}
					/>
				) : (
					<div style={{ textAlign: "center", padding: "1rem" }}>
						No suppliers found
					</div>
				)}
			</Card.Body>
		</Card>
	);
};
export default Suppliers;
