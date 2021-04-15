import React from "react";
import { Layout } from "../components";

export default function Contact() {
  return (
    <Layout>
      <div className="box">
        <h1 class="title is-2">Submit feedback</h1>
        <form action="https://formspree.io/f/mayanndk" method="POST">
          <label class="label">
            Email (optional)
            <input class="input" type="email" name="_replyto" placeholder="example@gmail.com" />
          </label>
          <label class="label">
            What is the minimum we would have to do for you to use our service?
            <textarea class="textarea" name="minumum_change"></textarea>
          </label>
          <label class="label">
            What else would we have to change/add for you to definitely subscribe?
            <textarea class="textarea" name="ideal_change"></textarea>
          </label>
          <label class="label">
            Anything else? :-)
            <textarea class="textarea" name="general"></textarea>
          </label>
          <button class="button is-link" type="submit">Send</button>
        </form>
      </div>
      <div className="box">
        <h1 class="title is-2">Contact</h1>
        You can also contact us at <a href="mailto: offsetme2021@gmail.com">offsetme2021@gmail.com</a> or email Jakub
        directly at <a href="mailto: js2427@cam.ac.uk">js2427@cam.ac.uk</a>.
      </div>
    </Layout>
  );
}
