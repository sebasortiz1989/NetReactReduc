import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/layout/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {RouterProvider} from "react-router-dom";
import {router} from "./app/routes/Routes.tsx";
import {Provider} from "react-redux";
import {configureTheStore} from "./app/store/store.ts";

// Debugging on Android Tablet ----------------------
if (import.meta.env.DEV) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
        import('eruda').then((eruda) => {
            eruda.default.init();
        });
    }
}
// -------------------------------------

const store = configureTheStore();
console.log(store.getState());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <RouterProvider router={router} />
      </Provider>
  </StrictMode>,
)
