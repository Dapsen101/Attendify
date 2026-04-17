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