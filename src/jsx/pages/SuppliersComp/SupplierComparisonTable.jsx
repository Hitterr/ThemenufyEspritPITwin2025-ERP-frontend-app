import { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { apiRequest } from "../../utils/apiRequest";
export default function SupplierComparisonTable({ stockId }) {
	const [suppliers, setSuppliers] = useState([]);
	const [sortConfig, setSortConfig] = useState({
		key: "price",
		direction: "asc",
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		const fetchComparison = async () => {
			setLoading(true);
			try {
				const res = await apiRequest.get("/suppliersComparaison/compare", {
					params: {
						stockId,
						sortBy: sortConfig.key,
						order: sortConfig.direction,
					},
				});
				if (res.data.success) {
					// Ensure price and deliveryTime have default values
					const enrichedData = res.data.data.map((supplier) => ({
						...supplier,
						price: supplier.price ?? 0, // Default to 0 if undefined
						deliveryTime: supplier.deliveryTime ?? 0, // Default to 0 if undefined
					}));
					setSuppliers(enrichedData);
				} else {
					setError("Erreur API");
				}
			} catch (err) {
				setError("Erreur de chargement");
			} finally {
				setLoading(false);
			}
		};
		fetchComparison();
	}, [stockId, sortConfig]);
	const handleSort = (key) => {
		setSortConfig((prev) => ({
			key,
			direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
		}));
	};
	if (loading) return <Spinner animation="border" />;
	if (error) return <Alert variant="danger">{error}</Alert>;
	return (
		<Table hover className="text-center shadow-sm">
			<thead className=" text-white">
				<tr>
					<th
						onClick={() => handleSort("supplierName")}
						style={{ cursor: "pointer" }}
					>
						<i className="fas fa-building me-2 text-info"></i>
						<span className="text-dark">Fournisseur</span>
						{sortConfig.key === "supplierName" ? (
							sortConfig.direction === "asc" ? (
								<i className="fas fa-sort-up ms-2 text-secondary" />
							) : (
								<i className="fas fa-sort-down ms-2 text-secondary" />
							)
						) : (
							<i className="fas fa-sort ms-2 text-muted" />
						)}
					</th>
					<th onClick={() => handleSort("price")} style={{ cursor: "pointer" }}>
						<i className="fas fa-euro-sign me-2 text-success"></i>
						<span className="text-dark">Prix</span>
						{sortConfig.key === "price" ? (
							sortConfig.direction === "asc" ? (
								<i className="fas fa-sort-up ms-2 text-secondary" />
							) : (
								<i className="fas fa-sort-down ms-2 text-secondary" />
							)
						) : (
							<i className="fas fa-sort ms-2 text-muted" />
						)}
					</th>
					<th
						onClick={() => handleSort("deliveryTime")}
						style={{ cursor: "pointer" }}
					>
						<i className="fas fa-truck me-2 text-warning"></i>
						<span className="text-dark">Délai</span>
						{sortConfig.key === "deliveryTime" ? (
							sortConfig.direction === "asc" ? (
								<i className="fas fa-sort-up ms-2 text-secondary" />
							) : (
								<i className="fas fa-sort-down ms-2 text-secondary" />
							)
						) : (
							<i className="fas fa-sort ms-2 text-muted" />
						)}
					</th>
				</tr>
			</thead>
			<tbody>
				{suppliers.length > 0 ? (
					suppliers.map((s) => (
						<tr key={s.supplierId}>
							<td>{s.supplierName}</td>
							<td>{s.price.toFixed(2)} €</td>
							<td>{s.deliveryTime} j</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan="3" className="text-muted">
							Aucun fournisseur trouvé.
						</td>
					</tr>
				)}
			</tbody>
		</Table>
	);
}
