import { useState, useEffect } from "react";
import { Table, Button, Form, Row, Col, Collapse, Card } from "react-bootstrap";
import axios from "axios";
import SupplierComparisonTable from "./SupplierComparisonTable";
import Chatbot from "./Chatbot";
import { apiRequest } from "../../utils/apiRequest";
export default function InventorySupplierManager() {
	const [inventory, setInventory] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStock, setFilterStock] = useState("all");
	const [selectedItems, setSelectedItems] = useState([]);
	const [showComparison, setShowComparison] = useState(null);
	const [bulkField, setBulkField] = useState("minQty");
	const [bulkValue, setBulkValue] = useState("");
	const [showChatbot, setShowChatbot] = useState(false);
	const [showFilters, setShowFilters] = useState(false); // ✅ Ajouter état pour montrer/masquer filtres
	useEffect(() => {
		const fetchInventory = async () => {
			try {
				const { data } = await apiRequest.get("http://localhost:5000/api/stock");
				if (data.success) setInventory(data.data);
				else console.error("API error:", data.message);
			} catch (error) {
				console.error("Failed to fetch inventory:", error);
			}
		};
		fetchInventory();
	}, []);
	const filteredInventory = inventory.filter((item) => {
		const matchesSearch = item.libelle
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesFilter =
			filterStock === "all" ||
			(filterStock === "low" && item.quantity < item.minQty) ||
			(filterStock === "critical" && item.quantity === 0);
		return matchesSearch && matchesFilter;
	});
	const handleSelect = (id) => {
		setSelectedItems((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};
	const handleBulkEdit = async () => {
		if (!bulkField || bulkValue === "") {
			return alert("Please fill in all fields.");
		}
		const payload = {
			ids: selectedItems,
			update: { [bulkField]: Number(bulkValue) },
		};
		try {
			const response = await axios.patch(
				"http://localhost:5000/api/stock/bulk",
				payload
			);
			if (response.data.success) {
				setInventory((prev) =>
					prev.map((item) =>
						selectedItems.includes(item._id) ? { ...item, ...payload.update } : item
					)
				);
				setSelectedItems([]);
				setBulkValue("");
				alert("Bulk update successful!");
			} else {
				console.error("API error:", response.data.message);
			}
		} catch (error) {
			console.error("Failed bulk update:", error);
			alert("Error occurred during bulk update.");
		}
	};
	return (
		<div>
			<Card.Header className="mb-3">
				<h3 className="">Inventory and Supplier Management</h3>
			</Card.Header>
			<Card.Body>
				{/* Chatbot and Filters Button */}
				<Row className="mb-4 d-flex justify-content-between align-items-center">
					<Col>
						{" "}
						<Button
							variant="secondary"
							onClick={() => setShowFilters(!showFilters)}
							className="   rounded-3 w-100 text-center"
						>
							<i className="fas fa-filter mx-2"></i>{" "}
							{showFilters ? "Hide Filters" : "Show Filters"}
						</Button>
					</Col>
					<Col>
						{" "}
						<Button
							variant="primary"
							onClick={() => setShowChatbot(true)}
							className="   rounded-3 w-100 text-center"
						>
							<i className="fas fa-robot mx-2"></i> Chatbot
						</Button>
					</Col>
				</Row>
				{/* Chatbot Modal */}
				<Chatbot show={showChatbot} onHide={() => setShowChatbot(false)} />
				{/* Filters */}
				<Collapse in={showFilters}>
					<div>
						<Row className=" align-items-center">
							<Form.Group xs={12} className="p-2" as={Col}>
								<Form.Control
									type="text"
									placeholder="Search by Name"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="ps-5 rounded-3"
								/>
							</Form.Group>
							<Form.Group xs={6} lg={4} className="p-2" as={Col}>
								<Form.Control
									as="select"
									value={filterStock}
									onChange={(e) => setFilterStock(e.target.value)}
									className="rounded-3"
								>
									<option value="all">📦 All</option>
									<option value="low">🟡 Low Stock</option>
									<option value="critical">🔴 Critical Stock</option>
								</Form.Control>
							</Form.Group>
							<Form.Group xs={6} lg={4} className="p-2" as={Col}>
								<Form.Control
									as="select"
									value={bulkField}
									onChange={(e) => setBulkField(e.target.value)}
									className="rounded-3"
								>
									<option value="minQty">Minimum Quantity</option>
									<option value="maxQty">Maximum Quantity</option>
									<option value="price">Price</option>
								</Form.Control>
							</Form.Group>
							<Form.Group xs={6} lg={4} className="p-2" as={Col}>
								<Form.Control
									type="number"
									placeholder="Price"
									value={bulkValue}
									onChange={(e) => setBulkValue(e.target.value)}
									className="rounded-3"
								/>
							</Form.Group>
							<Form.Group xs={12} className="p-2" as={Col}>
								<Button
									variant="danger"
									className="w-100 rounded-3 "
									onClick={handleBulkEdit}
									disabled={selectedItems.length === 0 || bulkValue === ""}
								>
									<i className="fas fa-save"></i> Apply Bulk Update
								</Button>
							</Form.Group>
						</Row>
					</div>
				</Collapse>
				{/* Inventory Table */}
				<Table hover responsive>
					<thead className=" text-center">
						<tr>
							<th>Select</th>
							<th>Name</th>
							<th>Quantity</th>
							<th>Unit</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{filteredInventory.length > 0 ? (
							filteredInventory.map((item) => (
								<tr key={item._id}>
									<td>
										<Form.Check
											checked={selectedItems.includes(item._id)}
											onChange={() => handleSelect(item._id)}
										/>
									</td>
									<td>{item.libelle}</td>
									<td>{item.quantity}</td>
									<td>{item.unit}</td>
									<td className="text-center">
										<Button
											variant="outline-primary"
											size="sm"
											className="d-flex align-items-center gap-2 px-2 py-1 rounded-2 mx-auto"
											onClick={() => setShowComparison(item._id)}
										>
											<i className="fas fa-balance-scale"></i>
											<span className="d-none d-md-inline">Compare</span>
										</Button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="5" className="text-muted">
									No stocks found.
								</td>
							</tr>
						)}
					</tbody>
				</Table>
				{/* Supplier Comparison */}
				{showComparison && (
					<div className="mt-4">
						<h3 className="mb-4 text-center">Supplier Comparison</h3>
						<SupplierComparisonTable stockId={showComparison} />
					</div>
				)}
			</Card.Body>
		</div>
	);
}
