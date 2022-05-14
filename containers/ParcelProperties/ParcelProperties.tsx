import { FC } from 'react';
import { ParcelProperty, ParcelPropertyProps } from '../../components/ParcelProperty';
import { AGREEMENT_IPFS_URL } from '../../constants/other';

export const ParcelProperties: FC<{
  parcelProperties: ParcelPropertyProps[];
}> = ({ parcelProperties }) => (
  <div className="properties">
    {parcelProperties.map(({ name, value, tooltip, iconPath }, index) => (
      <ParcelProperty name={name} key={index} value={value} tooltip={tooltip} iconPath={iconPath} />
    ))}
    <div className="link-external-wrapper">
      <a href={AGREEMENT_IPFS_URL} target="_blank" className="link-external" rel="noreferrer">
        VIEW FULL LICENSE
      </a>
    </div>
  </div>
);
