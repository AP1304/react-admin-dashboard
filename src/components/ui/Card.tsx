import React from "react";
import "./Card.css";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = React.memo(
  ({ title, children, className = "" }) => {
    return (
      <div className={`card-container ${className}`}>
        {title && <h3 className="card-title">{title}</h3>}
        {children}
      </div>
    );
  }
);

export default Card;