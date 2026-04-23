import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';

function TokenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(0);
  const [isEnding, setIsEnding] = useState(false);

  const tokenInfo = location.state;

  useEffect(() => {
    if (!tokenInfo || !tokenInfo.expiresAt) {
      navigate('/welcome');
      return;
    }

    const calculateRemaining = () => {
      const diff = new Date(tokenInfo.expiresAt) - new Date();
      return diff > 0 ? Math.floor(diff / 1000) : 0;
    }

    setTime(calculateRemaining());

    const timer = setInterval(() => {
      setTime(calculateRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [tokenInfo, navigate]);

  if (!tokenInfo) return null;

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const isExpired = time <= 0;

  return (
    <div className="app-container center-flex">
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>

        <h2 className="heading-lg mb-6 text-muted" style={{ fontWeight: 500, fontSize: '1.25rem' }}>{isExpired ? "Session Ended" : "Session Active"}</h2>

        <div style={{ background: '#f8fafc', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem', opacity: isExpired ? 0.5 : 1 }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '800', letterSpacing: '0.5rem', color: isExpired ? 'var(--text-muted)' : 'var(--primary)', margin: 0, lineHeight: 1 }}>
            {tokenInfo.token}
          </h1>
        </div>

        <div className="flex items-center justify-center gap-4" style={{ marginBottom: '2rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: isExpired ? '#ef4444' : 'var(--success)', animation: isExpired ? 'none' : 'fadeIn 1s infinite alternate' }}></div>
          <p style={{ fontSize: '1.125rem', fontWeight: 500, color: isExpired ? '#ef4444' : 'var(--text-main)' }}>
            {isExpired ? "Expired" : `Expires in ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}
          </p>
        </div>

        <button className="btn btn-primary btn-block" disabled={isEnding} onClick={async () => {
          if (isExpired) {
            navigate('/welcome');
          } else {
            setIsEnding(true);
            try {
              const API = require('../api/axios').default;
              await API.post(`/sessions/${tokenInfo._id}/end`);
              navigate('/welcome');
            } catch (err) {
              console.error(err);
              toast.error('Failed to end session properly');
              setIsEnding(false);
            }
          }
        }}>
          {isEnding ? "Ending..." : (isExpired ? "Go Back" : "End Session")}
        </button>

      </div>
    </div>
  );
}

export default TokenPage;