/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PUBLIC_URL: string
    REACT_APP_API_URL?: string
    REACT_APP_WEBSOCKET_URL?: string
  }
}

interface Window {
  gtag?: (
    command: 'config' | 'set' | 'event',
    targetId: string,
    config?: object
  ) => void
}