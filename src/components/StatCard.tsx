import "./StatCard.css";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

const StatCard = ({ title, value, change }: StatCardProps) => {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
      <p>{change}</p>
    </div>
  );
};

export default StatCard;