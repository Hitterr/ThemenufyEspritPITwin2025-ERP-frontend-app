import { Card, Form, Button } from "react-bootstrap";
   import { useNavigate, useParams } from "react-router-dom";
   import useSupplierStore from "../../store/supplierStore";
   import useIngredientStore from "../../store/ingredientStore";
   import Swal from "sweetalert2";
   import { useForm } from "react-hook-form";
   import { yupResolver } from "@hookform/resolvers/yup";
   import { linkIngredientSchema } from "./validators/linkIngredient";
   import { useEffect } from "react";

   const LinkIngredient = () => {
     const navigate = useNavigate();
     const { id: supplierId } = useParams();
     const { linkIngredient, fetchSuppliers } = useSupplierStore();
     const { ingredients, fetchIngredients } = useIngredientStore();
     const {
       register,
       handleSubmit,
       formState: { errors },
     } = useForm({
       resolver: yupResolver(linkIngredientSchema),
       mode: "onChange",
       defaultValues: {
         ingredientId: "",
         pricePerUnit: 0,
         leadTimeDays: 1,
       },
     });

     useEffect(() => {
       fetchIngredients();
     }, []);

     const onSubmit = async (data) => {
       try {
         const success = await linkIngredient(supplierId, data);
         if (success) {
           await fetchSuppliers(); // Refresh the supplier list
           Swal.fire({
             icon: "success",
             title: "Success!",
             text: "Ingredient linked successfully",
           });
           navigate(`/suppliers/${supplierId}`);
         } else {
           throw new Error("Failed to link ingredient");
         }
       } catch (error) {
         const errorMessage = error.response?.data?.message || "Failed to link ingredient";
         Swal.fire({
           icon: "error",
           title: "Error!",
           text: errorMessage,
         });
       }
     };

     return (
       <Card>
         <Card.Header>
           <Card.Title>Link Ingredient to Supplier</Card.Title>
         </Card.Header>
         <Card.Body>
           <Form onSubmit={handleSubmit(onSubmit)}>
             <Form.Group className="mb-3">
               <Form.Label>Ingredient</Form.Label>
               <Form.Control
                 as="select"
                 {...register("ingredientId")}
                 isInvalid={!!errors.ingredientId}
               >
                 <option value="">Select an ingredient</option>
                 {ingredients.map((ingredient) => (
                   <option key={ingredient._id} value={ingredient._id}>
                     {ingredient.libelle}
                   </option>
                 ))}
               </Form.Control>
               <Form.Control.Feedback type="invalid">
                 {errors.ingredientId?.message}
               </Form.Control.Feedback>
             </Form.Group>
             <Form.Group className="mb-3">
               <Form.Label>Price per Unit</Form.Label>
               <Form.Control
                 type="number"
                 step="0.01"
                 {...register("pricePerUnit")}
                 isInvalid={!!errors.pricePerUnit}
               />
               <Form.Control.Feedback type="invalid">
                 {errors.pricePerUnit?.message}
               </Form.Control.Feedback>
             </Form.Group>
             <Form.Group className="mb-3">
               <Form.Label>Lead Time (Days)</Form.Label>
               <Form.Control
                 type="number"
                 {...register("leadTimeDays")}
                 isInvalid={!!errors.leadTimeDays}
               />
               <Form.Control.Feedback type="invalid">
                 {errors.leadTimeDays?.message}
               </Form.Control.Feedback>
             </Form.Group>
             <div className="d-flex gap-2">
               <Button variant="primary" type="submit">
                 Link Ingredient
               </Button>
               <Button
                 variant="secondary"
                 type="button"
                 onClick={() => navigate(`/suppliers/${supplierId}`)}
               >
                 Cancel
               </Button>
             </div>
           </Form>
         </Card.Body>
       </Card>
     );
   };

   export default LinkIngredient;