import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Welcome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  // Add Course State
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const courseRes = await API.get("/courses");
      setCourses(courseRes.data);
      const sessionRes = await API.get("/sessions/active");
      setSessions(sessionRes.data);
      const statsRes = await API.get("/sessions/stats");
      setTotalStudents(statsRes.data.totalStudents || 0);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await API.post("/courses", { title: courseTitle, code: courseCode });
      setShowAddCourse(false);
      setCourseCode("");
      setCourseTitle("");
      fetchDashboardData();
    } catch (err) {
      console.error("Add Course Error:", err.response?.data);
      alert(err.response?.data?.message || "Failed to add course");
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', overflowY: 'auto' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '2rem' }}>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
              A
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem', letterSpacing: '0.5px' }}>ATTENx</span>
          </div>

          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => { localStorage.clear(); navigate('/'); }}>
            <span title="Logout">⎋</span>
          </div>
        </div>

        {/* GREETING */}
        <div className="mb-6 animate-fade-in">
          <p className="text-muted" style={{ marginBottom: '0.25rem' }}>Welcome Back,</p>
          <h2 className="heading-xl">{user ? `Dr. ${user.name}` : "Lecturer"}</h2>
        </div>

        {/* STATS */}
        <div className="flex gap-4 mb-8">
          <div className="glass-card animate-pop" style={{ flex: 1, padding: '1.5rem 1rem', textAlign: 'center', animationDelay: '0.1s' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>{courses.length}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Courses</p>
          </div>

          <div className="glass-card animate-pop" style={{ flex: 1, padding: '1.5rem 1rem', textAlign: 'center', animationDelay: '0.2s' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>{sessions.length}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Active Sessions</p>
          </div>

          <div className="glass-card animate-pop" style={{ flex: 1, padding: '1.5rem 1rem', textAlign: 'center', animationDelay: '0.3s' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>{totalStudents}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Total Students</p>
          </div>
        </div>

        {/* CREATE BUTTON */}
        <button 
          className="btn btn-primary btn-block mb-8 animate-pop" 
          style={{ padding: '1.25rem', fontSize: '1.125rem', animationDelay: '0.4s' }}
          onClick={() => navigate('/create-session')}
        >
          + Create New Session
        </button>

        {/* COURSES SECTION */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex justify-between items-center mb-4">
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ● YOUR COURSES
            </span>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setShowAddCourse(!showAddCourse)}>
              {showAddCourse ? 'Cancel' : '+ Add Course'}
            </button>
          </div>

          {showAddCourse && (
            <form onSubmit={handleAddCourse} className="glass-card mb-4 animate-pop" style={{ padding: '1rem' }}>
              <div className="flex gap-4">
                <input className="input-field" placeholder="Code (e.g. CSC 101)" value={courseCode} onChange={e => setCourseCode(e.target.value)} required />
                <input className="input-field" placeholder="Course Title" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} required />
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          )}

          {courses.length === 0 ? (
             <p className="text-muted text-center py-4">No courses registered yet. Add a course to get started.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {courses.map((course, idx) => {
                const isActive = sessions.some(s => s.course?._id === course._id || s.course === course._id);
                return (
                 <div key={course._id || idx} style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{course.code} - {course.title}</h4>
                    <p className={isActive ? "text-success" : "text-muted"} style={{ fontSize: '0.875rem', color: isActive ? 'var(--success)' : ''}}>
                      {isActive ? "● Active Session" : "Offline"}
                    </p>
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '500' }}>→</span>
                 </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/create-session')}>View Active Sessions</button>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/reports')}>View Reports</button>
        </div>

      </div>
    </div>
  );
}

export default Welcome;