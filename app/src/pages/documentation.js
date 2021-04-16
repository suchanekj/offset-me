import React from "react";
import { Layout } from "../components";

export default function Documentation() {
  return (
    <Layout>
      <div className="box">
        {/*<script src="../docs/resize.js" type="text/javascript" />*/}
        <iframe width="100%" height="12000px" src="https://offset-me.suchanek.io/docs"></iframe>
      </div>
    </Layout>
  );
}
