declare namespace NodeJS {
  interface ProcessEnv {
    TARGET: string
    L1_WEB3_URL: string
    L2_WEB3_URL: string
    USER_PRIVATE_KEY: string
    NODE_ENV: 'development' | 'production'
  }
}