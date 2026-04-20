// This is the Landing page component for Attendify.
// It serves as the home page, displaying the app's branding and
// providing login buttons for students and lecturers.
// Uses React Router's useNavigate for navigation.
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="app-container center-flex" style={{ backgroundColor: '#ffffff' }}>
      
      {/* Background decorations for a "premium" feel */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--secondary) 0%, transparent 60%)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, #f0f5ff 0%, transparent 70%)', zIndex: 0 }}></div>

      <div className="glass-card animate-fade-in" style={{ textAlign: 'center', maxWidth: '500px', zIndex: 1, border: '1px solid var(--border)' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)', color: 'white', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', boxShadow: '0 8px 16px rgba(0, 82, 204, 0.2)' }}>
          A
        </div>

        <h1 className="heading-xl mb-6">Attendance verification<br/><span style={{ color: 'var(--primary)' }}>in seconds.</span></h1>
        
        <p className="text-muted" style={{ marginBottom: '2.5rem', fontSize: '1.125rem', lineHeight: '1.6' }}>
          Attendify streamlines your classroom experience. Fast, secure, and hassle-free attendance tracking for modern universities.
        </p>

        <div className="flex flex-col gap-4">
          <button 
            className="btn btn-primary btn-block animate-pop" 
            style={{ animationDelay: '0.1s' }}
            onClick={() => navigate('/login?role=student')}
          >
            Student Log In
          </button>
          
          <button 
            className="btn btn-outline btn-block animate-pop" 
            style={{ animationDelay: '0.2s' }}
            onClick={() => navigate('/login?role=lecturer')}
          >
            Lecturer Access
          </button>
        </div>

      </div>
    </div>
  );
}

export default Landing;
