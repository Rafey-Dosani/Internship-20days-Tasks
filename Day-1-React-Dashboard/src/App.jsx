
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SummaryCard from "./components/SummaryCard";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-content" id="dashboard">
          <div className="page-heading">
            <div>
              <h1>Dashboard Overview</h1>
              <p>Here's what's happening with your workspace.</p>
            </div>
            <button className="report-button">Download Report</button>
          </div>

          <div className="summary-grid">
            <SummaryCard title="Total Revenue" value="$24,500" change="+12.5% this month" />
            <SummaryCard title="Total Users" value="1,840" change="+8.2% this month" />
            <SummaryCard title="Active Projects" value="24" change="+4 new projects" />
            <SummaryCard title="Conversion Rate" value="4.8%" change="+1.2% this month" />
          </div>

          <section className="activity-section">
            <h2>Recent Activity</h2>
            <p>Your dashboard is ready. More activity details will appear here.</p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
