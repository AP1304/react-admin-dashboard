import React from "react";
import "./Card.css";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

const Card: React.FC<CardProps> = React.memo(
  ({ title, children, className = "", headerRight }) => {
    return (
      <div className={`card-container ${className}`}>
        {(title || headerRight) && (
          <div className="card-header">
            {title && <h3 className="card-title">{title}</h3>}
            {headerRight && (
              <div className="card-header-right">{headerRight}</div>
            )}
          </div>
        )}

        <div className="card-content">{children}</div>
      </div>
    );
  }
);

export default Card;