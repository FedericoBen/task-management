import { useState } from "react";
import styles from "./Card.module.scss";
import { FaRegTrashCan } from "react-icons/fa6";
import { RiEdit2Line } from "react-icons/ri";

const Card = ({ card, setActiveCard, deleteCard, editCard }) => {
  const [isDrop, setIsDrop] = useState(false);
  return (
    <article
      className={`${styles.container_card} ${isDrop && styles.drag_on}`}
      draggable
      onDragStart={() => {
        setIsDrop(true);
        setActiveCard(card);
      }}
      onDragEnd={() => {
        setIsDrop(false);
        setActiveCard(null);
      }}
    >
      <div className={styles.header}>
        <div className={`${styles.button}`} onClick={deleteCard}>
          <FaRegTrashCan size={20} />
        </div>
        <div className={`${styles.button}`} onClick={editCard}>
          <RiEdit2Line size={20} />
        </div>
      </div>
      <div className={styles.description}>{card.value}</div>
    </article>
  );
};

export default Card;
