import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message);
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  const toggleBtnStyle = {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text-muted)",
  };

  return (
    <div className="app-container center-flex">
      <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark, #4338ca))",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
            boxShadow: "0 8px 24px rgba(99,102,241,0.3)"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="heading-lg" style={{ marginBottom: "0.5rem" }}>Set New Password</h2>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Choose a strong password for your account.
          </p>
        </div>

        {done ? (
          <div style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "var(--radius-md)",
            padding: "1.5rem",
            textAlign: "center",
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "0.75rem" }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p style={{ fontWeight: 700, color: "#15803d", marginBottom: "0.5rem" }}>Password Reset!</p>
            <p style={{ color: "#16a34a", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <button className="btn btn-primary btn-block" onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* New password */}
            <div className="input-group">
              <label className="input-label">New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: "2.5rem" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={toggleBtnStyle}>
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingRight: "2.5rem" }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={toggleBtnStyle}>
                  <EyeIcon visible={showConfirm} />
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block mt-4"
              onClick={handleReset}
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
