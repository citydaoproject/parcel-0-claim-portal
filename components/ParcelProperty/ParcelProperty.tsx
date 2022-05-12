import { FC } from 'react';
import { Tooltip } from '../Tooltip';

export type ParcelPropertyProps = {
  name: string;
  value: string;
  tooltip: string;
  iconPath: string;
};
export const ParcelProperty: FC<ParcelPropertyProps> = ({ name, value, tooltip, iconPath }) => (
  <div className="property">
    <div className="leftSide">
      <div className="propName">
        {tooltip && (
          <Tooltip content={tooltip} direction="top">
            {name} <img src="/icons/info.png" alt="" />
          </Tooltip>
        )}{' '}
        {!tooltip && name}
      </div>
      <div className="propVal">{value}</div>
    </div>
    <img src={iconPath} alt="" />
  </div>
);
