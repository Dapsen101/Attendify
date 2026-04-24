import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyStats();
  }, []);

  const fetchMyStats = async () => {
    try {
      const response = await API.get("/attendance/my-stats");
      setCourses(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load course statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (rate) => {
    if (rate < 75) return "#ef4444"; // Red
    if (rate < 80) return "#eab308"; // Yellow
    return "#22c55e"; // Green
  };

  return (
    <div className="app-container" style={{ overflowY: 'auto' }}>
      <div className="dashboard-container animate-fade-in">
        <header className="dashboard-header">
          <div className="logo-group" onClick={() => navigate('/student-dashboard')} style={{ cursor: 'pointer' }}>
            <div className="logo-box">A</div>
            <h1 className="logo-text">AttendX</h1>
          </div>
          <button className="btn btn-secondary hide-on-mobile" onClick={() => navigate('/student-dashboard')}>
            Back
          </button>
        </header>

        <div className="mb-8">
            <h2 className="heading-lg mb-2">My Registered Courses</h2>
            <p className="text-muted">Detailed attendance breakdown per course</p>
        </div>

        <div className="flex flex-col gap-6">
          {isLoading ? (
            <p className="text-center text-muted py-12">Loading your courses...</p>
          ) : courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="heading-md" style={{ marginBottom: '0.25rem' }}>{course.code}</h3>
                    <p className="text-muted">{course.title}</p>
                  </div>
                  <div className="text-right">
                    <span className="heading-lg" style={{ color: getProgressColor(course.percentage) }}>
                        {course.percentage}%
                    </span>
                    <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Attendance</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4" style={{ borderTop: '1px solid var(--border)', fontSize: '0.875rem' }}>
                  <span className="text-muted">Attended: <strong>{course.attendedSessions}</strong></span>
                  <span className="text-muted">Total Sessions: <strong>{course.totalSessions}</strong></span>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card text-center py-12">
               <p className="text-muted mb-4">You haven't registered for any courses yet.</p>
               <button className="btn btn-primary" onClick={() => navigate('/course-registration')}>
                 Browse Courses
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCourses;
