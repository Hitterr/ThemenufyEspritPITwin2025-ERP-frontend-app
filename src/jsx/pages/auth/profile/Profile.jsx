import React, { useState, useEffect } from "react";
import { Button, Tab, Nav, Card } from "react-bootstrap";
import backgroundImage from "@assets/images/backgroundRestaurant.jpg";

const Profile = () => {
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

  const [formData, setFormData] = useState(user);
  const [modifiedFields, setModifiedFields] = useState({});
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("About");

  useEffect(() => {
    setFormData(user);
    setModifiedFields({});
    setErrors({});
  }, [user]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        if (value.length < 3) {
          error = "Must be more than 3 characters.";
        } else if (/\d/.test(value)) {
          error = "Should not contain numbers.";
        }
        break;
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|tn)$/.test(value))
          error = "Invalid email.";
        break;
      case "phone":
        if (!/^\d{8}$/.test(value)) {
          error = "Phone number must be 8 digits.";
        }
        break;
      case "address":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Address must be alphanumeric.";
        }
        break;
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
      const allowedFormats = ["image/jpeg", "image/png"];
  
      if (!allowedFormats.includes(file.type)) {
        alert("Please choose an image in .jpg or .png format!");

        return;
      }
  
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
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    // Check if image is empty
    if (!formData.image) {
      newErrors.image = "Please choose an image.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("Please fix the errors before submitting.");
      return;
    }
    setUser(formData);
    alert("Profile updated!");
    setActiveTab("About");
  };

  return (
    <div className="container mt-4">
      <Card className="profile card-body px-3 pt-3 pb-0" style={{ border: "3px solid #ed869e", boxShadow: "0 5px 6px rgba(237, 134, 158, 0.3)" }}>
        <div className="profile-head">
          <div className="photo-content" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", height: "400px" }}>
          </div>
          <div className="profile-info">
            <div className="profile-photo">
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

      <Card className="mt-4" style={{ border: "3px solid #ed869e", boxShadow: "0 4px 6px rgba(237, 134, 158, 0.3)" }}>
        <div className="card-body">
          <Tab.Container activeKey={activeTab}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="About" onClick={() => setActiveTab("About")}>Profil</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Edit" onClick={() => setActiveTab("Edit")}>Edit</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="About">
                <h4 className="text-primary">Informations du Profil</h4>
                <p><strong className="text-primary">Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong className="text-primary">Email :</strong> {user.email}</p>
                <p><strong className="text-primary">Phone :</strong> {user.phone}</p>
                <p><strong className="text-primary">Address :</strong> {user.address}</p>
                <p><strong className="text-primary">Rôle :</strong> {user.role}</p>
                {user.role === "Employee" && <p><strong>Salary :</strong> {user.salary}TND</p>}
              </Tab.Pane>
              <Tab.Pane eventKey="Edit">
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input type="file" accept="image/jpeg, image/png" className="form-control" onChange={handleImageChange} />
                    {errors.image && <div className="text-danger">{errors.image}</div>}
                  </div>
                  {Object.keys(formData).map((field) => (
                    field !== "image" && field !== "role" &&
                    <div className="mb-3" key={field}>
                      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        type="text"
                        name={field}
                        className={`form-control ${errors[field] ? "border-danger" : modifiedFields[field] ? "border-warning" : ""}`}
                        value={formData[field]}
                        onChange={handleChange}
                      />
                      {errors[field] && <div className="text-danger">{errors[field]}</div>}
                    </div>
                  ))}
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
