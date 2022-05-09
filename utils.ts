export const shortenWalletAddress = (address: string) => {
  if (!address) return "";

  if (address.length < 12) {
    return address;
  }

  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};
