import React from 'react';

interface SpinnerProps {
  size?: number;        // Размер спиннера (по умолчанию 40)
  color?: string;       // Цвет спиннера (по умолчанию #3498db)
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, color = '#3498db' }) => {
  const spinnerStyle: React.CSSProperties = {
    width: size,  
    height: size,
    borderColor: `${color} transparent ${color} transparent`,
  };

  return (
    <div
      className="border-4 border-solid rounded-full animate-spin"
      style={spinnerStyle}
    />
  );
};

export default Spinner;
