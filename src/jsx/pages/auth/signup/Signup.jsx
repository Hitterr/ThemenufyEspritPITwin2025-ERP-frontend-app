import React, { useState } from "react";
import { Stepper, Step } from "react-form-stepper";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = "6LeoP98qAAAAAPZ8OLzbE4a_0CPOFB54-VDY-LjW"; 

const Signup = () => {
    const [goSteps, setGoSteps] = useState(0);
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        pays: "",
        email: "",
        telephone: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [recaptchaValue, setRecaptchaValue] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateStep = (step) => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{8,15}$/;
        switch (step) {
            case 0:
                if (!formData.nom) newErrors.nom = "Le nom est requis.";
                if (!formData.prenom) newErrors.prenom = "Le prénom est requis.";
                if (!formData.pays) newErrors.pays = "Veuillez sélectionner un pays.";
                break;
            case 1:
                if (!formData.email) newErrors.email = "L'email est requis.";
                else if (!emailRegex.test(formData.email)) newErrors.email = "Format d'email invalide.";
                if (!formData.telephone) newErrors.telephone = "Le téléphone est requis.";
                else if (!phoneRegex.test(formData.telephone)) newErrors.telephone = "Numéro invalide (8 à 15 chiffres).";
                break;
            case 2:
                if (!formData.password) newErrors.password = "Le mot de passe est requis.";
                else if (formData.password.length < 6) newErrors.password = "Au moins 6 caractères.";
                if (!formData.confirmPassword) newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
                else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
                break;
            case 3:
                if (!recaptchaValue) newErrors.recaptcha = "Veuillez vérifier que vous n'êtes pas un robot.";
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(goSteps)) {
            setGoSteps(goSteps + 1);
        }
    };

    const handlePrev = () => {
        setGoSteps(goSteps - 1);
    };

    const handleSubmit = () => {
        if (validateStep(0) && validateStep(1) && validateStep(2) && validateStep(3)) {
            alert("Formulaire soumis avec succès !");
        }
    };

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };

    // Determine background color based on the current step
    const getBackgroundColor = () => {
        switch (goSteps) {
            case 0:
                return "#ee7ba3"; // Rose color for step 0
            case 1:
                return "#f9c9e4"; // Lighter pink for step 1
            case 2:
                return "#f2d1e1"; // Soft pink for step 2
            case 3:
                return "#fce4ec"; // Very light pink for step 3
            default:
                return "#ffffff"; // Default background
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                backgroundColor: getBackgroundColor(), 
            }}
        >
            <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "500px" }}>
                <h2 className="text-center text-primary">S'inscrire</h2>
                <Stepper activeStep={goSteps} alternativeLabel>
                    <Step icon={<FaUser size={24} />} label="Informations Personnelles" />
                    <Step icon={<FaEnvelope size={24} />} label="Contact" />
                    <Step icon={<FaLock size={24} />} label="Sécurité" />
                    <Step icon={<FaCheckCircle size={24} />} label="Confirmation" />
                </Stepper>

                {goSteps === 0 && (
                    <motion.div
                        initial={{ x: "-100vw" }}
                        animate={{ x: 0 }}
                        transition={{ type: "spring", stiffness: 120 }}
                    >
                        <input
                            type="text"
                            name="nom"
                            className="form-control mb-3"
                            value={formData.nom}
                            onChange={handleChange}
                            placeholder="Nom"
                        />
                        <input
                            type="text"
                            name="prenom"
                            className="form-control mb-3"
                            value={formData.prenom}
                            onChange={handleChange}
                            placeholder="Prénom"
                        />
                        <select
                            name="pays"
                            className="form-control mb-3"
                            value={formData.pays}
                            onChange={handleChange}
                        >
                            <option value="">Sélectionner...</option>
                            <option value="France">France</option>
                            <option value="Tunisie">Tunisie</option>
                            <option value="Canada">Canada</option>
                        </select>
                        {errors.nom && <p className="text-danger">{errors.nom}</p>}
                        <button className="btn btn-primary mt-3" onClick={handleNext}>
                            Suivant
                        </button>
                    </motion.div>
                )}

                {goSteps === 1 && (
                    <motion.div
                        initial={{ x: "-100vw" }}
                        animate={{ x: 0 }}
                        transition={{ type: "spring", stiffness: 120 }}
                    >
                        <input
                            type="email"
                            name="email"
                            className="form-control mb-3"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            name="telephone"
                            className="form-control mb-3"
                            value={formData.telephone}
                            onChange={handleChange}
                            placeholder="Téléphone"
                        />
                        <button className="btn btn-secondary mt-3" onClick={handlePrev}>
                            Précédent
                        </button>
                        <button className="btn btn-primary mt-3" onClick={handleNext}>
                            Suivant
                        </button>
                    </motion.div>
                )}

                {goSteps === 2 && (
                    <motion.div
                        initial={{ x: "-100vw" }}
                        animate={{ x: 0 }}
                        transition={{ type: "spring", stiffness: 120 }}
                    >
                        <input
                            type="password"
                            name="password"
                            className="form-control mb-3"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mot de passe"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-control mb-3"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmer mot de passe"
                        />
                        <button className="btn btn-secondary mt-3" onClick={handlePrev}>
                            Précédent
                        </button>
                        <button className="btn btn-primary mt-3" onClick={handleNext}>
                            Suivant
                        </button>
                    </motion.div>
                )}

                {goSteps === 3 && (
                    <motion.div
                        initial={{ x: "-100vw" }}
                        animate={{ x: 0 }}
                        transition={{ type: "spring", stiffness: 120 }}
                    >
                        <ReCAPTCHA
                            sitekey={SITE_KEY}
                            onChange={handleRecaptchaChange}
                        />
                        {errors.recaptcha && <p className="text-danger">{errors.recaptcha}</p>}
                        <button className="btn btn-success mt-3" onClick={handleSubmit}>
                            Soumettre
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Signup;
