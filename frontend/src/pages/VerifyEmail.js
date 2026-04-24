import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Please wait while we verify your account...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const response = await API.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message);
        toast.success("Account verified!");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed. The link may be expired.");
        toast.error("Verification failed");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="app-container center-flex">
      <div className="glass-card text-center animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2rem' }}>
        
        {status === "verifying" && <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⏳</div>}
        {status === "success" && <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✅</div>}
        {status === "error" && <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>❌</div>}

        <h2 className="heading-lg mb-4">
          {status === "verifying" ? "Verifying Email" : status === "success" ? "All Set!" : "Verification Failed"}
        </h2>
        
        <p className="text-muted mb-8" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          {message}
        </p>

        {status !== "verifying" && (
          <button className="btn btn-primary btn-block" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
