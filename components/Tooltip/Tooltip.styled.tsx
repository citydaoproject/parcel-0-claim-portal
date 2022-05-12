import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const TooltipModifiers = {
  top: () => css`
    top: calc(3rem * -1);
    &:before {
      top: 100%;
      border-top-color: #525252;
    }
  `,
  right: () => css`
    left: calc(100% + 3rem);
    top: 50%;
    transform: translateX(0) translateY(-50%);
    &:before {
      left: calc(0.6rem * -1);
      top: 50%;
      transform: translateX(0) translateY(-50%);
      border-right-color: #525252;
    }
  `,
  bottom: () => css`
    bottom: calc(3rem * -1);
    &:before {
      bottom: 100%;
      border-bottom-color: #525252;
    }
  `,
  left: () => css`
    left: auto;
    right: calc(100% + 3rem);
    top: 50%;
    transform: translateX(0) translateY(-50%);
    &:before {
      left: auto;
      right: calc(0.6rem * -2);
      top: 50%;
      transform: translateX(0) translateY(-50%);
      border-left-color: #525252;
    }
  `,
};
interface TooltipProps {
  direction: 'top' | 'right' | 'bottom' | 'left';
}
export const Tooltip = styled.div<TooltipProps>`
  ${({ direction }) => css`
    position: absolute;
    border-radius: 0.4rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.6rem;
    color: white;
    background: #525252;
    font-size: 12px;
    font-family: sans-serif;
    line-height: 12px;
    z-index: 100;
    white-space: nowrap;
    &:before {
      content: ' ';
      left: 50%;
      border: solid transparent;
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-width: 6px;
      margin-left: calc(6px * -1);
    }
    ${!!direction && TooltipModifiers[direction]};
  `}
`;
