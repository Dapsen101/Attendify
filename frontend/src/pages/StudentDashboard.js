import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showCourseSelect, setShowCourseSelect] = useState(false);
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
      const coursesRes = await API.get("/courses/my-courses");
      setEnrolledCourses(coursesRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
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
          <button 
            className="btn btn-primary" 
            style={{ borderRadius: '2rem' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <div className="dashboard-grid">
          {/* Welcome Card */}
          <div className="glass-card welcome-card">
            <h2 className="heading-xl mb-2">
              Welcome, {user.name.split(' ')[0]} 👋
            </h2>
            <p className="text-muted">Here's your attendance overview</p>
          </div>

          {/* Actions List */}
          <div className="glass-card actions-card">
            <div className="action-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
              <button className="action-btn" onClick={() => setShowCourseSelect(true)}>
                <span className="icon">📍</span>
                <span>Mark Attendance</span>
              </button>
              <button className="action-btn" onClick={() => navigate("/my-courses")}>
                <span className="icon">📚</span>
                <span>My Courses</span>
              </button>
              <button className="action-btn" onClick={() => navigate("/history")}>
                <span className="icon">📄</span>
                <span>Attendance History</span>
              </button>
              <button className="action-btn" onClick={() => navigate("/course-registration")}>
                <span className="icon">➕</span>
                <span>Register for Courses</span>
              </button>
            </div>
          </div>
        </div>

        {/* Course Selection Modal */}
        {showCourseSelect && (
          <div className="modal-overlay">
            <div className="glass-card modal-content animate-pop">
              <h3 className="heading-md mb-4 text-center">Select Course</h3>
              <p className="text-muted mb-6 text-center">Which course are you marking attendance for?</p>
              
              <div className="flex flex-col gap-3">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map(course => (
                    <button 
                      key={course._id} 
                      className="btn btn-outline btn-block text-left" 
                      style={{ justifyContent: 'flex-start', padding: '1rem' }}
                      onClick={() => navigate(`/enter-token?course=${course._id}&name=${encodeURIComponent(course.code)}`)}
                    >
                      <strong>{course.code}</strong> - {course.title}
                    </button>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted">You are not registered for any courses yet.</p>
                )}
              </div>

              <button className="btn btn-secondary btn-block mt-6" onClick={() => setShowCourseSelect(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
