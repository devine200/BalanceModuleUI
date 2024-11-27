/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_WC_PROJECT_ID: string;
  readonly VITE_BASE_CHAIN_NETWORK_ID: string;
  // add more variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
