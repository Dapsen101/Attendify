import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  const handleReturn = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === "student") {
      navigate("/student-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="app-container center-flex">
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', textAlign: "center", padding: '3rem 2rem' }}>

        <div className="animate-pop" style={{ 
          width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success)', 
          color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '2.5rem', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' 
        }}>
          {/** Inline SVG Check for 'drawCheck' animation or just simple character */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'drawCheck 0.6s ease-out 0.2s forwards' }} />
          </svg>
        </div>

        <h2 className="heading-lg mb-4" style={{ color: 'var(--text-main)' }}>Attendance Marked</h2>

        <p className="text-muted mb-6" style={{ fontSize: '1rem', lineHeight: 1.5 }}>
          You have successfully recorded your attendance for this session.
        </p>

        <button className="btn btn-primary btn-block mt-4" onClick={handleReturn}>
          Return Home
        </button>

      </div>
    </div>
  );
}

export default Success;