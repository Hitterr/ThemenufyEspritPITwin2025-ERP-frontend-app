import TopSuppliersByDelivery from "../../suppliers/components/TopSuppliersByDelivery";
import SupplierStats from "../../suppliers/components/SupplierStats";
import InventorySupplierManager from "../../SuppliersComp/InventorySupplierManager";
import { Card, Col } from "react-bootstrap";
const SuppliersDashboard = () => {
	return (
		<Card className="p-5">
			<div className="row">
				<Col xs={12} className=" mb-4">
					<SupplierStats showStats={true} />
				</Col>
				<Col xs={12} lg={6} className=" mb-4">
					<TopSuppliersByDelivery />
				</Col>
				<Col xs={12} lg={6} className=" mb-4">
					<InventorySupplierManager />
				</Col>
			</div>
		</Card>
	);
};
export default SuppliersDashboard;
