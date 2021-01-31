import React from "react";
import { NavBar } from "./navbar";

export function Layout({ children }) {
  return (
    <>
      <NavBar />
      <div className="container">{children}</div>
    </>
  );
}
