import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/attendance/reports");
        setReports(res.data);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', overflowY: 'auto' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div className="flex items-center gap-4 mb-8">
          <button className="btn btn-outline" style={{ border: 'none', padding: '0.5rem' }} onClick={() => navigate('/welcome')}>
             ← Back
          </button>
          <h2 className="heading-lg" style={{ margin: 0 }}>Attendance Reports</h2>
        </div>

        {loading ? (
          <p className="text-center text-muted py-8">Loading attendance records...</p>
        ) : reports.length === 0 ? (
          <div className="glass-card text-center py-8">
            <p className="text-muted">No attendance reports generated yet.</p>
          </div>
        ) : (
          <div className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Student Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Matric No</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Course</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((record, index) => (
                  <tr key={record._id || index} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{record.student?.name || 'Unknown'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{record.student?.matric || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.5rem', background: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{record.session?.course?.code || 'Unknown'}</span></td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{new Date(record.markTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
