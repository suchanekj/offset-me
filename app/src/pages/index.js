import React, { useState } from "react";
import "../styles.scss";
import { Layout } from "../components";

export default function Index() {
  const [value, setValue] = useState(0);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Layout>
      <div class="box">
        <div class="columns is-vcentered">
          <label for="slider" class="column is-1 label">
            Carbon
          </label>
          <input
            id="slider"
            class="column slider is-fullwidth is-circle"
            type="range"
            step="1"
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
          />
          <output for="slider" class="column is-1">
            {value}
          </output>
        </div>
      </div>
    </Layout>
  );
}
