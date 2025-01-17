import { useEffect, useState } from "react";
import {
	useAccount,
	useChainId,
	useReadContracts,
	useSwitchChain,
} from "wagmi";
import ContractConfig from "../utils/test-config.json";
import { AddressLike, BigNumberish, formatUnits } from "ethers";
import { config } from "../wagmi";

interface GetTokenBalanceProps {
	tokenAddr: AddressLike;
	selectedChainId: Number;
}

const useGetTokenBalance = ({
	tokenAddr,
	selectedChainId,
}: GetTokenBalanceProps): Number => {
	const { address } = useAccount();
	// @ts-ignore
	const { switchChain } = useSwitchChain(config);
	const chainId = useChainId();
	const [isSwitched, setIsSwitched] = useState<Boolean>(false);
    const [balance, setBalance] = useState<BigNumberish>(0);
    const [decimals, setDecimals] = useState<BigNumberish>(0);

	if (chainId !== selectedChainId && !isSwitched) {
		//@ts-ignore
		switchChain({ chainId: selectedChainId });
		setIsSwitched(true);
	}

	const { data, isPending, error } = useReadContracts({
		contracts: [
			{
				//@ts-ignore
				address: tokenAddr,
				abi: ContractConfig.tradableSideVault.stableToken.abi,
				functionName: "balanceOf",
				args: [address],
				//@ts-ignore
				chainId: selectedChainId,
			},
			{
				//@ts-ignore
				address: tokenAddr,
				abi: ContractConfig.tradableSideVault.stableToken.abi,
				functionName: "decimals",
				args: [],
				//@ts-ignore
				chainId: selectedChainId,
			},
		],
	});
    
	useEffect(() => {
        if(isPending && !data) return;
        //@ts-ignore
        const [balance, decimals] = data;
        setBalance(balance.result);
        setDecimals(decimals.result);
		// refetch();
	}, [isPending]);

    useEffect(()=> {
        if(!error) return;
        console.log(error)
    }, [error])

	return parseFloat(parseFloat(formatUnits(balance, decimals)).toFixed(2));
};

export default useGetTokenBalance;
