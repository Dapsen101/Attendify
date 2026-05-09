// This is the Login page component for Attendx.
// It allows users (students and lecturers) to log in with email and password.
// After successful login, it stores the JWT token and user data in localStorage,
// then redirects students to enter-token page and lecturers to welcome page.
// Uses URL search params to pre-select the role.
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import toast from 'react-hot-toast';

function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [showPassword, setShowPassword] = useState(false);
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
    if (!form.email || !form.password || (role === "student" && !form.matric)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await API.post("/auth/login", {
        role,
        email: form.email,
        password: form.password,
        matric: form.matric,
      });
  
      const data = response.data;
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      if (data.user?.role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/welcome");
      }
  
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
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
                placeholder="e.g. BU23CSC1104"
                className="input-field"
                value={form.matric}
                onChange={handleChange}
              />
            </div>
          )}

          {/* PASSWORD */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">Password</label>
              <span
                onClick={() => navigate('/forgot-password')}
                style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}
              >
                Forgot password?
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="input-field"
                value={form.password}
                onChange={handleChange}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
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

