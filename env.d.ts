declare namespace NodeJS {
  interface ProcessEnv {
    TARGET: string
    ETHEREUM_JSON_RPC_PROVIDER: string
    OPTIMISTIC_ETHEREUM_JSON_RPC_PROVIDER: string
    USER_PRIVATE_KEY: string
    NODE_ENV: 'development' | 'production'
  }
}