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
          address: "0x85C9bF6837446c79514863656ca19C253Acd5b34",
          logo: usdcLogo,
        },
        {
          name: "USDT",
          address: "0x9d685223615727f29b38aE9728365a2585228597",
          logo: usdtLogo,
        },
        {
          name: "DAI",
          address: "0x587090034d73D3701F164BbE83ddc8fA2633a50F",
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
          address: "0xAE60a000f4094204e0f9B56d1f71E1d7381cA50F",
          logo: usdcLogo,
        },
        {
          name: "USDT",
          address: "0x027Ba418AF13412fE660F6c2EC42382a0ffaC5B7",
          logo: usdtLogo,
        },
        {
          name: "DAI",
          address: "0x410104df99c7c66C691e83EEDA581768C20debBd",
          logo: daiLogo,
        },
      ],
    },
  ];
};

export default useGetAssets;
