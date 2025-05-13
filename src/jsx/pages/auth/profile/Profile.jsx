import React from "react";
import { Tab, Nav, Card, Row, Col } from "react-bootstrap";
import { authStore } from "../../../store/authStore";
import ProfileHeader from "./components/ProfileHeader";
import EditForm from "./components/EditForm";
import { ToastContainer } from "react-toastify";
import UpdatePassword from "./components/UpdatePassword";
import RegisterFaceButton from "../face-recognition/RegisterFaceButton";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { currentUser, profile, setActiveTab } = authStore();
  const hiddenFields = [
    "restaurant",
    "isEmailVerified",
    "employee",
    "image",
    "__v",
    "createdAt",
    "updatedAt",
    "verifiedDevices",
    "isVerified",
    "__t",
    "_id",
    "authProvider",
    "color",
    "logo",
    "payCashMethod",
    "images",
  ];
  // Fields for the two rows
  const firstRowFields = ["firstName", "lastName", "email"];
  const secondRowFields = ["phone", "address", "birthday"];
  // Role field to display below phone
  const roleField = "role";

  return (
    <div className="container mt-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ProfileHeader />

      <Card className="mt-4 shadow border-0 rounded">
        <div className="card-body">
          <Tab.Container activeKey={profile.tab}>
            <Nav variant="tabs" className="mb-3">
              {["About", "Settings", "Password"].map((tab) => (
                <Nav.Item key={tab}>
                  <Nav.Link
                    eventKey={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      color: profile.tab === tab ? "#F47F72" : "#6c757d",
                      borderBottom:
                        profile.tab === tab ? "2px solid #F47F72" : "none",
                      transition: "color 0.3s ease, border-bottom 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#F47F72")}
                    onMouseLeave={(e) =>
                      (e.target.style.color =
                        profile.tab === tab ? "#F47F72" : "#6c757d")
                    }
                  >
                    {tab === "About" ? "Profil" : tab}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="About">
                <h3
                  className="text-secondary mb-4"
                  style={{
                    borderBottom: "2px solid #F47F72",
                    paddingBottom: "10px",
                    display: "inline-block",
                  }}
                >
                  My Profile
                </h3>
                <Card
                  className="mb-4 p-3 rounded"
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #F47F72",
                  }}
                >
                  {/* First Row: firstName, lastName, email */}
                  <Row className="mb-3">
                    {firstRowFields.map((field) => {
                      if (
                        hiddenFields.includes(field) ||
                        !currentUser.user[field]
                      )
                        return null;
                      return (
                        <Col sm={4} key={field} className="my-2">
                          <label
                            className="text-capitalize text-primary mb-1"
                            style={{ fontWeight: "500", color: "#F47F72" }}
                          >
                            {field.replace(/([A-Z])/g, " $1")}:
                          </label>
                          <input
                            className="form-control border-primary rounded-3 text-muted"
                            style={{
                              height: "41px",
                              borderColor: "#F47F72",
                              backgroundColor: profile.updatedFields?.includes(
                                field
                              )
                                ? "rgba(244, 127, 114, 0.2)"
                                : "transparent",
                              transition: "background-color 1s ease",
                            }}
                            type="text"
                            readOnly
                            value={currentUser.user[field]}
                          />
                        </Col>
                      );
                    })}
                  </Row>
                  {/* Second Row: phone, address, birthday, with role below phone */}
                  <Row>
                    {secondRowFields.map((field, index) => {
                      if (
                        hiddenFields.includes(field) ||
                        !currentUser.user[field]
                      )
                        return null;
                      return (
                        <Col sm={4} key={field} className="my-2">
                          <label
                            className="text-capitalize text-primary mb-1"
                            style={{ fontWeight: "500", color: "#F47F72" }}
                          >
                            {field.replace(/([A-Z])/g, " $1")}:
                          </label>
                          <input
                            className="form-control border-primary rounded-3 text-muted"
                            style={{
                              height: "41px",
                              borderColor: "#F47F72",
                              backgroundColor: profile.updatedFields?.includes(
                                field
                              )
                                ? "rgba(244, 127, 114, 0.2)"
                                : "transparent",
                              transition: "background-color 1s ease",
                            }}
                            type="text"
                            readOnly
                            value={
                              field === "birthday" && currentUser.user[field]
                                ? new Date(currentUser.user[field])
                                    .toISOString()
                                    .split("T")[0]
                                : currentUser.user[field]
                            }
                          />
                          {/* Display role below phone (in the first column) */}
                          {field === "phone" &&
                            currentUser.user[roleField] &&
                            !hiddenFields.includes(roleField) && (
                              <div className="mt-3">
                                <label
                                  className="text-capitalize text-primary mb-1"
                                  style={{
                                    fontWeight: "500",
                                    color: "#F47F72",
                                  }}
                                >
                                  Role:
                                </label>
                                <input
                                  className="form-control border-primary rounded-3 text-muted"
                                  style={{
                                    height: "41px",
                                    borderColor: "#F47F72",
                                    backgroundColor:
                                      profile.updatedFields?.includes(roleField)
                                        ? "rgba(244, 127, 114, 0.2)"
                                        : "transparent",
                                    transition: "background-color 1s ease",
                                  }}
                                  type="text"
                                  readOnly
                                  value={currentUser.user[roleField]}
                                />
                              </div>
                            )}
                        </Col>
                      );
                    })}
                  </Row>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="Settings">
                <EditForm />
              </Tab.Pane>
              <Tab.Pane eventKey="Password">
                <UpdatePassword />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
