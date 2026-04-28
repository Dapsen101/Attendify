import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from 'react-hot-toast';

function Welcome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  // Add Course State
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [dbCourses, setDbCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
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

  const fetchDbCourses = async () => {
    try {
        const res = await API.get("/courses/database");
        setDbCourses(res.data);
    } catch (err) {
        console.error("Failed to load DB courses", err);
    }
  };

  const handleToggleAdd = () => {
    const nextState = !showAddCourse;
    setShowAddCourse(nextState);
    if (nextState) fetchDbCourses();
  };

  const handleAssignCourse = async (courseId) => {
    try {
        await API.post("/courses/assign", { courseId });
        toast.success("Course added to your list");
        fetchDashboardData();
        setShowAddCourse(false);
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add course");
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await API.post("/courses", { title: courseTitle, code: courseCode });
      toast.success("New course template created and added");
      setShowAddCourse(false);
      setCourseCode("");
      setCourseTitle("");
      fetchDashboardData();
    } catch (err) {
      console.error("Add Course Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to add course");
    }
  };

  // Helper to filter out courses lecturer already has
  const myCourseIds = courses.map(c => c._id);
  const availableDbCourses = dbCourses.filter(c => !myCourseIds.includes(c._id));

  return (
    <div className="app-container dashboard-container" style={{ backgroundColor: '#f8fafc', overflowY: 'auto' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '2rem' }}>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>
              A
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem', letterSpacing: '0.5px' }}>ATTENDX</span>
          </div>

          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => { localStorage.clear(); navigate('/'); }}>
            <span title="Logout">⎋</span>
          </div>
        </div>

        {/* GREETING */}
        <div className="mb-6 animate-fade-in">
          <p className="text-muted" style={{ marginBottom: '0.25rem' }}>Welcome Back,</p>
          <h2 className="heading-xl">{user ? ` ${user.name}` : "Lecturer"}</h2>
        </div>

        {/* STATS */}
        <div className="flex flex-mobile-col gap-4 mb-8">
          <div className="glass-card animate-pop" style={{ flex: 1, padding: '1.5rem 1.5rem', textAlign: 'center', animationDelay: '0.1s' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>{courses.length}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', padding: '0 10px' }}>Your Courses</p>
          </div>

          <div className="glass-card animate-pop" style={{ flex: 1, padding: '1.5rem 1.5rem', textAlign: 'center', animationDelay: '0.2s' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>{sessions.length}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Active Sessions</p>
          </div>

          <div className="glass-card animate-pop" style={{ flex: 1, padding: '1.5rem 1.5rem', textAlign: 'center', animationDelay: '0.3s' }}>
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
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ● YOUR COURSES
            </span>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={handleToggleAdd}>
              {showAddCourse ? 'Cancel' : '+ Add Course'}
            </button>
          </div>

          {showAddCourse && (
            <div className="glass-card mb-6 animate-pop" style={{ padding: '1.5rem' }}>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                 <h3 className="heading-md">{isCreatingNew ? "Create New Course" : "Find Your Course"}</h3>
                 <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setIsCreatingNew(!isCreatingNew)}>
                     {isCreatingNew ? "Back to Search" : "Not listed? Create New"}
                 </button>
              </div>

              {isCreatingNew ? (
                <form onSubmit={handleAddCourse} className="flex flex-col gap-4">
                    <input className="input-field" placeholder="Code (e.g. CSC 101)" value={courseCode} onChange={e => setCourseCode(e.target.value)} required />
                    <input className="input-field" placeholder="Course Title" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} required />
                    <button type="submit" className="btn btn-primary">Create Template & Add</button>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                    <input 
                        className="input-field" 
                        placeholder="🔍  Search department courses..." 
                        value={courseSearch} 
                        onChange={e => setCourseSearch(e.target.value)} 
                    />
                    <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                        {availableDbCourses.filter(c => 
                            c.title.toLowerCase().includes(courseSearch.toLowerCase()) || 
                            c.code.toLowerCase().includes(courseSearch.toLowerCase())
                        ).length > 0 ? (
                            availableDbCourses
                                .filter(c => 
                                    c.title.toLowerCase().includes(courseSearch.toLowerCase()) || 
                                    c.code.toLowerCase().includes(courseSearch.toLowerCase())
                                )
                                .map(c => (
                                    <div key={c._id} style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                                        <div>
                                            <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>{c.code}</span>
                                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>{c.title}</p>
                                        </div>
                                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleAssignCourse(c._id)}>
                                            + Add
                                        </button>
                                    </div>
                                ))
                        ) : (
                            <p className="text-muted text-center py-6">No matching courses found.</p>
                        )}
                    </div>
                </div>
              )}
            </div>
          )}

          {courses.length === 0 ? (
             <div className="glass-card text-center py-12">
               <p className="text-muted mb-4">You haven't assigned any courses to yourself yet.</p>
               <button className="btn btn-primary" onClick={handleToggleAdd} id="browse-btn">Browse All Courses</button>
             </div>
          ) : (
            <div className="flex flex-col gap-4">
              {courses.map((course, idx) => {
                const isActive = sessions.some(s => s.course?._id === course._id || s.course === course._id);
                return (
                 <div key={course._id || idx} style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{course.code} - {course.title}</h4>
                    <p className={isActive ? "text-success" : "text-muted"} style={{ fontSize: '0.875rem', fontWeight: '500' }}>
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
        <div className="flex flex-mobile-col gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {/* <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/create-session')}>View Active Sessions</button> */}
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/reports')}>View Reports</button>
        </div>

      </div>
    </div>
  );
}

export default Welcome;