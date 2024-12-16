import { AbiCoder, AddressLike, BytesLike } from "ethers";
import contractConfig from "../utils/test-config.json";

interface DeserializerVals {
  getVaultAddressFromModuleId: (moduleId: BytesLike) => AddressLike;
  getVaultAddressFromFuncId: (funcId: BytesLike) => AddressLike;
  getVaultChainId: (vaultAddr: AddressLike) => Number;
  getVaultConfig: (vaultAddr: AddressLike) => any;
}

const useDeserializer = (): DeserializerVals => {
  const getVaultAddressFromModuleId = (moduleId: BytesLike): AddressLike => {
    const abiCoder: AbiCoder = AbiCoder.defaultAbiCoder();
    const [, vaultAddr] = abiCoder.decode(["address", "address"], moduleId);
    return vaultAddr;
  };

  const getVaultAddressFromFuncId = (funcId: BytesLike): AddressLike => {
    const abiCoder: AbiCoder = AbiCoder.defaultAbiCoder();
    const [moduleId] = abiCoder.decode(["bytes", "bytes"], funcId);
    const [, vaultAddr] = abiCoder.decode(["address", "address"], moduleId);
    return vaultAddr;
  };

  const getVaultConfig = (vaultAddr: AddressLike): any => {
    return Object.values(contractConfig.tradableSideVault.vault).filter(
      (vault) => vault.tradableSideVault === vaultAddr
    )[0];
  };

  const getVaultChainId = (vaultAddr: AddressLike): Number => {
    return getVaultConfig(vaultAddr).networkId;
  };

  return {
    getVaultAddressFromModuleId,
    getVaultAddressFromFuncId,
    getVaultChainId,
    getVaultConfig,
  };
};

export default useDeserializer;
