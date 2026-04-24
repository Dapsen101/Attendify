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
      if (data.length > 0) setSelectedCourse(data[0]._id);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const handleCreate = async () => {
    if (!selectedCourse) return toast.error("Select a course first");
    
    setIsLoading(true);

    // Capture location
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const { data } = await API.post("/sessions/create", { 
            course: selectedCourse,
            lat: latitude,
            lng: longitude
          });
          // Send token and expiry info to TokenPage
          navigate("/token", { state: { _id: data._id, token: data.token, expiresAt: data.expiresAt } });
        } catch (error) {
          console.error(error);
          toast.error("Failed to create session");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setIsLoading(false);
        toast.error("Location access denied. Please enable location to create a session.");
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
              <option key={c._id} value={c._id}>{c.code} - {c.title}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary btn-block mt-4" onClick={handleCreate} disabled={isLoading || courses.length === 0}>
          {isLoading ? "Generating..." : "Generate Token"}
        </button>

        <button className="btn btn-outline btn-block mt-4 hide-on-mobile" onClick={() => navigate('/welcome')}>
          Cancel
        </button>

      </div>
    </div>
  );
}

export default CreateSession;