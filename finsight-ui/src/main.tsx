import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { store } from "./state/store.ts";


createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
