import { useEffect, useMemo, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import * as XLSX from "xlsx";
import AdminTable from "./AdminTable";
import PaginationControls from "./PaginationControls";
import AdminModal from "./AdminModal";
import useAdminStore from "../../../store/AdminStore";
import { GlobalFilter } from "../../../components/table/FilteringTable/GlobalFilter";
import { Plus } from "lucide-react";
export default function SuperDb() {
	const { admins, fetchAdmins } = useAdminStore();
	const [modalState, setModalState] = useState({
		show: false,
		isEditMode: false,
		selectedAdmin: null,
		viewMode: false,
	});
	const [tableState, setTableState] = useState({
		globalFilter: "",
		currentPage: 1,
		sortOrder: "asc",
	});
	useEffect(() => {
		fetchAdmins();
	}, [fetchAdmins]);
	// ✅ Appliquer le filtre ici
	const filteredAdmins = useMemo(() => {
		return admins.filter((admin) =>
			(admin.email || "")
				.toLowerCase()
				.includes(tableState.globalFilter.toLowerCase())
		);
	}, [admins, tableState.globalFilter]);
	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(filteredAdmins);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "SuperAdmins");
		XLSX.writeFile(workbook, "superadmins.xlsx");
	};
	const openModal = (admin = null, isEdit = false, viewMode = false) => {
		setModalState({
			show: true,
			isEditMode: isEdit,
			selectedAdmin: admin,
			viewMode,
		});
	};
	return (
		<div className="col-12">
			<div className="card">
				<div className="card-header d-flex justify-content-between">
					<Row className="w-100 align-items-center justify-content-between">
						<Col xs={4} md={2}>
							<Button variant="success" className="w-100" onClick={() => openModal()}>
								<Plus size={20} />
							</Button>
						</Col>
						<Col xs={4} md={2}>
							<Button variant="info" className="w-100" onClick={exportToExcel}>
								<i className="fa fa-file-excel fa-md me-2" />
							</Button>
						</Col>
					</Row>
				</div>
				<div className="card-body">
					<GlobalFilter
						filter={tableState.globalFilter}
						setFilter={(val) =>
							setTableState((prev) => ({ ...prev, globalFilter: val }))
						}
					/>
					<AdminTable
						admins={filteredAdmins}
						tableState={tableState}
						setTableState={setTableState}
						openModal={openModal}
					/>
					<PaginationControls
						tableState={tableState}
						setTableState={setTableState}
						admins={filteredAdmins}
					/>
				</div>
			</div>
			<AdminModal modalState={modalState} setModalState={setModalState} />
		</div>
	);
}
