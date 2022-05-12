import React from 'react';

export interface DefaultButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DefaultButton = ({ disabled, ...rest }: DefaultButtonProps) => (
  <button {...rest} disabled={disabled} className={disabled ? 'border-button' : ''} />
);
export default DefaultButton;
