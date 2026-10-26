
function SummaryCard({ title, value, change }) {
  return (
    <div className="summary-card">
      <p className="card-title">{title}</p>
      <h2>{value}</h2>
      <p className="card-change">{change}</p>
    </div>
  );
}

export default SummaryCard;
