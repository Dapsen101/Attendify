import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/attendance/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to load history", err);
        toast.error("Failed to load attendance history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatTime = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const presentCount = history.filter(h => h.status === 'Present').length;
  const percentage = history.length > 0 ? Math.round((presentCount / history.length) * 100) : 0;

  const getStatusStyle = (status) => {
    if (status === 'Present') {
      return { background: '#dcfce7', color: '#15803d' };
    }
    return { background: '#fee2e2', color: '#b91c1c' };
  };

  return (
    <div className="app-container" style={{ backgroundColor: "#f8fafc", padding: "1.5rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button className="btn btn-outline hide-on-mobile" style={{ border: 'none', fontSize: '1.25rem' }} onClick={() => navigate("/student-dashboard")}>
            ←
          </button>
          <div>
            <h2 className="heading-lg">Attendance History</h2>
            <p className="text-muted">Overall Attendance: <strong>{percentage}%</strong></p>
          </div>
        </div>

        {loading ? (
          <div className="glass-card text-center" style={{ padding: '4rem' }}>
            <p className="text-muted">Loading your history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="glass-card text-center animate-fade-in" style={{ padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <p className="text-muted">No attendance records found yet.</p>
          </div>
        ) : (
          <div className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Course</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date & Time</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{item.session?.course || 'Unknown Course'}</div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem' }}>
                        {formatTime(item.markTime || item.session?.createdAt)}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          ...getStatusStyle(item.status)
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceHistory;
