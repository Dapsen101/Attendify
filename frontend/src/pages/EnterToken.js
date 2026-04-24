// This is the EnterToken page component for students in Attendx.
// Students enter the 6-digit token provided by the lecturer to mark their attendance.
// Upon successful submission, redirects to the success page.
// Handles loading states and error messages.
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function EnterToken() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("course");
  const courseName = searchParams.get("name") || "Course";
  
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!token || token.length < 6) return setErrorMsg("Enter a valid 6-digit token");
    if (!courseId) return setErrorMsg("Missing course information. Please go back and select a course.");
    setErrorMsg("");
    
    setIsLoading(true);

    // Capture location for geofencing
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await API.post("/attendance/mark", { 
            token, 
            courseId,
            lat: latitude,
            lng: longitude
          });
          toast.success(`Attendance marked for ${courseName}`);
          navigate("/success");
        } catch (err) {
          console.error(err);
          setErrorMsg(err.response?.data?.message || "Failed to mark attendance.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        setErrorMsg("Location access denied. Please enable location to mark attendance.");
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="app-container center-flex">
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>

        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--secondary)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
          #
        </div>

        <h2 className="heading-lg mb-4">Enter Token</h2>
        <p className="text-secondary mb-2" style={{ fontWeight: 600 }}>{courseName}</p>
        <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>Please enter the 6-digit session token provided by your lecturer.</p>

        {errorMsg && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        <div className="input-group" style={{ textAlign: 'left' }}>
          <input
            className="input-field"
            placeholder="e.g. 159230"
            value={token}
            maxLength={6}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
            style={{ fontSize: '1.5rem', letterSpacing: '0.25rem', textAlign: 'center', padding: '1rem' }}
          />
        </div>

        <button className="btn btn-primary btn-block mt-4" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Mark Attendance"}
        </button>

      </div>
    </div>
  );
}

export default EnterToken;
