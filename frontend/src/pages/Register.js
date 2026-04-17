import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    matricNumber: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = async () => {
    if (!form.fullName || !form.email || !form.password) {
      return setErrorMsg("Please fill all required fields");
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      await API.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: role,
        matricNumber: role === "student" ? form.matricNumber : undefined
      });
      // automatically redirect to login with pre-selected role
      navigate("/login?role=" + role);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container center-flex">
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>

        <h2 className="heading-lg text-center mb-6">Create Account</h2>

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

        {errorMsg && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" className="input-field" />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className="input-field" />
          </div>

          {role === "student" && (
            <div className="input-group">
              <label className="input-label">Matric Number</label>
              <input name="matricNumber" value={form.matricNumber} onChange={handleChange} placeholder="e.g. 19/1234" className="input-field" />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input-field" />
          </div>

          <button className="btn btn-primary btn-block mt-4" onClick={handleContinue} disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-muted mt-4" style={{ fontSize: '0.875rem' }}>
            Already have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate('/login?role=' + role)}>Sign In</span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;