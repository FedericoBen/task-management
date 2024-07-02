import styles from "./Card.module.scss";
import { FaRegTrashCan } from "react-icons/fa6";
import { RiEdit2Line } from "react-icons/ri";

const Card = ({ style, card, deleteCard, editCard, ...resProps }) => {
  return (
    <article
      
      style={{ ...(style ?? {}) }}
      id={`card-${card.id}`}
      className={`${styles.container_card} ${style && styles.drag_on}`}
    >
      <div className={styles.header}>
        <div className={`${styles.button}`} onClick={deleteCard}>
          <FaRegTrashCan size={20} />
        </div>
        <div className={`${styles.button}`} onClick={editCard}>
          <RiEdit2Line size={20} />
        </div>
      </div>
      <div {...resProps} className={styles.description}>{card.value}</div>
    </article>
  );
};

export default Card;
