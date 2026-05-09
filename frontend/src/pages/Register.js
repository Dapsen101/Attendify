import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import toast from 'react-hot-toast';

function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    if (role === 'student' && form.matricNumber) {
        const letters = (form.matricNumber.match(/[a-zA-Z]/g) || []).length;
        const digits = (form.matricNumber.match(/[0-9]/g) || []).length;
        if (letters !== 5 || digits !== 6 || form.matricNumber.length !== 11) {
            return setErrorMsg("Matric number must contain exactly 5 letters and 6 numbers (11 characters total)");
        }
    }

    try {
      const response = await API.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: role,
        matricNumber: role === "student" ? form.matricNumber : undefined
      });
      
      toast.success(response.data.message || "Registration successful!");
      // automatically redirect to login
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
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
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