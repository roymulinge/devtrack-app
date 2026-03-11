import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { email, password, password2 } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("/auth/register/", {
        email,
        password
      });

      navigate("/login");

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={password2}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;