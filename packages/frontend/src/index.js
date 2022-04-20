import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider
        emotionOptions={{ key: "mantine", prepend: false }}
        withCSSVariables
        theme={{
          colors: {
            ice: [
              "#DDEEF8",
              "#C5E0F5",
              "#9EBFE0",
              "#5C83A0",
              "#04AED9",
              "#0478A1",
              "#003853",
              "#041F32",
              "#768EAA",
              "#768EAA",
            ],
          },
        }}
        styles={{
          Button: (theme) => ({
            filled: {
              // subscribe to component params
              color: "white",
              background: theme.colors.ice[6],
              "&:hover": {
                backgroundColor: theme.colors.ice[6],
              },
            },
          }),
        }}
      >
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
