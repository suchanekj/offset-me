import React from "react";
import {Layout} from "../components";

export default function News() {
  return (
    <Layout>
      <div className="box">
        <h1 class="title is-2">News</h1>
      </div>
      <div className="box">
        <h2 class="title is-3">Subscribe</h2>
        <form action="https://formspree.io/f/mdoykklb" method="POST">
          <label class="label">
            Email
            <input class="input" type="email" name="email" placeholder="example@gmail.com"/>
          </label>
          <button class="button is-link" type="submit">Send</button>
        </form>
      </div>
      <div className="box">
        <h2 class="title is-3">Launch</h2>
        <div className="content">

          <i>16/04/2021</i>

          <p>We are launching an initial site to allow us to find first users, gather feedback and learn how to take
            this to the next level. If you are not interested in using our services at the current stage but might
            in the future we would appreciate if you could give us <a href="/contact">feedback</a> and considered
            subscribing (above) to be notified when we add your requested features.</p>
        </div>
      </div>
    </Layout>
  );
}
