import React, { useState } from "react";
import { Link } from "gatsby";

export function NavBar() {
  const [isActive, setIsActive] = useState(false);

  return (
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <Link to="/" className="navbar-item">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            alt="logo"
            width="112"
            height="28"
          />
        </Link>
        <a
          role="button"
          class={`navbar-burger ${isActive && "is-active"}`}
          aria-label="menu"
          aria-expanded={isActive ? "false" : "true"}
          onClick={() => setIsActive((isActive) => !isActive)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class={`navbar-menu ${isActive && "is-active"}`}>
        <div class="navbar-start">
          <Link to="/about" className="navbar-item">
            About
          </Link>
          <Link to="/news" className="navbar-item">
            News
          </Link>
        </div>
      </div>
    </nav>
  );
}
