import React from "react";

export const Slider = ({ name, value, setValue, min, max, unit }) => {
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div class="columns is-vcentered">
      <label for="slider" class="column is-1">
        {name}
      </label>
      <input
        id="slider"
        class="column slider is-fullwidth is-circle"
        type="range"
        step="1"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
      <output for="slider" class="column is-1">
        {unit === "%" ? `${value} %` : `£ ${value}`}
      </output>
    </div>
  );
};
