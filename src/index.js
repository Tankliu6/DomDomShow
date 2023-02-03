import { BrowserRouter } from "react-router-dom";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ResetStyle from "./global/style/resetStyle";
import GlobalStyle from "./global/style/sharedStyle";
console.log("Hello Builds");

const rootNode = document.querySelector(".root");
const root = createRoot(rootNode);

root.render(
    <React.StrictMode>
    <BrowserRouter>
        <ResetStyle />
        <GlobalStyle />
        <App />
    </BrowserRouter>
    </React.StrictMode>
);
