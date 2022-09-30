declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      NODE_ENV: string;
      ORIGIN_WEBSITE: string;
      SECRET: string;
    }
  }
}

export {}
