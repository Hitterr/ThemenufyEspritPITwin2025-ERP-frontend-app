import React from "react";
import { Tab, Nav, Card, Row, Col } from "react-bootstrap";
import { authStore } from "../../../store/authStore";
import ProfileHeader from "./components/ProfileHeader";
import EditForm from "./components/EditForm";
import { ToastContainer } from "react-toastify";
import { BsPersonCircle, BsBriefcaseFill, BsShop } from "react-icons/bs"; // Icônes Bootstrap

const Profile = () => {
  const { currentUser, profile, setActiveTab } = authStore();

  return (
    <div className="container mt-4">
      <ToastContainer />
      <ProfileHeader />

      <Card className="mt-4 shadow border-0 rounded">
        <div className="card-body">
          <Tab.Container activeKey={profile.tab}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link
                  eventKey="About"
                  onClick={() => setActiveTab("About")}
                >
                  Profil
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Edit" onClick={() => setActiveTab("Edit")}>
                  Edit
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Section About */}
              <Tab.Pane eventKey="About">
                <h4 className="text-primary mb-4">Mon Profil</h4>

                {/* 🧑 User Info */}
                <Card
                  className="mb-4 border-0 shadow-sm p-3 rounded"
                  style={{ backgroundColor: "#FAE9EE", opacity: 0.9 }}
                >
                  <Row className="align-items-center">
                    <Col xs={3} className="text-center">
                      <BsPersonCircle size={60} style={{ color: "#EA7B9B" }} />
                    </Col>
                    <Col>
                      <h5 style={{ color: "#EA7B9B" }}>🧑 User Info</h5>
                      {Object.keys(currentUser).map((field) => {
                        if (["restaurant", "employee", "image"].includes(field))
                          return null;

                        return (
                          <p key={field} className="mb-1">
                            <strong className="text-capitalize text-black">
                              {field}:
                            </strong>{" "}
                            {field === "phone" && "+"} {currentUser[field]}
                          </p>
                        );
                      })}
                    </Col>
                  </Row>
                </Card>

                {/* 💼 Employee Info */}
                {currentUser.employee && (
                  <Card
                    className="mb-4 border-0 shadow-sm p-3 rounded"
                    style={{ backgroundColor: "#FAE9EE", opacity: 0.9 }}
                  >
                    <Row className="align-items-center">
                      <Col xs={3} className="text-center">
                        <BsBriefcaseFill
                          size={60}
                          style={{ color: "#EA7B9B" }}
                        />
                      </Col>
                      <Col>
                        <h5 style={{ color: "#EA7B9B" }}>💼 Employee Info</h5>
                        {Object.keys(currentUser.employee).map((field) => (
                          <p key={field} className="mb-1">
                            <strong className="text-capitalize text-black">
                              {field}:
                            </strong>{" "}
                            {currentUser.employee[field]}{" "}
                            {field === "salary" && "TND"}
                          </p>
                        ))}
                      </Col>
                    </Row>
                  </Card>
                )}

                {/* 🍽️ Restaurant Info */}
                {currentUser.restaurant && (
                  <Card
                    className="mb-4 border-0 shadow-sm p-3 rounded"
                    style={{ backgroundColor: "#FAE9EE", opacity: 0.9 }}
                  >
                    <Row className="align-items-center">
                      <Col xs={3} className="text-center">
                        <BsShop size={60} style={{ color: "#EA7B9B" }} />
                      </Col>
                      <Col>
                        <h5 style={{ color: "#EA7B9B" }}>🍽️ Restaurant Info</h5>
                        {Object.keys(currentUser.restaurant).map((field) => (
                          <p key={field} className="mb-1">
                            <strong className="text-capitalize text-black">
                              {field}:
                            </strong>{" "}
                            {currentUser.restaurant[field]}
                          </p>
                        ))}
                      </Col>
                    </Row>
                  </Card>
                )}
              </Tab.Pane>

              {/* Section Edit */}
              <Tab.Pane eventKey="Edit">
                <EditForm />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
