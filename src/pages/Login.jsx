import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email Address is invalid.";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === formData.email && u.password === formData.password);

        if (user) {
          console.log("Logged In User:", user);
          setLoading(false);
          // Redirect based on role
          if (user.role === "consumer") {
            navigate("/home");
          } else if (user.role === "seller") {
            navigate("/seller");
          }
          else if (user.role === "admin") {
            navigate("/admin");
          }
        } else {
          setLoading(false);
          setErrors({ general: "Invalid email or password." });
        }
      }, 1500);
    }
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
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-form">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;