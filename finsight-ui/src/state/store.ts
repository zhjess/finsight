import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/state/api";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefault) => getDefault().concat(api.middleware)
  })

  setupListeners(store.dispatch);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;