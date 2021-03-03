import React from "react";

export const Slider = ({ name, value, setValue, max, unit }) => {
  const handleChange = (e) => {
    setValue(Number(e.target.value));
  };
  return (
    <div class="columns is-vcentered form-row">
      <label for="slider" class="column form-text">
        {name}
      </label>
      <input
        id="slider"
        class="column slider is-circle"
        type="range"
        step="1"
        min={0}
        max={max}
        value={value}
        onChange={handleChange}
      />
      <output for="slider" class="column form-value">
        {unit === "%" ? `${value.toFixed(1)} %` : `£ ${value}`}
      </output>
    </div>
  );
};
