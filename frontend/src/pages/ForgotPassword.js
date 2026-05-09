import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container center-flex">
      <div className="glass-card animate-fade-in" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Back link */}
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
            padding: 0,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Login
        </button>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
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
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h2 className="heading-lg" style={{ marginBottom: "0.5rem" }}>Forgot Password?</h2>
          <p className="text-muted" style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
            No worries! Enter your registered email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem",
            textAlign: "center",
            color: "#16a34a"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "0.5rem" }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Check your inbox!</p>
            <p style={{ fontSize: "0.875rem", color: "#15803d" }}>
              If <strong>{email}</strong> is registered, a reset link is on its way.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <button
              className="btn btn-primary btn-block mt-4"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
