import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { TradableConfig } from "./types.ts";
import Click from "./Click.tsx";

// TODO: add function id and website name config in sdk configuratikon
const queryClient = new QueryClient();

const TradableSDKProvider = ({moduleId, initialModal, app_name}:TradableConfig) => {
	const moduleConfig = {
		moduleId,
		initialModal, 
		website: app_name,
	}

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<App {...moduleConfig}>
					<Click />
				</App>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

export default TradableSDKProvider;
