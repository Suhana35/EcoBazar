import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGlobal } from "../Global";

function Login() {
  const { loginUser, currentUser, users } = useGlobal();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "consumer") navigate("/home");
      else if (currentUser.role === "seller") navigate("/seller");
      else if (currentUser.role === "admin") navigate("/admin");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
    if (errors[name] || errors.general) setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email Address is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email Address is invalid.";

    if (!formData.password) tempErrors.password = "Password is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const success = loginUser(formData.email, formData.password);

      if (!success) setErrors({ general: "Invalid email or password." });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="form">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-icon"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {errors.general && <p className="error">{errors.general}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-form">
          Don’t have an account? <span onClick={() => navigate("/")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
