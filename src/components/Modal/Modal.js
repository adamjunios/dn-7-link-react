import React, { useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import "../../index.css";
import "./modal.css";

const Modal = (props) => {
  //set close by state

  //set close by "esc"
  const closeOnEscapeKeyDown = (e) => {
    if (e.charCode || e.keyCode === 27) {
      props.onClose();
    }
  };

  //use effect to detect click "esc"
  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);

  return (
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 500, exit: 500 }}
    >
      <div className="modal" onClick={props.onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">{props.modalTitle}</div>
            <div className="button-close" onClick={props.onClose}>
              Close
            </div>
          </div>
          <div className="modal-body">{props.modalBody}</div>
          <div className="modal-footer">
            <a
              href={props.modalLink}
              className="button-next"
              target="_blank"
              rel="noreferrer"
            >
              Daftar
            </a>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
