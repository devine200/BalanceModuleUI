import { AbiCoder, AddressLike, BytesLike } from "ethers";
import contractConfig from "../utils/test-config.json";

interface DeserializerVals {
	getVaultAddressFromModuleId: (moduleId: BytesLike) => AddressLike;
	getVaultAddressFromFuncId: (funcId: BytesLike) => AddressLike;
	getVaultChainId: (vaultAddr: AddressLike) => Number;
	getVaultConfig: (vaultAddr: AddressLike) => any;
	// destructureReceiptId: (receiptId: BytesLike) => any;
	constructReceiptId: (
		funcId: BytesLike,
		userAddr: AddressLike,
		tokenAddr: AddressLike,
		amount: BigInt,
		nonce: BigInt,
	) => BytesLike;
}

const useDeserializer = (): DeserializerVals => {
	const abiCoder: AbiCoder = AbiCoder.defaultAbiCoder();

	const getVaultAddressFromModuleId = (moduleId: BytesLike): AddressLike => {
		const [, vaultAddr] = abiCoder.decode(["address", "address"], moduleId);
		return vaultAddr;
	};

	//TODO:depricate this function
	const getVaultAddressFromFuncId = (funcId: BytesLike): AddressLike => {
		const [moduleId] = abiCoder.decode(["bytes", "bytes"], funcId);
		const [, vaultAddr] = abiCoder.decode(["address", "address"], moduleId);
		return vaultAddr;
	};

	const getVaultConfig = (vaultAddr: AddressLike): any => {
		return Object.values(contractConfig.tradableSideVault.vault).filter(
			(vault) => vault.tradableSideVault === vaultAddr,
		)[0];
	};

	const getVaultChainId = (vaultAddr: AddressLike): Number => {
		return getVaultConfig(vaultAddr).networkId;
	};

	// const destructureReceiptId = (receiptId: BytesLike) => {
	//   const [funcId, userAddr, tokenAddr, amount, nonce] = abiCoder.decode(
	//     ["bytes", "address", "address", "uint256", "uint256"],
	//     receiptId
	//   );
	//   return { funcId, userAddr, tokenAddr, amount, nonce };
	// };

	const constructReceiptId = (
		funcId: BytesLike,
		userAddr: AddressLike,
		tokenAddr: AddressLike,
		amount: BigInt,
		nonce: BigInt,
	): BytesLike => {
		return abiCoder.encode(
			["bytes", "address", "address", "uint256", "uint256"],
			[funcId, userAddr, tokenAddr, amount, nonce],
		);
	};

	return {
		getVaultAddressFromModuleId,
		getVaultAddressFromFuncId,
		getVaultChainId,
		getVaultConfig,
		// destructureReceiptId,
		constructReceiptId,
	};
};

export default useDeserializer;
