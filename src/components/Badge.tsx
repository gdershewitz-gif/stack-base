import React from 'react';
import type { PricingModel } from '../data/tools';
import './Badge.css';

interface BadgeProps {
  model: PricingModel;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ model, className = '' }) => {
  const badgeClass = `badge badge-${model.toLowerCase()} ${className}`;
  return (
    <span className={badgeClass.trim()}>
      {model}
    </span>
  );
};
