import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import store from "./store";
import { LocalizationProvider } from "./common/components/LocalizationProvider";
import ErrorHandler from "./common/components/ErrorHandler";
import Navigation from "./Navigation";
import preloadImages from "./map/core/preloadImages";
import NativeInterface from "./common/components/NativeInterface";
import ServerProvider from "./ServerProvider";
import ErrorBoundary from "./ErrorBoundary";
import AppThemeProvider from "./AppThemeProvider";
import ThemeCustomization from "./themes";

preloadImages();
{
  /* <StrictMode> */
}

const root = createRoot(document.getElementById("root"));
root.render(
  // <StrictMode>
  <ErrorBoundary>
    <ReduxProvider store={store}>
      <LocalizationProvider>
        <StyledEngineProvider injectFirst>
          <ThemeCustomization>
            <CssBaseline />
            <ServerProvider>
              <BrowserRouter>
                <Navigation />
              </BrowserRouter>
              <ErrorHandler />
              <NativeInterface />
            </ServerProvider>
          </ThemeCustomization>
        </StyledEngineProvider>
      </LocalizationProvider>
    </ReduxProvider>
  </ErrorBoundary>
  // </StrictMode>
);
