import React, { useState } from "react";
import { Stepper, Step } from "react-form-stepper";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link } from 'react-router-dom';
import logo from 'C:/Users/ebtih/the-menufy-backoffice-20/src/assets/images/logo.png';
import logoText from 'C:/Users/ebtih/the-menufy-backoffice-20/src/assets/images/logo-text.png';



const SITE_KEY = "6LeoP98qAAAAAPZ8OLzbE4a_0CPOFB54-VDY-LjW"; 

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
        nomRestaurant:"",
        adresseRestaurant:"",
        cuisineType:"",
        payCashMethod:"",
        promotion:""



    });
    const [errors, setErrors] = useState({});
    const [recaptchaValue, setRecaptchaValue] = useState(null);

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, telephone: value });
    };

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
                if (!formData.datedenaissance) newErrors.datedenaissance = "La date de naissance est requise.";
                if (!formData.pays) newErrors.pays = "Veuillez sélectionner un pays.";
                break;
            case 1:
                if (!formData.email) newErrors.email = "L'email est requis.";
                else if (!emailRegex.test(formData.email)) newErrors.email = "Format d'email invalide.";
                if (!formData.telephone.match(/^\+?[1-9]\d{6,14}$/)) newErrors.telephone = "Numéro de téléphone invalide";
                else if (!phoneRegex.test(formData.telephone)) newErrors.telephone = "Numéro invalide (8 à 15 chiffres).";
                break;
            case 2:
                if (!formData.password) newErrors.password = "Le mot de passe est requis.";
                else if (formData.password.length < 6) newErrors.password = "Au moins 6 caractères.";
                if (!formData.confirmPassword) newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
                else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
                break;

            case 3:
                if (!formData.nomRestaurant) newErrors.nomRestaurant = "Le nom est requis.";
                if (!formData.adresseRestaurant) newErrors.adresseRestaurant = "L'adresse est requise.";
                if (!formData.cuisineType) newErrors.cuisineType = "Le type de cuisine est requise.";
                if (!formData.payCashMethod) newErrors.payCashMethod = "Veuillez sélectionner la méthode de paiment .";
                if (!formData.promotion) newErrors.promotion = "la promotion est requise .";
                  break;
            case 4:
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
        if (validateStep(0) && validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4))  {
            alert(
         "Formulaire soumis avec succès !\n\n" +
         "🏷️ Nom : " + formData.nom + "\n" +
         "🏷️ Prénom : " + formData.prenom + "\n" +
         "📅 Date de naissance : " + formData.datedenaissance + "\n" +
         "✉️ Email : " + formData.email + "\n" +
         "📞 Téléphone : " + formData.telephone + "\n" +
        "🌍 Pays : " + formData.pays + "\n" +
        "🏢 Nom du Restaurant : " + formData.nomRestaurant + "\n" +
        "📍 Adresse du Restaurant : " + formData.adresseRestaurant + "\n" +
        "🍽️ Type de Cuisine : " + formData.cuisineType + "\n" +
       "💰 Méthode de Paiement : " + formData.payCashMethod + "\n" +
"🎉 Promotion : " + formData.promotion + "\n"

            );
        } else {
            alert("❌ Veuillez remplir tous les champs correctement.");
        }
    };

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };



    return (
        <div className="login-form-bx">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-6 col-md-7 box-skew d-flex">
                    <div className="authincation-content">
                        <div className="mb-4">
                            <h3 className="mb-1 font-w300">Welcome to Menufy</h3>
                            <p className="">SignUp by entering information below</p>
                        </div>
                 
                            <form>
                            <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                             transition={{ duration: 0.5 }}
                            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "80vh",
               
            }}
        >
              <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "600px" }}>
           
                
                <h2 className="text-center text-primary">S'inscrire</h2>
                <div className="d-flex justify-content-center my-4" >
                <Stepper activeStep={goSteps} alternativeLabel>
                     <Step icon={<FaUser sx={{ fontSize: "2rem" }} />} label="Informations Personnelles" />
                     <Step icon={<FaEnvelope sx={{ fontSize: "2rem" }} />} label="Contact" />
          <Step icon={<FaLock sx={{ fontSize: "2rem" }} />} label="Sécurité" />
    <Step icon={<FaLock sx={{ fontSize: "2rem" }} />} label="Restaurant" />
    <Step icon={<FaCheckCircle sx={{ fontSize: "2rem" }} />} label="Confirmation" />
