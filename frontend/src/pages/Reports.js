import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filtered = reports.filter((r) => {
    const name = r.student?.name?.toLowerCase() || "";
    const matric = r.student?.matric?.toLowerCase() || "";
    const course = r.session?.course?.code?.toLowerCase() || "";
    const q = search.toLowerCase();
    return name.includes(q) || matric.includes(q) || course.includes(q);
  });

  const formatTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="app-container" style={{ backgroundColor: "#f8fafc", padding: "1.5rem", overflowY: "auto" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", width: "100%", paddingBottom: "3rem" }}>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <button
            className="btn btn-outline"
            style={{ border: "none", padding: "0.5rem 0.75rem", fontSize: "1rem" }}
            onClick={() => navigate("/welcome")}
          >
            ←
          </button>
          <div>
            <h2 className="heading-lg" style={{ margin: 0 }}>Attendance Reports</h2>
            <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
              {loading ? "Loading..." : `${reports.length} record${reports.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        {!loading && reports.length > 0 && (
          <div className="input-group animate-fade-in" style={{ marginBottom: "1.5rem" }}>
            <input
              className="input-field"
              placeholder="🔍  Search by name, matric or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="glass-card text-center" style={{ padding: "4rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
            <p className="text-muted">Loading attendance records...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="glass-card text-center animate-fade-in" style={{ padding: "4rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
            <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>No Records Yet</p>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Once students mark attendance, their records will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card text-center animate-fade-in" style={{ padding: "3rem" }}>
            <p className="text-muted">No results match your search.</p>
          </div>
        ) : (
          <div className="glass-card animate-fade-in" style={{ padding: "0", overflow: "hidden" }}>
            {/* Summary bar */}
            <div style={{
              padding: "1rem 1.5rem",
              background: "var(--primary)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontWeight: "700", fontSize: "0.875rem", letterSpacing: "0.5px" }}>
                ATTENDANCE RECORDS
              </span>
              <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>
                {filtered.length} of {reports.length} shown
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", borderBottom: "2px solid var(--border)" }}>
                    <th style={{ padding: "0.875rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>
                      #
                    </th>
                    <th style={{ padding: "0.875rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>
                      Student Name
                    </th>
                    <th style={{ padding: "0.875rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>
                      Matric No.
                    </th>
                    <th style={{ padding: "0.875rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>
                      Course
                    </th>
                    <th style={{ padding: "0.875rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>
                      Time of Attendance
                    </th>
                    <th style={{ padding: "0.875rem 1.25rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", fontWeight: "700" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((record, index) => (
                    <tr
                      key={record._id || index}
                      style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                          {record.student?.name || "Unknown"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {record.student?.email || ""}
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span style={{
                          fontFamily: "monospace",
                          fontSize: "0.85rem",
                          background: "#f1f5f9",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          color: "var(--text-main)"
                        }}>
                          {record.student?.matric || "N/A"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span style={{
                          padding: "0.25rem 0.6rem",
                          background: "#dbeafe",
                          color: "#1e40af",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: "700"
                        }}>
                          {record.session?.course?.code || "N/A"}
                        </span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                          {record.session?.course?.title || ""}
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", fontSize: "0.85rem", color: "var(--text-main)" }}>
                        {formatTime(record.markTime || record.createdAt)}
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span style={{
                          padding: "0.25rem 0.75rem",
                          background: "#dcfce7",
                          color: "#15803d",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem"
                        }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
                          {record.status || "Present"}
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

export default Reports;
