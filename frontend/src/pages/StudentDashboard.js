import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    attendanceRate: 0,
    attendedCount: 0,
    totalSessionsCount: 0,
    upcomingSessions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate("/login");
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get("/attendance/dashboard");
      setStats(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const getProgressColor = (rate) => {
    if (rate < 75) return "#ef4444"; // Red
    if (rate < 80) return "#eab308"; // Yellow
    return "#22c55e"; // Green
  };

  if (!user) return null;

  return (
    <div className="app-container">
      <div className="dashboard-container animate-fade-in">
        {/* Header */}
        <header className="dashboard-header">
          <div className="logo-group">
            <div className="logo-box">A</div>
            <h1 className="logo-text">AttendX</h1>
          </div>
          <button className="btn btn-primary" style={{ padding: '0.625rem 1.25rem', borderRadius: '2rem' }} onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="dashboard-grid">
          {/* Welcome Card */}
          <div className="glass-card welcome-card">
            <h2 className="heading-lg mb-2">
              Welcome, {user.name.split(' ')[0]} 👋
            </h2>
            <p className="text-muted">Here's your attendance overview</p>
          </div>

          {/* Attendance Rate Card */}
          <div className="glass-card stat-card">
            <h3 className="card-title">Attendance Rate</h3>
            <div className="progress-wrapper">
              <div className="progress-bg">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${stats.attendanceRate}%`,
                    backgroundColor: getProgressColor(stats.attendanceRate)
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="progress-info">{stats.attendanceRate}% attendance</span>
              </div>
            </div>
          </div>

          {/* Actions List */}
          <div className="glass-card actions-card">
            <div className="action-list">
              <button className="action-btn" onClick={() => navigate("/enter-token")}>
                <span className="icon">📍</span>
                Mark Attendance
              </button>
              <button className="action-btn" onClick={() => navigate("/history")}>
                <span className="icon">📄</span>
                View Attendance History
              </button>
              <button className="action-btn">
                <span className="icon">📊</span>
                Check Statistics
              </button>
            </div>
          </div>

          <div style={{ gridColumn: 'span 7' }}></div>

          {/* Upcoming Classes Card */}
          <div className="glass-card upcoming-card">
            <h3 className="card-title">Upcoming Classes</h3>
            {isLoading ? (
                <p className="text-muted">Loading classes...</p>
            ) : stats.upcomingSessions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {stats.upcomingSessions.map(session => (
                    <div key={session._id} className="flex justify-between items-center p-4" style={{ background: '#f8fafc', borderRadius: '1rem' }}>
                        <div>
                            <p style={{ fontWeight: 600 }}>{session.course || 'Unknown Course'}</p>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/enter-token")}>
                            Join Now
                        </button>
                    </div>
                  ))}
                </div>
            ) : (
                <p className="text-muted">No upcoming classes scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