</Stepper>
</div>

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
                        <input
                            type="date"
                            name="datedenaissance"
                            className="form-control mb-3"
                            value={formData.datedenaissance}
                            onChange={handleChange}
                            placeholder="Date de naissance"
                        />
                        {errors.datedenaissance && <p className="text-danger">{errors.datedenaissance}</p>}
                        <select
                            name="pays"
                            className="form-control mb-3"
                            value={formData.pays}
                            onChange={handleChange}
                        >
                            <option value="">Sélectionner...</option>
                            <option value="France">🇫🇷 France</option>
                            <option value="Tunisie">🇹🇳 Tunisie</option>
                            <option value="Canada">🇨🇦 Canada</option>
                        </select>
                        {errors.nom && <p className="text-danger">{errors.nom}</p>}
                        {errors.prenom && <p className="text-danger">{errors.prenom}</p>}
                        {errors.pays && <p className="text-danger">{errors.pays}</p>}
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
                        <PhoneInput 
                            country={'tn'} 
                            value={formData.telephone} 
                            onChange={handlePhoneChange} 
                            className="mb-2" 
                        />
                        {errors.email && <p className="text-danger">{errors.email}</p>}
                        {errors.telephone && <small className="text-danger">{errors.telephone}</small>}
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
                        {errors.password && <p className="text-danger">{errors.password}</p>}
                        {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
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
       
        <input
            type="text"
            name="nomRestaurant"
            className="form-control mb-3"
            value={formData.nomRestaurant}
            onChange={handleChange}
            placeholder="Nom du Restaurant"
        />

        <input
            type="text"
            name="adresseRestaurant"
            className="form-control mb-3"
            value={formData.adresseRestaurant}
            onChange={handleChange}
            placeholder="Adresse"
        />

      
        <select
            name="cuisineType"
            className="form-control mb-3"
            value={formData.cuisineType}
            onChange={handleChange}
        >
            <option value="">Sélectionnez un type de cuisine</option>
            <option value="Italienne">🍕 Italienne</option>
            <option value="Japonaise">🍣 Japonaise</option>
            <option value="Française">🥖 Française</option>
        </select>
        {errors.cuisineType && <p className="text-danger">{errors.cuisineType}</p>}

        <select
            name="payCashMethod"
            className="form-control mb-3"
            value={formData.payCashMethod}
            onChange={handleChange}
        >
            <option value="">Sélectionnez une méthode</option>
            <option value="Cash">💰 Cash</option>
            <option value="Carte">💳 Carte</option>
            <option value="En ligne">🌐 Paiement en ligne</option>
        </select>
        {errors.payCashMethod && <p className="text-danger">{errors.payCashMethod}</p>}

       
        <select
            name="promotion"
            className="form-control mb-3"
            value={formData.promotion}
            onChange={handleChange}
        >
            <option value="">Sélectionnez une promotion</option>
            <option value="10%">10% de réduction</option>
            <option value="20%">20% de réduction</option>
            <option value="Aucune">Aucune promotion</option>
        </select>
        {errors.promotion && <p className="text-danger">{errors.promotion}</p>}

        <button className="btn btn-secondary mt-3" onClick={handlePrev}>
            Précédent
        </button>
        <button className="btn btn-primary mt-3" onClick={handleNext}>
            Suivant
        </button>
    </motion.div>
)}


                {goSteps === 4 && (
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
        </form>
         <div className="new-account mt-2">
                                                            <p className="mb-0">
                                                                Don't have an account?{" "}
                                                                <Link className="text-primary" to="/page-register">
                                                                    Sign up
                                                                </Link>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-5 d-flex box-skew1">
                                                    <div className="inner-content align-self-center">
                                                        <Link to="/dashboard" className="login-logo">
                                                            <img src={logo} alt="" className="logo-icon me-2" />
                                                            <img src={logoText} alt="" className="logo-text ms-1" />
                                                        </Link>
                                                        <h2 className="m-b10 ">Login To You Now</h2>
                                                        <p className="m-b40">
                                                            User Experience & Interface Design Strategy SaaS Solutions
                                                        </p>
                                                        <ul className="social-icons mt-4">
                                                            <li>
                                                                <Link to={"#"}>
                                                                    <i className="fab fa-facebook-f"></i>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link to={"#"}>
                                                                    <i className="fab fa-twitter"></i>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link to={"#"}>
                                                                    <i className="fab fa-linkedin-in"></i>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
	);

}
export default Signup;
