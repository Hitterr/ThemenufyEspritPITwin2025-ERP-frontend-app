import { useResetPassStore } from "../../../../store/useResetPassStore";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { Row } from "react-bootstrap";

const StepFour = () => {
  const { resetState } = useResetPassStore();
  const navigate = useNavigate();

  const handleSignIn = () => {
    resetState();
    navigate("/login");
  };

  return (
    <section>
      <div className="text-center">
        <h3 style={{ color: "#FF6F61" }}>Password Reset Successfully!</h3>
        <p style={{ color: "#FF6F61" }}>
          You can now sign in with your new password.
        </p>
        <Row className="gap-2 justify-content-end">
          <button
            className="btn btn-primary"
            onClick={handleSignIn}
            style={{ backgroundColor: "#FF6F61", borderColor: "#FF6F61" }}
          >
            <FaCheck size={20} />
            <span className="ms-2">Sign In</span>
          </button>
        </Row>
      </div>
    </section>
  );
};

export default StepFour;