import React, { useState, useEffect } from "react";
import { Button, Tab, Nav } from "react-bootstrap";

const Profile = () => {
  const [user, setUser] = useState({
    role: "Admin",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    address: "123 Main Street",
    salary: 5000,
    image: "",
  });

  const [formData, setFormData] = useState(user);
  const [modifiedFields, setModifiedFields] = useState({});
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("About");

  useEffect(() => {
    setFormData(user);
    setModifiedFields({});
    setErrors({});
  }, [user]);

  // Validation des champs
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (value.length < 3) {
            error = "Doit contenir plus de 3 caractères.";
          } else if (/\d/.test(value)) {
            error = "Ne doit pas contenir de chiffres.";
          }
          break;
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|tn)$/.test(value))
          error = "Email invalide (doit contenir @ et finir par .com ou .tn).";
        break;
      case "phone":
        if (!/^\d+$/.test(value)) {
            error = "Le numéro de téléphone doit contenir uniquement des chiffres.";
          } else if (value.length !== 8) {
            error = "Le numéro de téléphone doit avoir exactement 8 caractères.";
          }
        break;
        case "address":
            // Vérifier que l'adresse contient à la fois des lettres et des chiffres
            if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
              error = "L'adresse doit être alphanumérique.";
            }
            break;
      case "salary":
        if (isNaN(value) || value < 0) error = "Doit être un nombre positif.";
        break;
      default:
        break;
    }

    return error;
  };

  // Gestion du changement des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });

    setModifiedFields({ ...modifiedFields, [name]: user[name] !== value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
        setModifiedFields({ ...modifiedFields, image: true });
        setErrors({ ...errors, image: false });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Vérifier si des champs sont invalides
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    // Empêcher la mise à jour si des erreurs existent
    if (Object.keys(newErrors).length > 0) {
      alert("Corrigez les erreurs avant de soumettre.");
      return;
    }

    setUser(formData);
    alert("Profil mis à jour !");
    setActiveTab("About");
  };

  return (
    <div className="container mt-4">
      <div className="card"  style={{
    border: "3px solid #ed869e", // Bordure avec la couleur #ed869e
    boxShadow: "0 4px 6px rgba(237, 134, 158, 0.3)", // Ombre subtile avec #ed869e
  }}>
  
        <div className="card-body">
          <Tab.Container activeKey={activeTab}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="About" onClick={() => setActiveTab("About")}>Profil</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Edit" onClick={() => setActiveTab("Edit")}>Modifier</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="About">
                <div className="text-center mb-3">
                  <img
                    src={user.image || "https://via.placeholder.com/150"}
                    alt="Profil"
                    className="rounded-circle"
                    width="200"
                    height="200"
                    style={{
                        border: "4px solid #ed869e", // Bordure autour de l'image
                      }}
                  />
                </div>
                <h4 className="text-primary">Informations du Profil</h4>
                <p><strong className="text-primary">Nom :</strong> {user.firstName} {user.lastName}</p>
                <p><strong className="text-primary">Email :</strong> {user.email}</p>
                <p><strong className="text-primary">Téléphone :</strong> {user.phone}</p>
                <p><strong className="text-primary">Adresse :</strong> {user.address}</p>
                <p><strong className="text-primary">Rôle :</strong> {user.role}</p>
                {user.role === "Employee" && <p><strong>Salaire :</strong> {user.salary}€</p>}
              </Tab.Pane>

              <Tab.Pane eventKey="Edit">
                <h4 className="text-danger">Modifier le Profil</h4>
                <form onSubmit={handleUpdate}>
                  <div className="text-center mb-3">
                    <img
                      src={formData.image || "https://via.placeholder.com/150"}
                      alt="Profil"
                      className="rounded-circle"
                      width="150"
                      height="150"
                    />
                    <input type="file" accept="image/*" className="form-control mt-2" onChange={handleImageChange} />
                  </div>

                  {["firstName", "lastName", "email", "phone", "address", "salary"].map((field) => (
                    (field !== "salary" || user.role === "Employee") && (
                      <div className="mb-3" key={field}>
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                          type={field === "email" ? "email" : field === "salary" ? "number" : "text"}
                          name={field}
                          className={`form-control ${modifiedFields[field] ? "border border-warning" : ""} ${errors[field] ? "border border-danger" : ""}`}
                          style={{
                            borderWidth: errors[field] || modifiedFields[field] ? "3px" : "1px", // Change border width to 3px if there's an error or modification
                            borderColor: errors[field] ? "red" : modifiedFields[field] ? "orange" : "#ccc", // Change border color based on error or modification
                          }}
                          value={formData[field]}
                          onChange={handleChange}
                        />
                        {errors[field] && <div className="text-danger">{errors[field]}</div>}
                      </div>
                    )
                  ))}
                  <Button type="submit" className="btn btn-primary">Mettre à jour</Button>
                </form>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

export default Profile;
