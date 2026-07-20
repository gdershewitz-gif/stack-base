import React from 'react';
import { getMappedCategory } from '../data/projects';
import './Tag.css';

interface TagProps {
  variant?: 'category' | 'role' | 'status' | 'filter' | 'default';
  value: string;
  colorIndex?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  variant = 'default',
  value,
  colorIndex,
  active = false,
  onClick,
  className = ''
}) => {
  const isClickable = !!onClick || variant === 'filter';
  
  const classes = [
    'tag-pill',
    `tag-${variant}`,
    active ? 'tag-active' : '',
    isClickable ? 'tag-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  let dataCategory = undefined;
  if (variant === 'category' || variant === 'filter') {
    dataCategory = getMappedCategory(value);
  }

  let dataStatus = undefined;
  if (variant === 'status') {
    dataStatus = value.toLowerCase().includes('active') || value.toLowerCase().includes('recruit') ? 'active' : 'inactive';
  }

  const roleClass = variant === 'role' && colorIndex !== undefined 
    ? `role-pill-${colorIndex % 5}` 
    : '';

  return (
    <span 
      className={`${classes} ${roleClass}`}
      data-category={dataCategory}
      data-status={dataStatus}
      onClick={onClick}
    >
      {value}
    </span>
  );
};
