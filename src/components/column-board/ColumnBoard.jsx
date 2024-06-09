import { Fragment, useRef, useState } from "react";
import styles from "./ColumnBoard.module.scss";
import Card from "../card/Card";

import { MdAddCircleOutline } from "react-icons/md";
import { CgClose } from "react-icons/cg";
import { FaRegTrashCan } from "react-icons/fa6";

import Input from "../input/Input";
import DropArea from "../drop-area/DropArea";

const ColumnBoard = ({
  column,
  listCards = [],
  onDrop,
  setActiveCard,
  deleteColumn,
  deleteCard,
  editCard,
  addTask,
}) => {
  const addTaskInput = useRef(null);

  const [activeAddTask, setActiveAddTask] = useState(false);

  const handlerAddTask = (e) => {
    e.preventDefault();
    if (!addTaskInput.current) return;
    addTask(addTaskInput.current.value, column);
    addTaskInput.current.value = "";
    setActiveAddTask(false);
  };
  return (
    <div className={styles.container_colum}>
      <div className={styles.container_header}>
        <div
          className={`${styles.button} ${styles.button_close}`}
          onClick={() => deleteColumn(column)}
        >
          <FaRegTrashCan size={24} />
        </div>
        <h3 className={styles.title}>{column}</h3>
        {!activeAddTask && (
          <div
            className={styles.button_task}
            onClick={() => setActiveAddTask(true)}
          >
            <MdAddCircleOutline size={30} />
            <span>Add task</span>
          </div>
        )}
      </div>
      <div className={styles.container_cards}>
        {activeAddTask && (
          <form onSubmit={handlerAddTask} className={styles.form_card}>
            <Input ref={addTaskInput} />
            <div className={styles.button} onClick={handlerAddTask}>
              <MdAddCircleOutline size={30} />
            </div>
            <div
              className={`${styles.button} ${styles.button_close}`}
              onClick={() => setActiveAddTask(false)}
            >
              <CgClose size={24} />
            </div>
          </form>
        )}
        <DropArea
          areaFull={listCards.length == 0}
          onDrop={() => onDrop(column, 0)}
        />
        {listCards.map((card, i) => (
          <Fragment key={`${card.id}-${i}`}>
            <Card
              editCard={() => editCard(card)}
              deleteCard={() => deleteCard(column, card)}
              card={card}
              setActiveCard={(card) => {
                setActiveCard(card);
              }}
            />
            <DropArea
              areaFull={i == listCards.length - 1}
              onDrop={() => onDrop(column, i + 1)}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ColumnBoard;
