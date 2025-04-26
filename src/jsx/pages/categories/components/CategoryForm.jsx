import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Button, Row, Col } from "react-bootstrap";
import { categorySchema } from "../validators/categorySchema";
import { Check, X } from "lucide-react";
const CategoryForm = ({ initialData, onSubmit, onCancel }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(categorySchema),
		defaultValues: initialData,
	});
	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Form.Group className="mb-3">
				<Form.Label>Name</Form.Label>
				<Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
				<Form.Control.Feedback type="invalid">
					{errors.name?.message}
				</Form.Control.Feedback>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Description</Form.Label>
				<Form.Control
					as="textarea"
					rows={3}
					{...register("description")}
					isInvalid={!!errors.description}
				/>
				<Form.Control.Feedback type="invalid">
					{errors.description?.message}
				</Form.Control.Feedback>
			</Form.Group>
			<Row className="d-flex justify-content-between  p-2 w-100">
				<Col sm={6}>
					<Button variant="secondary" className="w-100" onClick={onCancel}>
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
	);
};
export default CategoryForm;
