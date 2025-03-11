import React, { useState, useEffect } from "react";
import { Stepper, Step } from "react-form-stepper";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from "C:/Users/ebtih/the-menufy-backoffice-20/src/assets/images/logo.png";
import logoText from "C:/Users/ebtih/the-menufy-backoffice-20/src/assets/images/logo-text.png";
import "font-awesome/css/font-awesome.min.css";

const SITE_KEY = "6LeoP98qAAAAAPZ8OLzbE4a_0CPOFB54-VDY-LjW";

// Styles réutilisables
const inputStyle = {
  borderRadius: "10px",
  padding: "0.75rem",
  fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
  border: "2px solid",
  transition: "border-color 0.3s",
  width: "100%",
  height: "48px", // Hauteur fixe pour uniformité
  boxSizing: "border-box",
  lineHeight: "1",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  borderRadius: "10px",
  border: "none",
  color: "#fff",
  fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s",
};

const Signup = () => {
  const [goSteps, setGoSteps] = useState(0);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    datedenaissance: "",
    pays: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [recaptchaLoading, setRecaptchaLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, telephone: value });
    validateField("telephone", value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    setFormData({ ...formData, datedenaissance: formattedDate });
    validateField("datedenaissance", formattedDate);
  };

  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    let newErrors = { ...errors };

    switch (name) {
      case "nom":
      case "prenom":
        if (!value) newErrors[name] = `${name === "nom" ? "Le nom" : "Le prénom"} est requis.`;
        else delete newErrors[name];
        break;
      case "datedenaissance":
        if (!value) newErrors[name] = "La date de naissance est requise.";
        else if (new Date(value) > new Date()) newErrors[name] = "La date ne peut pas être future.";
        else delete newErrors[name];
        break;
      case "pays":
        if (!value) newErrors[name] = "Veuillez sélectionner un pays.";
        else delete newErrors[name];
        break;
      case "email":
        if (!value) newErrors[name] = "L'email est requis.";
        else if (!emailRegex.test(value)) newErrors[name] = "Format d'email invalide.";
        else delete newErrors[name];
        break;
      case "telephone":
        if (!value) newErrors[name] = "Le numéro de téléphone est requis.";
        else if (!phoneRegex.test(value)) newErrors[name] = "Numéro invalide (ex. +21612345678).";
        else delete newErrors[name];
        break;
      case "password":
        if (!value) newErrors[name] = "Le mot de passe est requis.";
        else if (value.length < 6) newErrors[name] = "Au moins 6 caractères.";
        else delete newErrors[name];
        break;
      case "confirmPassword":
        if (!value) newErrors[name] = "Veuillez confirmer votre mot de passe.";
        else if (value !== formData.password) newErrors[name] = "Les mots de passe ne correspondent pas.";
        else delete newErrors[name];
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (step) => {
    let stepFields = [];
    switch (step) {
      case 0:
        stepFields = ["nom", "prenom", "datedenaissance", "pays"];
        break;
      case 1:
        stepFields = ["email", "telephone"];
        break;
      case 2:
        stepFields = ["password", "confirmPassword"];
        break;
      case 3:
        return recaptchaValue !== null;
      default:
        break;
    }
    return stepFields.every((field) => validateField(field, formData[field]));
  };

  const handleNext = () => {
    if (validateStep(goSteps)) {
      setGoSteps(goSteps + 1);
    }
  };

  const handlePrev = () => {
    setGoSteps(goSteps - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(0) && validateStep(1) && validateStep(2) && validateStep(3)) {
      setIsSubmitting(true);
      setSuccessMessage("");
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSuccessMessage("Inscription réussie ! Vous allez être redirigé...");
        setTimeout(() => {
          setFormData({
            nom: "",
            prenom: "",
            datedenaissance: "",
            pays: "",
            email: "",
            telephone: "",
            password: "",
            confirmPassword: "",
          });
          setGoSteps(0);
          setRecaptchaValue(null);
          setRecaptchaLoading(false);
          setSuccessMessage("");
        }, 2000);
      } catch (error) {
        setErrors({ ...errors, submit: "Erreur lors de la soumission. Veuillez réessayer." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    setRecaptchaLoading(false);
  };

  const handleRecaptchaLoad = () => {
    setRecaptchaLoading(false);
  };

  const handleRecaptchaError = () => {
    if (!isOnline) {
      setRecaptchaLoading(true);
      setErrors({ ...errors, recaptcha: "Pas de connexion Internet. Vérifiez votre réseau." });
    } else {
      setRecaptchaLoading(false);
      setErrors({ ...errors, recaptcha: "Erreur de chargement du ReCAPTCHA. Veuillez réessayer." });
    }
  };

  return (
    <div className="login-form-bx" style={{ background: "#f4f6f9", minHeight: "100vh", display: "flex", alignItems: "center", position: "relative" }}>
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
              {successMessage && (
                <div
                  role="alert"
                  className="alert text-center mb-3"
                  style={{ background: "#D37E93", color: "#fff", borderRadius: "10px", fontSize: "0.875rem", padding: "10px" }}
                >
                  {successMessage}
                </div>
              )}
              <form onSubmit={(e) => e.preventDefault()}>
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
                      <h3 style={{ fontWeight: 300, color: "#3D3E79", fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>
                        Bienvenue chez Menufy
                      </h3>
                      <div className="new-account mt-3" style={{ color: "#666", fontSize: "clamp(0.875rem, 2.5vw, 1rem)" }}>
                        <p>
                          Déjà un compte ?{" "}
                          <Link to="/login" style={{ color: "#D37E93", textDecoration: "none", fontWeight: 500 }}>
                            Se connecter
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center mb-4">
                      <Stepper
                        activeStep={goSteps}
                        style={{ width: "100%", maxWidth: "min(400px, 90vw)" }}
                        connectorStateColors={true}
                        connectorStyleConfig={{ completedColor: "#D37E93", activeColor: "#D37E93" }}
                      >
                        <Step
                          icon={<FaUser style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: goSteps >= 0 ? "#D37E93" : "#ccc" }} />}
                          label="Informations"
                        />
                        <Step
                          icon={<FaEnvelope style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: goSteps >= 1 ? "#D37E93" : "#ccc" }} />}
                          label="Contact"
                        />
                        <Step
                          icon={<FaLock style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: goSteps >= 2 ? "#D37E93" : "#ccc" }} />}
                          label="Sécurité"
                        />
                        <Step
                          icon={<FaCheckCircle style={{ fontSize: "clamp(1.2rem, 3vw, 1.5rem)", color: goSteps >= 3 ? "#D37E93" : "#ccc" }} />}
                          label="Confirmation"
                        />
                      </Stepper>
                    </div>

                    {goSteps === 0 && (
                      <motion.div initial={{ x: "-100vw" }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 120 }}>
                        <div style={{ marginBottom: "1rem" }}>
                          <input
                            type="text"
                            name="nom"
                            className="form-control"
                            value={formData.nom}
                            onChange={handleChange}
                            placeholder="Nom"
                            aria-label="Nom"
                            style={{ ...inputStyle, borderColor: errors.nom ? "#dc3545" : "#ced4da" }}
                            onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                            onBlur={(e) => (e.target.style.borderColor = errors.nom ? "#dc3545" : "#ced4da")}
                          />
                          {errors.nom && <small style={{ color: "#dc3545", fontSize: "0.75rem" }}>{errors.nom}</small>}
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                          <input
                            type="text"
                            name="prenom"
                            className="form-control"
                            value={formData.prenom}
                            onChange={handleChange}
                            placeholder="Prénom"
                            aria-label="Prénom"
                            style={{ ...inputStyle, borderColor: errors.prenom ? "#dc3545" : "#ced4da" }}
                            onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                            onBlur={(e) => (e.target.style.borderColor = errors.prenom ? "#dc3545" : "#ced4da")}
                          />
                          {errors.prenom && <small style={{ color: "#dc3545", fontSize: "0.75rem" }}>{errors.prenom}</small>}
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                          <DatePicker
                            selected={formData.datedenaissance ? new Date(formData.datedenaissance) : null}
                            onChange={handleDateChange}
                            placeholderText="Date de naissance"
                            dateFormat="yyyy-MM-dd"
                            showYearDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100}
                            maxDate={new Date()}
                            aria-label="Date de naissance"
                            wrapperClassName="date-picker-wrapper" // Ajout d'une classe pour le conteneur
                            className="form-control date-picker-custom"
                            customInput={
                              <input
                                style={{
                                  ...inputStyle,
                                  borderColor: errors.datedenaissance ? "#dc3545" : "#ced4da",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                                onBlur={(e) => (e.target.style.borderColor = errors.datedenaissance ? "#dc3545" : "#ced4da")}
                              />
                            }
                          />
                          {errors.datedenaissance && (
                            <small style={{ color: "#dc3545", fontSize: "0.75rem" }}>{errors.datedenaissance}</small>
                          )}
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                          <select
                            name="pays"
                            className="form-control"
                            value={formData.pays}
                            onChange={handleChange}
                            aria-label="Pays"
                            style={{ ...inputStyle, borderColor: errors.pays ? "#dc3545" : "#ced4da" }}
                            onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                            onBlur={(e) => (e.target.style.borderColor = errors.pays ? "#dc3545" : "#ced4da")}
                          >
                            <option value="">Sélectionner un pays</option>
                            <option value="France">🇫🇷 France</option>
                            <option value="Tunisie">🇹🇳 Tunisie</option>
                            <option value="Canada">🇨🇦 Canada</option>
                          </select>
                          {errors.pays && <small style={{ color: "#dc3545", fontSize: "0.75rem" }}>{errors.pays}</small>}
                        </div>
                        <div className="d-flex justify-content-end">
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#C28577" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn"
                            onClick={handleNext}
                            disabled={Object.keys(errors).length > 0}
                            aria-label="Suivant"
                            style={{ ...buttonStyle, background: "#D37E93", boxShadow: "0 4px 10px rgba(243, 199, 193, 0.3)" }}
                          >
                            <FaArrowRight style={{ marginRight: "0.5rem" }} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {goSteps === 1 && (
                      <motion.div initial={{ x: "-100vw" }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 120 }}>
                        <div style={{ marginBottom: "1rem" }}>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            aria-label="Email"
                            style={{ ...inputStyle, borderColor: errors.email ? "#dc3545" : "#ced4da" }}
                            onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                            onBlur={(e) => (e.target.style.borderColor = errors.email ? "#dc3545" : "#ced4da")}
                          />
                          {errors.email && <small style={{ color: "#dc3545", fontSize: "0.75rem" }}>{errors.email}</small>}
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                          <PhoneInput
                            country={"tn"}
                            value={formData.telephone}
                            onChange={handlePhoneChange}
                            inputStyle={{ ...inputStyle, borderColor: errors.telephone ? "#dc3545" : "#ced4da", paddingLeft: "3rem" }}
                            buttonStyle={{ border: "2px solid", borderColor: errors.telephone ? "#dc3545" : "#ced4da", borderRadius: "10px 0 0 10px" }}
                            onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                            onBlur={(e) => (e.target.style.borderColor = errors.telephone ? "#dc3545" : "#ced4da")}
                          />
                          {errors.telephone && <small style={{ color: "#dc3545", fontSize: "0.75rem" }}>{errors.telephone}</small>}
                        </div>
                        <div className="d-flex justify-content-between">
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#5a6268" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn"
                            onClick={handlePrev}
                            aria-label="Précédent"
                            style={{ ...buttonStyle, background: "#3B3A38", boxShadow: "0 4px 10px rgba(59, 58, 56, 0.3)" }}
                          >
                            <FaArrowLeft style={{ marginRight: "0.5rem" }} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#C28577" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn"
                            onClick={handleNext}
                            disabled={Object.keys(errors).length > 0}
                            aria-label="Suivant"
                            style={{ ...buttonStyle, background: "#D37E93", boxShadow: "0 4px 10px rgba(243, 199, 193, 0.3)" }}
                          >
                            <FaArrowRight style={{ marginRight: "0.5rem" }} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {goSteps === 2 && (
                      <motion.div initial={{ x: "-100vw" }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 120 }}>
                        <div style={{ marginBottom: "1rem" }}>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mot de passe"
                            aria-label="Mot de passe"
                            style={{ ...inputStyle, borderColor: errors.password ? "#dc3545" : "#ced4da" }}
                            onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                            onBlur={(e) => (e.target.style.borderColor = errors.password ? "#dc3545" : "#ced4da")}
                          />
                          {errors.password && <small style={{ color: "#dc3545", fontSize: "0.75rem" }}>{errors.password}</small>}
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                          <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmer mot de passe"
                            aria-label="Confirmer mot de passe"
                            style={{ ...inputStyle, borderColor: errors.confirmPassword ? "#dc3545" : "#ced4da" }}
                            onFocus={(e) => (e.target.style.borderColor = "#D37E93")}
                            onBlur={(e) => (e.target.style.borderColor = errors.confirmPassword ? "#dc3545" : "#ced4da")}
                          />
                          {errors.confirmPassword && (
                            <small style={{ color: "#dc3545", fontSize: "0.75rem" }}>{errors.confirmPassword}</small>
                          )}
                        </div>
                        <div className="d-flex justify-content-between">
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#5a6268" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn"
                            onClick={handlePrev}
                            aria-label="Précédent"
                            style={{ ...buttonStyle, background: "#3B3A38", boxShadow: "0 4px 10px rgba(59, 58, 56, 0.3)" }}
                          >
                            <FaArrowLeft style={{ marginRight: "0.5rem" }} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#C28577" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn"
                            onClick={handleNext}
                            disabled={Object.keys(errors).length > 0}
                            aria-label="Suivant"
                            style={{ ...buttonStyle, background: "#D37E93", boxShadow: "0 4px 10px rgba(243, 199, 193, 0.3)" }}
                          >
                            <FaArrowRight style={{ marginRight: "0.5rem" }} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {goSteps === 3 && (
                      <motion.div initial={{ x: "-100vw" }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 120 }}>
                        <div
                          style={{
                            textAlign: "center",
                            marginBottom: "1rem",
                            minHeight: "120px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {recaptchaLoading && !isOnline ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <FaSpinner
                                className="fa-spin"
                                size={30}
                                style={{ color: "#D37E93", marginBottom: "0.625rem" }}
                              />
                              <p style={{ fontSize: "0.875rem", color: "#666" }}>Pas de connexion. Vérifiez votre réseau...</p>
                            </div>
                          ) : (
                            <ReCAPTCHA
                              sitekey={SITE_KEY}
                              onChange={handleRecaptchaChange}
                              onLoad={handleRecaptchaLoad}
                              onErrored={handleRecaptchaError}
                              size={window.innerWidth < 400 ? "compact" : "normal"}
                            />
                          )}
                        </div>
                        {errors.recaptcha && (
                          <p style={{ color: "#dc3545", fontSize: "0.75rem", textAlign: "center", marginBottom: "0.9375rem" }}>
                            {errors.recaptcha}
                          </p>
                        )}
                        <div className="d-flex justify-content-between flex-wrap gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#5a6268" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn"
                            onClick={handlePrev}
                            aria-label="Précédent"
                            style={{ ...buttonStyle, background: "#3B3A38", boxShadow: "0 4px 10px rgba(59, 58, 56, 0.3)", flex: "1 1 auto" }}
                          >
                            <FaArrowLeft style={{ marginRight: "0.5rem" }} /> Précédent
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "#8B3A22" }}
                            whileTap={{ scale: 0.95 }}
                            className="btn"
                            onClick={handleSubmit}
                            disabled={isSubmitting || recaptchaLoading || Object.keys(errors).length > 0}
                            aria-label="Soumettre"
                            style={{ ...buttonStyle, background: "#D37E93", opacity: isSubmitting || recaptchaLoading ? 0.6 : 1, boxShadow: "0 4px 10px rgba(155, 67, 39, 0.3)", flex: "1 1 auto" }}
                          >
                            {isSubmitting ? <FaSpinner className="fa-spin me-2" /> : null}
                            {isSubmitting ? "Envoi..." : "Soumettre"}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </form>
            </div>
          </div>
          <div className="col-lg-6 col-md-5 d-flex box-skew1" style={{ background: `linear-gradient(135deg, #D37E93, #C28577)` }}>
            <div className="inner-content align-self-center" style={{ textAlign: "center", color: "#3B3A38", padding: "1.25rem" }}>
              <Link to="/dashboard" className="login-logo" style={{ display: "inline-block", marginBottom: "1.25rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", background: "#fff", borderRadius: "50%", padding: "0.625rem" }}>
                  <img src={logo} alt="Logo" style={{ width: "clamp(40px, 10vw, 50px)" }} className="logo-icon me-2" />
                </div>
                <img src={logoText} alt="Menufy" style={{ height: "clamp(25px, 8vw, 30px)" }} className="logo-text ms-1" />
              </Link>
              <h2 style={{ fontSize: "clamp(1.5rem, 5vw, 1.75rem)", fontWeight: 500, marginBottom: "0.9375rem" }}>
                Connectez-vous dès maintenant
              </h2>
              <p style={{ fontSize: "clamp(0.875rem, 3vw, 1rem)", opacity: 0.9, marginBottom: "1.875rem" }}>
                Solutions SaaS pour une expérience utilisateur optimale
              </p>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                {["facebook-f", "twitter", "linkedin-in"].map((icon) => (
                  <li key={icon} style={{ margin: "0 0.9375rem" }}>
                    <Link
                      to="#"
                      style={{ color: "#3B3A38", fontSize: "clamp(1.2rem, 4vw, 1.375rem)", opacity: 0.8, transition: "opacity 0.3s" }}
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
          select,
          .form-control {
            padding: 0.625rem;
          }
        }

        /* Forcer la largeur et la hauteur du conteneur du DatePicker */
        .date-picker-wrapper {
          width: 100% !important; /* S'assure que le conteneur prend toute la largeur */
          display: block !important;
        }

        /* Styles pour l'input du DatePicker */
        .date-picker-custom {
          width: 100% !important;
          height: 48px !important; /* Hauteur identique aux autres champs */
          padding: 0.75rem !important;
          font-size: clamp(0.875rem, 2.5vw, 1rem) !important;
          border-radius: 10px !important;
          border: 2px solid #ced4da !important;
          box-sizing: border-box !important;
          line-height: 1 !important;
          display: block !important; /* Évite tout rétrécissement */
        }

        .date-picker-custom:focus {
          border-color: #D37E93 !important;
          outline: none !important;
        }

        /* Styles pour le calendrier */
        .react-datepicker {
          border: 2px solid #D37E93;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .react-datepicker__header {
          background-color: #D37E93;
          color: #fff;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #D37E93 !important;
          color: #fff !important;
          border-radius: 50%;
        }

        .react-datepicker__day:hover {
          background-color: #f3c7c1;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Signup;