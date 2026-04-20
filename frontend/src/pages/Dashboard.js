// This is the Dashboard page component for lecturers in Attendify.
// It displays a welcome message and provides a button to create a new attendance session.
// Currently hardcoded for "Dr. Adeniyi" - should be made dynamic based on logged-in user.
function Dashboard() {
    return (
      <div className="container">
        <div className="card">
  
          <h2 className="title">Welcome, Dr. Adeniyi</h2>
  
          <button 
            className="button"
            onClick={() => window.location.href = "/create-session"}
          >
            Create Session
          </button>
  
        </div>
      </div>
    );
  }
  
  export default Dashboard;