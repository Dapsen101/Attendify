import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [form, setForm] = useState({
    name: "",
    matric: "",
    department: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await API.post("/auth/login", {
        role,
        email: form.email,
        password: form.password,
      });
  
      const data = response.data;
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      if (data.user?.role === "student") {
        navigate("/enter-token");
      } else {
        navigate("/welcome");
      }
  
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="app-container center-flex">
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>

        <h2 className="heading-lg text-center mb-6">Welcome Back</h2>

        {/* TOGGLE */}
        <div className="toggle-group">
          <button
            className={`toggle-btn ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>

          <button
            className={`toggle-btn ${role === "lecturer" ? "active" : ""}`}
            onClick={() => setRole("lecturer")}
          >
            Lecturer
          </button>
        </div>

        <div className="flex flex-col">
          {/* COMMON FIELDS */}
          {/* Typically login doesn't need name/department, maybe this is a combined form, but keeping logic */}
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input-field"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* STUDENT ONLY */}
          {role === "student" && (
            <div className="input-group">
              <label className="input-label">Matric Number</label>
              <input
                name="matric"
                placeholder="e.g. 19/1234"
                className="input-field"
                value={form.matric}
                onChange={handleChange}
              />
            </div>
          )}

          {/* PASSWORD */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="input-field"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary btn-block mt-4" onClick={handleLogin}>
            Sign In
          </button>

          <p className="text-center text-muted mt-4" style={{ fontSize: '0.875rem' }}>
            Don't have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate('/register?role='+role)}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;