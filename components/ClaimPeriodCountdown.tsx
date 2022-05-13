import React from 'react';
import Countdown from 'react-countdown';

export interface ClaimPeriodCountdownProps {
  claimPeriodStart: number;
  claimPeriodEnd: number;
}

interface RendererProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const ClaimPeriodCountdown = ({ claimPeriodStart, claimPeriodEnd }: ClaimPeriodCountdownProps) => {
  const ClaimPeriodEnded = () => <span>Claim Period has ended</span>;

  const buildRenderer =
    (beforeStart: boolean) =>
    // eslint-disable-next-line react/display-name
    ({ days, hours, minutes, seconds, completed }: RendererProps) => {
      if (completed) {
        if (beforeStart) {
          return <span>Claim Period has started</span>;
        }

        return <ClaimPeriodEnded />;
      }

      const numberText = (number: number, singular: string, plural: string = singular + 's') =>
        number > 0 ? number + ' ' + (number === 1 ? singular : plural) : '';

      const daysText = numberText(days, 'day');
      const hoursText = numberText(hours, 'hour');
      const minutesText = numberText(minutes, 'minute');
      const secondsText = numberText(seconds, 'second');

      const allText = [daysText, hoursText, minutesText, secondsText].filter((text) => text).join(', ');

      return <span className="remaining-time">{allText}</span>;
    };

  if (claimPeriodStart > Date.now()) {
    return (
      <span>
        Claim Period starts in <Countdown date={claimPeriodStart} renderer={buildRenderer(true)} />
      </span>
    );
  }

  if (claimPeriodEnd > Date.now()) {
    return (
      <span>
        Claim Period ends in <Countdown date={claimPeriodEnd} renderer={buildRenderer(false)} />
      </span>
    );
  }

  return <ClaimPeriodEnded />;
};
export default ClaimPeriodCountdown;
