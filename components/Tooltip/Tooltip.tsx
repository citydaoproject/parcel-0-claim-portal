// Reference (Thanks!)
// https://dev.to/vtrpldn/how-to-make-an-extremely-reusable-tooltip-component-with-react-and-nothing-else-3pnk

import { ReactNode, useState } from 'react';
import PropTypes from 'prop-types';

import * as S from './Tooltip.styled';
type TooltipProps = {
  delay?: number;
  children: ReactNode;
  direction: 'top' | 'right' | 'bottom' | 'left';
  content: string;
};
export const Tooltip = ({ delay = 200, children, direction, content }: TooltipProps) => {
  let timeout: NodeJS.Timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <S.Wrapper onMouseEnter={showTip} onMouseLeave={hideTip}>
      {children}
      {active && <S.Tooltip direction={direction}>{content}</S.Tooltip>}
    </S.Wrapper>
  );
};

Tooltip.propTypes = {
  delay: PropTypes.string,
  children: PropTypes.array.isRequired,
  direction: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
