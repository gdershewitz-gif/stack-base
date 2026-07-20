import React, { useState } from 'react';
import { getMappedCategory } from '../data/projects';
import './Avatar.css';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'project' | 'founder';
  category?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  variant = 'project',
  category,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (nameStr: string) => {
    const trimmed = nameStr.trim();
    if (!trimmed) return '?';
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);
  const dataCategory = category ? getMappedCategory(category) : 'Other';

  const avatarClasses = [
    'fb-avatar',
    `fb-avatar-${size}`,
    `fb-avatar-${variant}`,
    className
  ].filter(Boolean).join(' ');

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={`${name} avatar`}
        className={avatarClasses}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div 
      className={`${avatarClasses} fb-avatar-placeholder`} 
      data-category={dataCategory}
    >
      {initials}
    </div>
  );
};
