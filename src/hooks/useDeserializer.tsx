import { AbiCoder, AddressLike, BytesLike } from "ethers";
import contractConfig from "../utils/test-config.json" with { type: "json" };

interface DeserializerVals {
	getVaultAddressFromModuleId: (moduleId: BytesLike) => AddressLike;
	getVaultChainId: (vaultAddr: AddressLike) => Number;
	getVaultConfig: (vaultAddr: AddressLike) => any;
	deconstructReceiptId: (receiptId: BytesLike) => any;
	constructReceiptId: (
		funcId: BytesLike,
		userAddr: AddressLike,
		tokenAddr: AddressLike,
		amount: BigInt,
		nonce: BigInt,
	) => BytesLike;
}

export interface DestructuredReceiptId {
	funcId: BytesLike;
	userAddr: AddressLike;
	tokenAddr: AddressLike;
	amount: BigInt;
	nonce: BigInt;
	payload: BytesLike;
}

const useDeserializer = (): DeserializerVals => {
	const abiCoder: AbiCoder = AbiCoder.defaultAbiCoder();

	const getVaultAddressFromModuleId = (moduleId: BytesLike): AddressLike => {
		const [, vaultAddr] = abiCoder.decode(["address", "address"], moduleId);
		return vaultAddr;
	};

	const getVaultConfig = (vaultAddr: AddressLike): any => {
		const vaultConfigFilter = Object.values(contractConfig.tradableSideVault.vault).filter(
			(vault) => vault.tradableSideVault === vaultAddr,
		);
		
		if(vaultConfigFilter.length == 0) {
			throw new Error("Invalid Vault Address (check sdk configuration)")
		}

		return Object.values(contractConfig.tradableSideVault.vault).filter(
			(vault) => vault.tradableSideVault === vaultAddr,
		)[0];
	};

	const getVaultChainId = (vaultAddr: AddressLike): Number => {
		return getVaultConfig(vaultAddr).networkId;
	};

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

	const deconstructReceiptId = (receiptId:BytesLike):DestructuredReceiptId => {
		const [funcId, userAddr, tokenAddr, amount, nonce] = abiCoder.decode(
			["bytes", "address", "address", "uint256", "uint256"],
			receiptId,
		);

		return {
			funcId,
			userAddr,
			tokenAddr,
			amount,
			nonce,
			payload: "0x0000000000000000000000000000000000000000000000000000000000000000"
		};
	}


	return {
		getVaultAddressFromModuleId,
		getVaultChainId,
		getVaultConfig,
		deconstructReceiptId,
		constructReceiptId,
	};
};

export default useDeserializer;
