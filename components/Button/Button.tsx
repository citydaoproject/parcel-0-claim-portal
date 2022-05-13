import { FC } from 'react';
interface ButtonProps {
  isEnabled?: boolean;
  onClick: () => void;
  label: string;
  isBordered?: boolean;
}

export const Button: FC<ButtonProps> = ({ isEnabled = true, onClick, label, isBordered }) => (
  <button disabled={!isEnabled} onClick={onClick} className={isBordered ? 'border-button' : ''}>
    {label}
  </button>
);
