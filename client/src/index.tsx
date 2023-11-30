import React from "react";
import ReactDOM from "react-dom/client";
import AllRoutes from "./AllRoutes.tsx";
import "../src/assets/styles/global/public.scss";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <AllRoutes />
  </React.StrictMode>
);

