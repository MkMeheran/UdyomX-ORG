import * as React from 'react';
import { icons } from 'lucide-react';

export interface IconProps {
  name: keyof typeof icons;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className, style }) => {
  const LucideIcon = icons[name];
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <LucideIcon size={size} className={className} style={style} />;
};

export default Icon;
