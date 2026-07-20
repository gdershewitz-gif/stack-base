import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padding = 'md',
  className = '',
  style,
  onClick
}) => {
  const classes = [
    'fb-card',
    hoverable ? 'fb-card-hoverable' : '',
    `fb-card-pad-${padding}`,
    onClick ? 'fb-card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} onClick={onClick}>
      {children}
    </div>
  );
};
