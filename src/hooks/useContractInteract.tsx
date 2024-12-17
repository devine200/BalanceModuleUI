import contractConfig from "../utils/test-config.json";
import {
  Contract,
  formatUnits,
  BytesLike,
  AddressLike,
  toBigInt,
  parseUnits,
  Addressable,
} from "ethers";
import {
  useSwitchChain,
  useChainId,
  useAccount,
  useWriteContract,
} from "wagmi";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useEthersProvider } from "./useEthersSigner";
import { config } from "../wagmi";
import useDeserializer from "./useDeserializer";

interface ContractInteractionVals {
  balance: number;
  getBalance: () => Promise<void>;
  depositIntoTradable: (
    vaultAddr: AddressLike,
    token: AddressLike,
    amount: number
  ) => void;
  withdrawFromTradable: (token: AddressLike, amount: number) => void;
  initiateProtocolTransaction: (
    funcId: BytesLike,
    token: AddressLike,
    amount: number
  ) => void;
  transactionConfirmation: (
    vaultAddr: AddressLike,
    receiptId: BytesLike,
    payload: BytesLike
  ) => Promise<void>;
  transactionRejection: (
    vaultAddr: AddressLike,
    receiptId: BytesLike
  ) => Promise<void>;
  DEFAULT_TOKEN_DECIMALS: number;
  getTokenBalance: (tokenAddr: AddressLike) => Promise<Number>;
}

// TODO:Make sure that all chain data is being pulled from the correct chains
const useContractInteract = (): ContractInteractionVals => {
  const chainId = useChainId();
  const { address } = useAccount();
  const [balance, setBalance] = useState<number>(0);
  const { chains, switchChain } = useSwitchChain();
  const provider = useEthersProvider({ chainId });
  const { writeContractAsync } = useWriteContract({ config });
  const { getVaultChainId } = useDeserializer();

  const DEFAULT_TOKEN_DECIMALS = 8;

  const baseChainID = import.meta.env.VITE_BASE_CHAIN_NETWORK_ID!;

  // ensure that this function gets the user's balance from the base chain always
  const balanceVaultReadContract = useMemo(
    () =>
      new Contract(
        contractConfig.tradableBalanceVault.address,
        contractConfig.tradableBalanceVault.abi,
        provider
      ),
    [provider]
  );

  const getBalance = useCallback(async () => {
    const userBalance =
      await balanceVaultReadContract.getUserTokenBalance(address);
    setBalance(parseFloat(formatUnits(userBalance, DEFAULT_TOKEN_DECIMALS)));
  }, [provider]);

  useEffect(() => {
    if (!provider) return;
    getBalance();
  }, [provider]);

  const initiateProtocolTransaction = async (
    funcId: BytesLike,
    token: AddressLike,
    amount: number
  ) => {
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

    const tokenContract = new Contract(
      // @ts-ignore
      token,
      contractConfig.tradableSideVault.stableToken.abi,
      provider
    );
    const tokenDecimals = await tokenContract.decimals();

    await writeContractAsync({
      abi: contractConfig.tradableBalanceVault.abi,
      // @ts-ignore
      address: contractConfig.tradableBalanceVault.address,
      functionName: "balanceDeductionApproval",
      args: [
        funcId,
        token,
        parseUnits(amount.toString(), tokenDecimals),
        nonce,
      ],
      chainId,
    });
  };

  const depositIntoTradable = async (
    vaultAddr: AddressLike,
    token: AddressLike | any,
    amount: number
  ) => {
    // switch to module network
    try {
      const depositChain = getVaultChainId(vaultAddr);
      // @ts-ignore
      switchChain({ chainId: depositChain });
    } catch (e) {
      throw Error("Vault Does Not Exist");
    }

    // get token decimals for amount calculation
    const tokenContract = new Contract(
      // @ts-ignore
      token,
      contractConfig.tradableSideVault.stableToken.abi,
      provider
    );

    // TODO:check if the chainId changes for the ethSigner instance.
    // console.log(await ethSigner?.signer.getChainId());

    const tokenDecimals = await tokenContract.decimals();
    const amountToDecimals = parseUnits(amount.toString(), tokenDecimals);

    // approve token to be allocated
    await writeContractAsync({
      abi: contractConfig.tradableSideVault.stableToken.abi,
      // @ts-ignore
      address: token,
      functionName: "approve",
      args: [, amountToDecimals],
      chainId,
    });

    // trigger function to deposit into tradable
    await writeContractAsync({
      abi: contractConfig.tradableSideVault.abi,
      // @ts-ignore
      address: vaultAddr,
      functionName: "marginAccountDeposit",
      args: [token, amountToDecimals],
      chainId,
    });
  };

  const withdrawFromTradable = async (
    token: AddressLike | any,
    amount: number
  ) => {
    // get token decimals for amount calculation
    const tokenContract = new Contract(
      // @ts-ignore
      token,
      contractConfig.tradableSideVault.stableToken.abi,
      provider
    );
    const tokenDecimals = await tokenContract.decimals();
    const amountToDecimals = parseUnits(amount.toString(), tokenDecimals);

    // check if user has the balance to withdraw
    if (balance < amount) {
      throw Error("insufficient balance");
    }

    // make withdrawal request
    await writeContractAsync({
      abi: contractConfig.tradableSideVault.abi,
      // @ts-ignore
      address: vaultAddr,
      functionName: "withdrawalRequest",
      args: [token, amountToDecimals],
      chainId,
    });

    return true;
  };

  const transactionConfirmation = async (
    vaultAddr: AddressLike,
    receiptId: BytesLike,
    payload: BytesLike
  ) => {
    await writeContractAsync({
      abi: contractConfig.tradableSideVault.abi,
      // @ts-ignore
      address: vaultAddr,
      functionName: "executeReceiptFunction",
      args: [receiptId, payload],
      chainId,
    });
  };

  const transactionRejection = async (
    vaultAddr: AddressLike,
    receiptId: BytesLike
  ) => {
    await writeContractAsync({
      abi: contractConfig.tradableSideVault.abi,
      // @ts-ignore
      address: vaultAddr,
      functionName: "cancelBalanceApproval",
      args: [receiptId],
      chainId,
    });
  };

  const getTokenBalance = async (tokenAddr: AddressLike): Promise<Number> => {
      console.log({provider});
    const tokenContract = new Contract(
      tokenAddr as Addressable,
      contractConfig.tradableSideVault.stableToken.abi,
      provider
    );
    const decimals = tokenContract;
    // const userBalance = await tokenContract.balanceOf(address);

    console.log({decimals})
    return 0;
    // return parseFloat(
    //   parseFloat(formatUnits(userBalance, decimals)).toFixed(2)
    // );
  };

  return {
    balance,
    getBalance,
    getTokenBalance,
    depositIntoTradable,
    withdrawFromTradable,
    transactionConfirmation,
    transactionRejection,
    initiateProtocolTransaction,
    DEFAULT_TOKEN_DECIMALS,
  };
};

export default useContractInteract;
