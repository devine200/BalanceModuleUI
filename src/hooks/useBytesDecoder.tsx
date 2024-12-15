import { AbiCoder, AddressLike, BytesLike } from "ethers";
import contractConfig from "../utils/test-config.json";

interface BytesDecoderVals {
  getVaultAddressFromModuleId: (moduleId: BytesLike) => AddressLike;
  getVaultAddressFromFuncId: (funcId: BytesLike) => AddressLike;
  getVaultChainId: (vaultAddr: AddressLike) => Number;
}

const useBytesDecoder = (): BytesDecoderVals => {
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

  const getVaultChainId = (vaultAddr: AddressLike):Number => {
    return Object.values(contractConfig.tradableSideVault.vault).filter((vault) => vault.tradableSideVault === vaultAddr)[0].networkId;
  };
  return { getVaultAddressFromModuleId, getVaultAddressFromFuncId, getVaultChainId };
};

export default useBytesDecoder;
