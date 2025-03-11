import React, { useState } from "react";
import { FaEnvelope, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/images/logo.png"; 
import LogoText from "../../../../assets/images/logo-text.png"; 

const EmailVerification = ({ initialEmail = "", onEmailVerified, onBack }) => {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (value) => {
    if (!value) {
      setError("L'email est requis.");
      return false;
    }
    if (!emailRegex.test(value)) {
      setError("Format d'email invalide.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      validateEmail(value);
    } else if (name === "code") {
      setCode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

    setIsVerifying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      if (onEmailVerified) {
        onEmailVerified(email);
      }
    } catch (err) {
      setError("Erreur lors de la vérification. Veuillez réessayer.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="login-form-bx"
      style={{
        background: "#f4f6f9",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "60%",
          height: "120%",
          background: `radial-gradient(circle, rgba(243, 199, 193, 0.2) 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />
      <div className="container-fluid" style={{ position: "relative", zIndex: 1 }}>
        <div className="row align-items-center" style={{ minHeight: "100vh", flexDirection: "row" }}>
          <div className="col-lg-6 col-md-7 box-skew d-flex" style={{ padding: "0 15px" }}>
            <div className="authincation-content" style={{ width: "100%", padding: "20px" }}>
              {success && (
                <div
                  role="alert"
                  className="alert text-center mb-3"
                  style={{
                    background: "#D37E93",
                    color: "#fff",
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    padding: "10px",
                  }}
                >
                  Email vérifié avec succès !
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "80vh" }}
                >
                  <div
                    className="card shadow-lg p-3 p-md-4"
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      borderRadius: "20px",
                      background: "#fff",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    }}
                  >
                    <div className="mb-4 text-center">
                      <h3
                        style={{
                          fontWeight: 300,
                          color: "#3D3E79",
                          fontSize: "clamp(1.5rem, 4vw, 2rem)",
                        }}
                      >
                        Vérification de l'email
                      </h3>
                      <div
                        className="new-account mt-3"
                        style={{ color: "#666", fontSize: "clamp(0.875rem, 2.5vw, 1rem)" }}
                      >
                        <p>
                          Retour à l'inscription ?{" "}
                          <Link
                            to="/signup"
                            style={{ color: "#D37E93", textDecoration: "none", fontWeight: 500 }}
                          >
                            S'inscrire
                          </Link>
                        </p>
                      </div>
                    </div>

                    <motion.div
                      initial={{ x: "-100vw" }}
                      animate={{ x: 0 }}
                      transition={{ type: "spring", stiffness: 120 }}
                    >
                      <div style={{ marginBottom: "1.5rem" }}>
                        <div style={{ position: "relative", marginBottom: "1rem" }}>
                          <FaEnvelope
                            style={{
                              position: "absolute",
                              left: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#D37E93",
                            }}
                          />
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={email}
                            onChange={handleChange}
                            placeholder="Email"
                            aria-label="Email"
                            disabled={isVerifying || success}
                            style={{
                              borderRadius: "10px",
                              padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                              fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                              border: "2px solid",
                              borderColor: error ? "#dc3545" : "#ced4da",
                              transition: "border-color 0.3s",
                              width: "100%",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                            onBlur={(e) =>
                              (e.target.style.borderColor = error ? "#dc3545" : "#ced4da")
                            }
                          />
                        </div>
                        <div style={{ position: "relative" }}>
                          <FaEnvelope
                            style={{
                              position: "absolute",
                              left: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#D37E93",
                            }}
                          />
                          <input
                            type="text"
                            name="code"
                            className="form-control"
                            value={code}
                            onChange={handleChange}
                            placeholder="Code de vérification"
                            aria-label="Code de vérification"
                            disabled={isVerifying || success}
                            style={{
                              borderRadius: "10px",
                              padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                              fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                              border: "2px solid",
                              borderColor: error ? "#dc3545" : "#ced4da",
                              transition: "border-color 0.3s",
                              width: "100%",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                            onBlur={(e) =>
                              (e.target.style.borderColor = error ? "#dc3545" : "#ced4da")
                            }
                          />
                        </div>
                        {error && (
                          <small style={{ color: "#dc3545", fontSize: "0.75rem", display: "block", marginTop: "0.5rem" }}>
                            {error}
                          </small>
                        )}
                      </div>

                      <div className="d-flex justify-content-between flex-wrap gap-2">
                        {onBack && (
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#5a6268" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn"
                            onClick={onBack}
                            aria-label="Précédent"
                            style={{
                              padding: "0.75rem 1.5rem",
                              borderRadius: "10px",
                              background: "#3B3A38",
                              border: "none",
                              color: "#fff",
                              fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.3s",
                              boxShadow: "0 4px 10px rgba(59, 58, 56, 0.3)",
                              flex: "1 1 auto",
                            }}
                          >
                            <FaArrowLeft style={{ marginRight: "0.5rem" }} /> Précédent
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: "#C28577" }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={isVerifying || success || !!error}
                          aria-label="Vérifier"
                          style={{
                            padding: "0.75rem 1.5rem",
                            borderRadius: "10px",
                            background: "#D37E93",
                            border: "none",
                            color: "#fff",
                            fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s",
                            boxShadow: "0 4px 10px rgba(243, 199, 193, 0.3)",
                            opacity: isVerifying || success ? 0.6 : 1,
                            flex: "1 1 auto",
                          }}
                        >
                          {isVerifying ? (
                            <>
                              <FaSpinner className="fa-spin" style={{ marginRight: "0.5rem" }} />
                              Vérification...
                            </>
                          ) : (
                            "Vérifier"
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </form>
            </div>
          </div>
          <div
            className="col-lg-6 col-md-5 d-flex box-skew1"
            style={{ background: `linear-gradient(135deg, #D37E93, #C28577)` }}
          >
            <div
              className="inner-content align-self-center"
              style={{ textAlign: "center", color: "#3B3A38", padding: "1.25rem" }}
            >
              <Link to="/dashboard" className="login-logo" style={{ display: "inline-block", marginBottom: "1.25rem" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "#fff",
                    borderRadius: "50%",
                    padding: "0.625rem",
                  }}
                >
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: "clamp(40px, 10vw, 50px)" }}
                    className="logo-icon me-2"
                  />
                </div>
                <img
                  src={LogoText}
                  alt="Menufy"
                  style={{ height: "clamp(25px, 8vw, 30px)" }}
                  className="logo-text ms-1"
                />
              </Link>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 5vw, 1.75rem)",
                  fontWeight: 500,
                  marginBottom: "0.9375rem",
                }}
              >
                Vérifiez votre email
              </h2>
              <p
                style={{
                  fontSize: "clamp(0.875rem, 3vw, 1rem)",
                  opacity: 0.9,
                  marginBottom: "1.875rem",
                }}
              >
                Une étape simple pour sécuriser votre compte
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {["facebook-f", "twitter", "linkedin-in"].map((icon) => (
                  <li key={icon} style={{ margin: "0 0.9375rem" }}>
                    <Link
                      to="#"
                      style={{
                        color: "#3B3A38",
                        fontSize: "clamp(1.2rem, 4vw, 1.375rem)",
                        opacity: 0.8,
                        transition: "opacity 0.3s",
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = 1)}
                      onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
                    >
                      <i className={`fab fa-${icon}`}></i>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .row {
          flex-direction: row;
        }

        @media (max-width: 991px) {
          .row {
            flex-direction: column;
          }
          .box-skew,
          .box-skew1 {
            width: 100%;
            min-height: auto;
            padding: 0;
          }
          .authincation-content {
            padding: 1rem;
          }
          .inner-content {
            padding: 1rem;
          }
          .card {
            margin: 0 0.5rem;
            padding: 1rem !important;
          }
        }

        @media (max-width: 768px) {
          .box-skew,
          .box-skew1 {
            transform: none !important;
            height: auto;
          }
          .card {
            max-width: 100%;
          }
          .d-flex.justify-content-between {
            flex-direction: column;
            gap: 0.5rem;
          }
          button {
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          .card {
            padding: 0.75rem !important;
          }
          .authincation-content {
            padding: 0.75rem;
          }
          input,
          .form-control {
            padding: 0.625rem 0.625rem 0.625rem 2rem;
          }
        }
      `}</style>
    </div>
  );
};

EmailVerification.propTypes = {
  initialEmail: PropTypes.string,
  onEmailVerified: PropTypes.func,
  onBack: PropTypes.func,
};

export default EmailVerification;