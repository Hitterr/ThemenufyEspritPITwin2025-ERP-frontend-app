import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useIngredientStore from "../../store/ingredientStore";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addIngredientSchema } from "./validators/addIngredient";
import { units } from "./components/units";
import { useCategories } from "./queries/categoriesQuery";
import { useEffect, useState } from "react";
import { Carrot, Check, X } from "lucide-react";
const AddIngredient = () => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const navigate = useNavigate();
	const { addIngredient } = useIngredientStore();
	const { data, isLoading } = useCategories();
	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors, touchedFields },
	} = useForm({
		resolver: yupResolver(addIngredientSchema),
		mode: "onChange",
		defaultValues: {
			libelle: "",
			type: "",
			quantity: 0,
			unit: "",
			price: 0,
			disponibility: true,
			maxQty: 0,
			minQty: 0,
		},
	});
	useEffect(() => {
		console.log(errors);
		console.log(getValues());
	}, [getValues, errors, touchedFields]);
	const onSubmit = async (data) => {
		console.log(data);
		// Add the ingredient to the list of ingredients
		const success = await addIngredient(data);
		if (success) {
			Swal.fire({
				icon: "success",
				title: "Success!",
				text: "Ingredient added successfully",
			});
			navigate("/ingredients");
		} else {
			Swal.fire({
				icon: "error",
				title: "Error!",
				text: "Failed to add ingredient",
			});
		}
	};
	return (
		<>
			<Button variant="success" className="w-100" onClick={handleShow}>
				<Carrot size={20} />
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
					<Modal.Title>Add New Ingredient</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Row className="align-items-center">
							<Form.Group xs={12} sm={6} as={Col} className="mb-3">
								<Form.Label>Name</Form.Label>
								<Form.Control
									type="text"
									{...register("libelle")}
									isInvalid={!!errors.libelle}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.libelle?.message}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group xs={12} sm={6} as={Col} className="mb-3">
								<Form.Label>Type</Form.Label>
								<Form.Select
									{...register("type")}
									className="p-2 p-xl-3"
									isInvalid={!!errors.type}
									aria-placeholder="Select a Category"
								>
									{isLoading && <option value="">Loading...</option>}
									{data &&
										data?.map((type) => {
											return (
												<option key={type._id} value={type._id}>
													{type.name}
												</option>
											);
										})}
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									{errors.type?.message}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group xs={12} sm={6} as={Col} className="mb-3">
								<Form.Label>Quantity</Form.Label>
								<Form.Control
									{...register("quantity")}
									type="number"
									isInvalid={!!errors.quantity}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.quantity?.message}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group xs={12} sm={6} as={Col} className="mb-3">
								<Form.Label>Unit</Form.Label>
								<Form.Select
									{...register("unit")}
									className="p-2 p-xl-3"
									isInvalid={!!errors.unit}
									aria-placeholder="Select a Unit"
								>
									{units.map((u) => {
										return (
											<option key={u} value={u}>
												{u}
											</option>
										);
									})}
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									{errors.unit?.message}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group xs={12} sm={6} as={Col} className="mb-3">
								<Form.Label>Price</Form.Label>
								<Form.Control
									type="number"
									step="0.01"
									{...register("price")}
									isInvalid={!!errors.price}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.price?.message}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group xs={12} sm={6} as={Col} className="mb-3">
								<Form.Label>Maximum Quantity</Form.Label>
								<Form.Control
									type="number"
									{...register("maxQty")}
									isInvalid={!!errors.maxQty}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.maxQty?.message}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group xs={12} sm={6} as={Col} className="mb-3">
								<Form.Label>Minimum Quantity</Form.Label>
								<Form.Control
									type="number"
									{...register("minQty")}
									isInvalid={!!errors.minQty}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.minQty?.message}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group xs={12} sm={6} as={Col} className="mb-3">
								<Form.Label>Available</Form.Label>
								<Form.Check type="checkbox" {...register("disponibility")} />
							</Form.Group>
						</Row>
						<Row className="d-flex justify-content-between  p-2 w-100">
							<Col sm={6}>
								<Button
									className="w-100"
									variant="secondary"
									type="button"
									onClick={() => navigate("/ingredients")}
								>
									<X />
								</Button>
							</Col>
							<Col sm={6}>
								<Button variant="primary" className="w-100" type="submit">
									<Check />
								</Button>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};
export default AddIngredient;
