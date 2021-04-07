import React, { useState } from "react";
import { Link } from "gatsby";

export function NavBar() {
  const [isActive, setIsActive] = useState(false);

  return (
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand is-align-items-center mx-2">
        <Link to="/" className="button is-primary">
          <span class="icon">
            <i class="fa fa-donate"></i>
          </span>
          <span>Offset me!</span>
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
          <Link to="/" className="navbar-item">
            Donate
          </Link>
          <Link to="/stats" className="navbar-item">
            Stats
          </Link>
          <Link to="/news" className="navbar-item">
            News
          </Link>
          <Link to="/about" className="navbar-item">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
