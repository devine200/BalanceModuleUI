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
  
const useGetAssets = ():ChainData[] => {
  return [
    {
      name: "bsc",
      logo: binanceLogo,
      chainId: 97,
      tokens: [
        {
          name: "USDC",
          address: "0x596310929f05D3cF15a2220decFE8Acf47f59b8A",
          logo: usdcLogo,
        },
        {
          name: "USDT",
          address: "0xeD9AEba46507fc92b89527B4E68d4D90ce337B82",
          logo: usdtLogo,
        },
        {
          name: "DAI",
          address: "0xa758FDF01D8Ebd20bE6D07dAd2F1aaf02cD5d82c",
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
          address: "0x85b97CB8828E237605Bc19Fc0fa622c6d8D6815B",
          logo: usdcLogo,
        },
        {
          name: "USDT",
          address: "0x4648A8719b53b365cCfa12C22BF5F9DEaE52272b",
          logo: usdtLogo,
        },
        {
          name: "DAI",
          address: "0x17E48D49475574AE927E47dCFC2D1747B75FFfDc",
          logo: daiLogo,
        },
      ],
    },
  ];
};

export default useGetAssets;
