import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from 'react-hot-toast';

function CreateSession() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await API.get("/courses");
      setCourses(data);
      if (data.length > 0) setSelectedCourse(data[0].title);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const handleCreate = async () => {
    if (!selectedCourse) return toast.error("Select a course first");
    
    setIsLoading(true);
    try {
      const { data } = await API.post("/sessions/create", { course: selectedCourse });
      // Send token and expiry info to TokenPage
      navigate("/token", { state: { _id: data._id, token: data.token, expiresAt: data.expiresAt } });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container center-flex">
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--secondary)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
            +
          </div>
          <h2 className="heading-lg">Create Session</h2>
          <p className="text-muted mt-4" style={{ fontSize: '0.875rem' }}>Select a course to generate an attendance token for your students.</p>
        </div>

        <div className="input-group">
          <label className="input-label">Select Course</label>
          <select 
            className="input-field"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={courses.length === 0}
          >
            {courses.length === 0 && <option value="">No courses available</option>}
            {courses.map(c => (
              <option key={c._id} value={c.title}>{c.code} - {c.title}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary btn-block mt-4" onClick={handleCreate} disabled={isLoading || courses.length === 0}>
          {isLoading ? "Generating..." : "Generate Token"}
        </button>

        <button className="btn btn-outline btn-block mt-4" onClick={() => navigate('/welcome')}>
          Cancel
        </button>

      </div>
    </div>
  );
}

export default CreateSession;