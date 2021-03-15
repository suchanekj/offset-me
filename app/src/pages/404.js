import React from "react";
import { Link } from "gatsby";
import { Layout } from "../components";

export default function NotFound() {
  return (
    <Layout>
      <div className="box">
        <h1> Page not found</h1>
        <p>
          Sorry
          <span role="img" aria-label="Pensive emoji">
            😔
          </span>
          we couldn’t find what you were looking for.
          <br />
          <Link to="/">Go to the homepage</Link>.
        </p>
      </div>
    </Layout>
  );
}
