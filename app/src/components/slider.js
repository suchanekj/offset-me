import React from "react";

export const Slider = ({ name, value, setValue, max, unit, level, high, low, mid }) => {
  const handleChange = (e) => {
    setValue(Number(e.target.value));
  };
  return (
    <div class="columns is-vcentered">
      <label for="slider" class={"column form-text form-level-" + String(level)}>
        {name}
      </label>
      <div class="slider-container">
        <input
          id="slider"
          className="column slider is-circle"
          type="range"
          step="0.01"
          min={0}
          max={max}
          value={value}
          onChange={handleChange}
        />
        <div className="slider-marks">
          <span className="slider-mark" style={{marginLeft: String(Number(low) / Number(max) * 100) + "%"}}>▶</span>
          <span className="slider-mark" style={{marginLeft: String((Number(mid) - Number(low)) / Number(max) * 100) + "%"}}>▲</span>
          <span className="slider-mark" style={{marginLeft: String((Number(high) - Number(mid)) / Number(max) * 100) + "%", marginRight: "auto"}}>◀</span>
        </div>
      </div>
      <output for="slider" class="column form-value">
        {unit === "%" ? `${value.toFixed(1)} %` : `£ ${value}`}
      </output>
    </div>
  );
};
