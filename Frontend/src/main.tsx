import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import {RootStoreContext} from "./root-store-context.ts";
import RootStore from "./stores/root-store.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RootStoreContext.Provider value={new RootStore()}>
         <App/>
      </RootStoreContext.Provider>
  </React.StrictMode>,
)
