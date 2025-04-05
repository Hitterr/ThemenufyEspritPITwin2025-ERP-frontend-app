import { useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useIngredientStore from "../../store/ingredientStore";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editIngredientSchema } from "./validators/editIngredient";
const EditIngredient = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { updateIngredient, getIngredientById } = useIngredientStore();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(editIngredientSchema),
		mode: "onChange",
	});
	useEffect(() => {
		loadIngredient();
	}, [id]);
	const loadIngredient = async () => {
		const ingredient = await getIngredientById(id);
		if (ingredient) {
			reset(ingredient); // Reset form with ingredient data
		} else {
			navigate("/ingredients");
		}
	};
	const onSubmit = async (data) => {
		const success = await updateIngredient(id, data);
		if (success) {
			Swal.fire({
				icon: "success",
				title: "Success!",
				text: "Ingredient updated successfully",
			});
			navigate("/ingredients");
		} else {
			Swal.fire({
				icon: "error",
				title: "Error!",
				text: "Failed to update ingredient",
			});
		}
	};
	return (
		<Card>
			<Card.Header>
				<Card.Title>Edit Ingredient</Card.Title>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Form.Group className="mb-3">
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
					<Form.Group className="mb-3">
						<Form.Label>Type</Form.Label>
						<Form.Control
							type="text"
							{...register("type")}
							isInvalid={!!errors.type}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.type?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Quantity</Form.Label>
						<Form.Control
							type="number"
							{...register("quantity")}
							isInvalid={!!errors.quantity}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.quantity?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Unit</Form.Label>
						<Form.Control
							type="text"
							{...register("unit")}
							isInvalid={!!errors.unit}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.unit?.message}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className="mb-3">
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
					<Form.Group className="mb-3">
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
					<Form.Group className="mb-3">
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
					<Form.Group className="mb-3">
						<Form.Check
							type="checkbox"
							label="Available"
							{...register("disponibility")}
						/>
					</Form.Group>
					<div className="d-flex gap-2">
						<Button variant="primary" type="submit">
							Update Ingredient
						</Button>
						<Button
							variant="secondary"
							type="button"
							onClick={() => navigate("/ingredients")}
						>
							Cancel
						</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
};
export default EditIngredient;
