declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      NODE_ENV: string;
      CORS_ORIGIN: string;
      SECRET: string;
    }
  }
}

export {}
