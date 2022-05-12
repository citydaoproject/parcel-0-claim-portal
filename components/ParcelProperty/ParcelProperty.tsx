import { FC } from 'react';

export type ParcelPropertyProps = {
  name: string;
  value: string;
  tooltip?: string;
  iconPath: string;
};
export const ParcelProperty: FC<ParcelPropertyProps> = ({ name, value, tooltip, iconPath }) => (
  <div className="property">
    <div className="leftSide">
      <div className="propName">
        {tooltip && (
          <div data-multiline={true} data-tip={tooltip}>
            {name} <img src="/icons/info.png" alt="" />
          </div>
        )}{' '}
        {!tooltip && name}
      </div>
      <div className="propVal">{value}</div>
    </div>
    <img src={iconPath} alt="" />
  </div>
);
