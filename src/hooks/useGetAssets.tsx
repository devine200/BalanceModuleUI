import { AddressLike } from "ethers";
import avalancheSquare from "../images/avalanche-square.svg";
import daiLogo from "../images/dai-logo.png";
import usdcLogo from "../images/USDC_logo.png";
import binanceLogo from "../images/Bianance_logo.png";
import usdtLogo from "../images/USDT_logo.png";

export interface ChainData {
  name: string;
  logo: string;
  chainId: number;
  tokens: TokenData[];
}


export interface TokenData {
    name: string;
    address: AddressLike;
    logo: string;
  }
  
export const getTokenConfig = (chainData:ChainData[], address:AddressLike):TokenData => {
  // loop through chain data
  // if it exists return the token data object
  // else throw error that token is unsupported
  
  for (const chain of chainData) {
    for (const token of chain.tokens) {
      if (token.address === address) {
        return token;
      }
    }
  }
  throw new Error('Token not supported');
}

const useGetAssets = ():ChainData[] => {
  return [
    {
      name: "bsc",
      logo: binanceLogo,
      chainId: 97,
      tokens: [
        {
          name: "USDC",
          address: "0xcBa8Ef489334A965c5c424F896A4aCAd39d262EC",
          logo: usdcLogo,
        },
        {
          name: "USDT",
          address: "0xd64F9e0b3111590B5d5c93FC0C0caa050223b489",
          logo: usdtLogo,
        },
        {
          name: "DAI",
          address: "0x52a2C23d7f85A7d3777e49f8C9d85A7D187574c4",
          logo: daiLogo,
        },
      ],
    },
    {
      name: "avalanche",
      logo: avalancheSquare,
      chainId: 43113,
      tokens: [
        {
          name: "USDC",
          address: "0x75246a2DC8234D54E439CA309905a95cbf93193E",
          logo: usdcLogo,
        },
        {
          name: "USDT",
          address: "0x7E1c8E07085faB0311Fc8df9448Bc054E67fFbC6",
          logo: usdtLogo,
        },
        {
          name: "DAI",
          address: "0xB28eE801f8105a0e0D064D16897080Aa0cBF3ad2",
          logo: daiLogo,
        },
      ],
    },
  ];
};

export default useGetAssets;
