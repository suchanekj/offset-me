import React from "react";


import info_img from "../images/info.png"

export const InfoPopup = ({
                         name,
                         content,
                       }) => {
  return (
    <div>
      <button className="button is-primary is-large modal-button" data-target="modal-ter" aria-haspopup="true">
        {name}
        <img src={info_img} height="1m" />
      </button>
      <div className="modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{name}</p>
            <button className="delete" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            {content}
          </section>
        </div>
      </div>
    </div>
  );
};
