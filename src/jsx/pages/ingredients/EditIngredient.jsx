import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useIngredientStore from "../../store/ingredientStore";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editIngredientSchema } from "./validators/editIngredient";
import { units } from "./components/units";
import { useCategories } from "./queries/categoriesQuery";
import { FaPencilAlt } from "react-icons/fa";
import { Check, X } from "lucide-react";
const EditIngredient = ({ idIng }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const { data, isLoading } = useCategories();
  const { updateIngredient, getIngredientById, ingredients } =
    useIngredientStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editIngredientSchema),
    mode: "onChange",
    valueAsNumber: true, // Add this to handle numbers properly
  });
  useEffect(() => {
    loadIngredient();
  }, [idIng, show]);
  const loadIngredient = async () => {
    const ingredient = await getIngredientById(idIng);
    console.log(ingredient);
    if (ingredient) {
      // Convert numeric strings to numbers
      const formattedIngredient = {
        ...ingredient,
        quantity: Number(ingredient.quantity),
        price: Number(ingredient.price),
        maxQty: Number(ingredient.maxQty),
        minQty: Number(ingredient.minQty),
        type: ingredient.type._id,
      };
      reset(formattedIngredient);
    } else {
      navigate("/stock");
    }
  };
  const onSubmit = async (data) => {
    // Ensure numeric values
    const formData = {
      ...data,
      quantity: Number(data.quantity),
      price: Number(data.price),
      maxQty: Number(data.maxQty),
      minQty: Number(data.minQty),
    };
    const success = await updateIngredient(idIng, formData);
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Ingredient updated successfully",
      });
      reset();

      setShow(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update ingredient",
      });
    }
  };
  return (
    <>
      <Button variant="warning" className="w-100" onClick={handleShow}>
        <FaPencilAlt size={15} />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Edit Ingredient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
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
                      <option key={u} value={u} className="capitalize">
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
            <Row className="d-flex justify-content-between  p-2">
              <Col sm={5}>
                {" "}
                <Button
                  variant="secondary"
                  type="button"
                  className="w-100 "
                  onClick={() => {
                    reset();
                    setShow(false);
                  }}
                >
                  <X />
                </Button>
              </Col>
              <Col sm={5}>
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
export default EditIngredient;
