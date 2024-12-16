import { AddressLike } from "ethers";
import useDeserializer from "./useDeserializer";

interface AssetsArgs {
    vaultAddr: AddressLike;
}

const useGetAssets = ({vaultAddr}:AssetsArgs) => {
    const { getVaultConfig } = useDeserializer();
    const vaultConfig = getVaultConfig(vaultAddr);
    return {d}
} 

export default useGetAssets;