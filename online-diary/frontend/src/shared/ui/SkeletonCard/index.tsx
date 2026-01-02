// shared/ui/Skeleton/SkeletonCard.tsx
import { ReactNode, CSSProperties } from "react";

interface SkeletonCardProps {
  children?: ReactNode;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
}

export const SkeletonCard = ({ children, height, className, style }: SkeletonCardProps) => (
  <div 
    className={className}
    style={{ 
      padding: '18px 20px', 
      background: 'var(--surface)', 
      borderRadius: '18px', 
      border: '1px solid var(--border-color)',
      height,
      display: 'flex',
      flexDirection: 'column',
      ...style 
    }}
  >
    {children}
  </div>
);