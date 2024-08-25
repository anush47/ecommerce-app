import "./Modal.css";
import {ReactComponent as CloseIcon} from "../icons/close-icon.svg"; 

const Modal = ({ open, handleClose, title, children }) => {
  if (open) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      {open && (
        <div className="modal">
          <div onClick={handleClose} className="overlay"></div>
          <div className="modal-content">
            <div className="modal-head-container">
              <p className="modal-title-text">{title}</p>
              <CloseIcon className="close-icon" onClick={handleClose}/>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
