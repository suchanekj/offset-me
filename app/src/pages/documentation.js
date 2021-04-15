import React from "react";
import { Layout } from "../components";

export default function Documentation() {
  return (
    <Layout>
      <div className="box">
        {/*<h1>A place to show statistics about donations.</h1>*/}
        <script src="https://offset-me.suchanek.io/docs/resize.js" type="text/javascript" />
        <iframe width="100%" height="11000px" src="https://offset-me.suchanek.io/docs" title="W3Schools Free Online Web Tutorials" onload="resizeIframe(this)"></iframe>
      </div>
    </Layout>
  );
}
