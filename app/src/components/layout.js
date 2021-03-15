import React from "react";
import { NavBar } from "./navbar";
import { Footer } from "./footer";

export function Layout({ children }) {
  return (
    <div style={{ height: "100vh" }} class="is-flex is-flex-direction-column">
      <NavBar />
      <div class="section is-flex-grow-1">
        <div className="container is-max-desktop">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
