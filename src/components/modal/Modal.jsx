import { CgClose } from "react-icons/cg";
import styles from "./Modal.module.scss";

const Modal = ({ children, onClose }) => {
  return (
    <div className={styles.container_modal}>
      <div className={styles.background} onClick={onClose} />
      <div className={styles.Modal}>
        <div className={styles.close_button} onClick={onClose}>
          <CgClose size={30} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
