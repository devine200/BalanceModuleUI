import contractConfig from "../utils/test-config.json";
import {
  Contract,
  formatUnits,
  BytesLike,
  AddressLike,
  toBigInt,
  parseUnits,
} from "ethers";
import { useSwitchChain, useChainId, useAccount, useWriteContract, useConnect } from "wagmi";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useEthersSigner } from "./useEthersSigner";
import { config } from "../wagmi";
import { injected } from "wagmi/connectors";
import { avalancheFuji, sepolia } from "wagmi/chains";

interface ContractInteractionVals {
  balance: number;
  initiateDepositFromTradable: (
    funcId: BytesLike,
    token: AddressLike,
    amount: number
  ) => void;
  DEFAULT_TOKEN_DECIMALS: number;
}

const useContractInteract = (): ContractInteractionVals => {
  const chainId = useChainId();
  const { address } = useAccount();
  const [balance, setBalance] = useState<number>(0);
  const { chains, switchChain } = useSwitchChain();
  const ethSigner = useEthersSigner({ chainId });
  const {connectAsync} = useConnect()
  const { writeContractAsync } = useWriteContract({config});

  const DEFAULT_TOKEN_DECIMALS = 8;

  const baseChainID = import.meta.env.VITE_BASE_CHAIN_NETWORK_ID!;
  const balanceVaultReadContract = useMemo(
    () =>
      new Contract(
        contractConfig.tradableBalanceVault.address,
        contractConfig.tradableBalanceVault.abi,
        ethSigner?.provider
      ),
    [ethSigner?.provider]
  );

  const getBalance = useCallback(async () => {
    const userBalance = await balanceVaultReadContract.getUserTokenBalance(address);
    setBalance(parseFloat(formatUnits(userBalance, DEFAULT_TOKEN_DECIMALS)));
  }, [ethSigner]);

  useEffect(() => {
    if(!ethSigner) return;
    getBalance();
  }, [ethSigner]);

  const initiateDepositFromTradable = async (
    funcId: BytesLike,
    token: AddressLike,
    amount: number
  ) => {
    // await connectAsync({ chainId: avalancheFuji.id, connector: injected()})
    // check what  chain system is connected to
    if (chainId && baseChainID !== chainId.toString()) {
      const baseChain = chains.filter(
        (chain) => chain.id.toString() === baseChainID
      )[0];
      switchChain({ chainId: baseChain.id });
    }

    // start balance dedcution approval process
    const salt = Math.floor(Math.random() * 100000000);
    const nonce = toBigInt(Date.now() + salt);

    const tokenContract = new Contract(token, contractConfig.tradableSideVault.stableToken.abi, ethSigner?.provider)
    const tokenDecimals = await tokenContract.decimals();

    await writeContractAsync({
      abi: contractConfig.tradableBalanceVault.abi,
      address: contractConfig.tradableBalanceVault.address,
      functionName: "balanceDeductionApproval",
      args: [funcId, token, parseUnits(amount.toString(), tokenDecimals), nonce],
      chainId
    });
    console.log("completed")
  };
  return { balance, initiateDepositFromTradable, DEFAULT_TOKEN_DECIMALS };
};

export default useContractInteract;
