import React, { useState, useEffect } from "react";
import { Button, Tab, Nav, Card } from "react-bootstrap";
import backgroundImage from "@assets/images/backgroundRestaurant.jpg";

// Composant Profile qui gère l'affichage et la modification du profil utilisateur
const Profile = () => {
  // État initial de l'utilisateur avec ses informations de base
  const [user, setUser] = useState({
    role: "Admin",
    firstName: "Hadil",
    lastName: "Bouhachem",
    email: "hadil.bouhachem@esprit.tn",
    phone: "12345678",
    address: "2036 soukra",
    salary: 2000,
    image: "",
  });

  // État pour stocker les données du formulaire, initialisé avec les informations de l'utilisateur
  const [formData, setFormData] = useState(user);
  // État pour suivre les champs qui ont été modifiés
  const [modifiedFields, setModifiedFields] = useState({});
  // État pour stocker les messages d'erreur lors de la validation des champs
  const [errors, setErrors] = useState({});
  // État pour déterminer l'onglet actif ("About" pour affichage, "Edit" pour modification)
  const [activeTab, setActiveTab] = useState("About");

  // useEffect pour réinitialiser les données du formulaire et les erreurs lorsque l'état "user" change
  useEffect(() => {
    setFormData(user);
    setModifiedFields({});
    setErrors({});
  }, [user]);

  // Fonction pour valider un champ du formulaire selon son nom et sa valeur
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      // Validation pour le prénom et le nom
      case "firstName":
      case "lastName":
        // Doit contenir plus de 3 caractères et ne pas contenir de chiffres
        if (value.length < 3) {
          error = "Must be more than 3 characters.";
        } else if (/\d/.test(value)) {
          error = "Should not contain numbers.";
        }
        break;
      // Validation de l'email avec expression régulière
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|tn)$/.test(value))
          error = "Invalid email.";
        break;
      // Validation du numéro de téléphone : exactement 8 chiffres
      case "phone":
        if (!/^\d{8}$/.test(value)) {
          error = "Phone number must be 8 digits.";
        }
        break;
      // Validation de l'adresse : doit être alphanumérique
      case "address":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Address must be alphanumeric.";
        }
        break;
      // Validation du salaire : doit être un entier positif
      case "salary":
        if (!/^\d+$/.test(value)) {
          error = "Must be a positive integer.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Fonction de gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Met à jour formData avec la nouvelle valeur du champ
    setFormData({ ...formData, [name]: value });
    // Valide le champ et met à jour l'état des erreurs
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    // Indique si le champ a été modifié par rapport aux données initiales de l'utilisateur
    setModifiedFields({ ...modifiedFields, [name]: user[name] !== value });
  };

  // Fonction de gestion du changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Formats d'image autorisés : JPEG et PNG
      const allowedFormats = ["image/jpeg", "image/png"];

      // Vérifie que le fichier sélectionné est dans un format autorisé
      if (!allowedFormats.includes(file.type)) {
        alert("Please choose an image in .jpg or .png format!");
        return;
      }

      // Utilise FileReader pour lire le fichier et obtenir une URL au format Data
      const reader = new FileReader();
      reader.onload = () => {
        // Met à jour formData avec l'image lue
        setFormData({ ...formData, image: reader.result });
        // Marque le champ image comme modifié
        setModifiedFields({ ...modifiedFields, image: true });
        // Réinitialise l'erreur pour le champ image
        setErrors({ ...errors, image: false });
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction de gestion de la soumission du formulaire
  const handleUpdate = (e) => {
    e.preventDefault();
    const newErrors = {};
    // Valide tous les champs du formulaire
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    // Vérifie que l'image a bien été sélectionnée
    if (!formData.image) {
      newErrors.image = "Please choose an image.";
    }

    // Met à jour l'état des erreurs
    setErrors(newErrors);

    // Si des erreurs existent, affiche une alerte et annule la soumission
    if (Object.keys(newErrors).length > 0) {
      alert("Please fix the errors before submitting.");
      return;
    }
    // Met à jour les informations de l'utilisateur avec les données du formulaire
    setUser(formData);
    alert("Profile updated!");
    // Passe à l'onglet "About" pour afficher les informations mises à jour
    setActiveTab("About");
  };

  // Rendu du composant
  return (
    <div className="container mt-4">
      {/* Carte affichant le profil utilisateur avec un fond personnalisé */}
      <Card className="profile card-body px-3 pt-3 pb-0" style={{ border: "3px solid #ed869e", boxShadow: "0 5px 6px rgba(237, 134, 158, 0.3)" }}>
        <div className="profile-head">
          {/* Section avec image de fond */}
          <div className="photo-content" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", height: "400px" }}>
          </div>
          <div className="profile-info">
            <div className="profile-photo">
              {/* Affiche l'image de profil ou une image par défaut si aucune image n'est disponible */}
              <img
                src={user.image || "https://via.placeholder.com/150"}
                className="img-fluid rounded-circle"
                alt="profile" 
              />
            </div>
            <div className="profile-details">
              <div className="profile-name px-3 pt-2">
                <h4 className="text-primary mb-0">{user.firstName} {user.lastName}</h4>
                <p>{user.role}</p>
              </div>
              <div className="profile-email px-2 pt-2">
                <h4 className="text-muted mb-0">{user.email}</h4>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Carte contenant les onglets "Profil" et "Edit" */}
      <Card className="mt-4" style={{ border: "3px solid #ed869e", boxShadow: "0 4px 6px rgba(237, 134, 158, 0.3)" }}>
        <div className="card-body">
          <Tab.Container activeKey={activeTab}>
            {/* Navigation des onglets */}
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="About" onClick={() => setActiveTab("About")}>Profil</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Edit" onClick={() => setActiveTab("Edit")}>Edit</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Onglet affichant les informations du profil */}
              <Tab.Pane eventKey="About">
                <h4 className="text-primary">Informations du Profil</h4>
                <p><strong className="text-primary">Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong className="text-primary">Email :</strong> {user.email}</p>
                <p><strong className="text-primary">Phone :</strong> {user.phone}</p>
                <p><strong className="text-primary">Address :</strong> {user.address}</p>
                <p><strong className="text-primary">Rôle :</strong> {user.role}</p>
                {user.role === "Employee" && <p><strong className="text-primary">Salary :</strong> {user.salary}TND</p>}
              </Tab.Pane>
              {/* Onglet permettant de modifier les informations du profil */}
              <Tab.Pane eventKey="Edit">
                <form onSubmit={handleUpdate}>
                  {/* Champ pour sélectionner une image */}
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input type="file" accept="image/jpeg, image/png" className="form-control" onChange={handleImageChange} />
                    {/* Affiche une erreur si aucune image n'est sélectionnée */}
                    {errors.image && <div className="text-danger">{errors.image}</div>}
                  </div>
                  {/* Itération sur chaque champ de formData (sauf image et role) pour créer un input correspondant */}
                  {Object.keys(formData).map((field) => {
                  // Ne pas afficher le champ "image" et "role"
                  if (field === "image" ) return null;
                  // Ne pas afficher "salary" si le rôle n'est pas "Employee"
                  if (field === "salary" && formData.role !== "Employee") return null;

                  return (
                    <div className="mb-3" key={field}>
                      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        type="text"
                        name={field}
                        className={`form-control ${errors[field] ? "border-danger" : modifiedFields[field] ? "border-warning" : ""}`}
                        style={{ borderWidth: "3px" }}
                        value={formData[field]}
                        onChange={handleChange}
                      />
                      {/* Affiche le message d'erreur pour le champ si une erreur est présente */}
                      {errors[field] && <div className="text-danger">{errors[field]}</div>}
                    </div>
                  );
                  })}
                  {/* Bouton pour soumettre le formulaire et mettre à jour le profil */}
                  <Button type="submit" className="btn btn-primary">Update</Button>
                </form>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
