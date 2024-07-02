import { useEffect, useState } from "react";
import styles from "./DropArea.module.scss";

const DropArea = ({ id, over, onDrop, areaFull, activeDrop }) => {
  const [showDrop, setShowDrop] = useState(false);
  useEffect(() => {
    if (over) setShowDrop(true);
    else setShowDrop(false);
  }, [over]);

  useEffect(() => {
    activeDrop && onDrop()
  }, [activeDrop, onDrop])
  
  return (
    <div
      id={id}
      className={`${styles.drop} ${
        showDrop ? styles.drop_area : styles.hide_drop
      } ${areaFull && styles.drop_area_full}`}
    >
      Drop area
    </div>
  );
};

export default DropArea;
