import React from "react";
import {Layout} from "../components";
import jakub_img from "../images/jakub.jpg"
import lawrence_img from "../images/lawrence.jpg"

export default function About() {
  return (
    <Layout>
      <div className="box">
        <h1 class="title is-2">Team</h1>
      </div>
      <div className="tile is-ancestor">
        <div className="tile is-horizontal">
          <div className="tile is-parent">
            <div className="tile is-child box">
              <figure className="image is-128x128">
                <img className="is-rounded" src={jakub_img}/>
              </figure>
              <h2 class="title is-3">Jakub Suchánek</h2>
              <div className="content">
                <p>University of Cambridge engineering undergraduate</p>
                <p>Background in Machine Learning and Robotics, recently got involved with Effective Altruism and
                  currently working on a construction robotics start-up to fully dive into after finishing BA degree
                  in June.</p>
                <p>More: <a href="http://www.suchanek.io">suchanek.io</a></p>
              </div>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child box">
              <figure className="image is-128x128">
                <img className="is-rounded" src={lawrence_img}/>
              </figure>
              <h2 class="title is-3">Lawrence Berry</h2>
              <div className="content">
                <p>University of Cambridge engineering alumnus</p>
                <p>Background in web development.</p>
                <p>More: <a href="https://www.lawrencejb.com">lawrencejb.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box">
        <h1 class="title is-2">Motivation for starting this project</h1>
        <div className="content">
          <p>Initial idea for this project came when I impulsively decided I want to offset my carbon footprint
            but couldn't find a quick way to estimate my footprint and offset it. As it was an impulsive decision
            I wanted to be given a figure and a decent seeming recipent and be done with it in a few clicks.
            Any footprint calculator I could find would require information I don't really know (such as my natural gas
            usage for heating) and most charities would require a million steps (which are certainly useful for large,
            thought through donations, but not for a small impulsive one). I settled with roughly guessing how many
            trees I should get planted (which I now believe was a factor of 2 off) and donating to
            <a href="https://teamtrees.org/">#teamtrees</a> (who uniquely make it possible to donate with about 3
            clicks). </p>
          <p>I have since found better solutions available, but 1) everything requires a lot of steps until I can
            offset myself even for a non-personalized amount and 2) everything is specialized - I would have to use
            a good number of different services at which point it is not much easier than donating directly to various
            foundations and roughly guessing how much should be given to each cause.</p>
          <p>Hence the goal was initially set out as creating a solution where with one click (plus payment info)
            you can offset yourself for all the wrongs you're responsible for. </p>
        </div>
      </div>
    </Layout>
  );
}
