import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

function CourseRegistration() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [availableRes, myRes] = await Promise.all([
        API.get("/courses/available"),
        API.get("/courses/my-courses")
      ]);
      setCourses(availableRes.data || []);
      setMyCourses((myRes.data || []).filter(c => c).map(c => c._id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (courseId) => {
    try {
      await API.post("/courses/enroll", { courseId });
      toast.success("Successfully registered for course!");
      setMyCourses([...myCourses, courseId]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
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
            <h2 className="heading-lg">Course Registration</h2>
            <p className="text-muted">Register for your courses to start marking attendance.</p>
          </div>
        </div>

        {loading ? (
          <div className="glass-card text-center" style={{ padding: '4rem' }}>
            <p className="text-muted">Loading courses...</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {courses.map(course => {
              const isEnrolled = myCourses.includes(course._id);
              return (
                <div key={course._id} className="glass-card" style={{ gridColumn: 'span 4', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'var(--secondary)', color: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                      {course.code}
                    </span>
                    <h3 style={{ marginTop: '0.75rem', fontSize: '1.125rem', fontWeight: 600 }}>{course.title}</h3>
                    <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Lecturer: {course.lecturer?.name || 'Unknown'}</p>
                  </div>
                  
                  <button 
                    className={`btn btn-block mt-6 ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={isEnrolled}
                    onClick={() => handleRegister(course._id)}
                    style={{ fontSize: '0.875rem' }}
                  >
                    {isEnrolled ? 'Registered' : 'Register Now'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        
        {courses.length === 0 && !loading && (
          <div className="glass-card text-center" style={{ padding: '4rem' }}>
             <p className="text-muted">No courses available for registration.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseRegistration;
