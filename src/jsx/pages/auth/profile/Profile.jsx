import React, { useState, useEffect } from "react";
import { Button, Tab, Nav, Card, Row, Col } from "react-bootstrap";
import backgroundImage from "@assets/images/backgroundRestaurant.jpg";
import EditForm from "./components/EditForm";

// Composant Profile qui gère l'affichage et la modification du profil utilisateur
const Profile = () => {
  const [activeTab, setActiveTab] = useState("About");
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



  // Rendu du composant
  return (
    <div className="container mt-4">
      {/* Carte affichant le profil utilisateur avec un fond personnalisé */}
      <Card className="profile card-body px-3 pt-3 pb-0 shadow" >
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
                width={50}
                height={50}
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
      <Card className="mt-4 shadow" >
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
               <EditForm/>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
