import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import ResetStyle from "./global/style/resetStyle";
import GlobalStyle from "./global/style/sharedStyle";
import App from "./App";

const rootNode = document.querySelector(".root");
const root = createRoot(rootNode);

root.render(
    <BrowserRouter>
        <ResetStyle />
        <GlobalStyle />
        <App />
    </BrowserRouter>
);
