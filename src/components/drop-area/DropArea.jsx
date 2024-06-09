import { useState } from "react";
import styles from "./DropArea.module.scss";

const DropArea = ({ onDrop, areaFull }) => {
  const [showDrop, setShowDrop] = useState(false);
  return (
    <div
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
      onDrop={()=>{
        setShowDrop(false)
        onDrop();
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      className={`${styles.drop} ${showDrop ? styles.drop_area : styles.hide_drop} ${
        areaFull && styles.drop_area_full
      }`}
    >
      Drop area
    </div>
  );
};

export default DropArea;
