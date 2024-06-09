import { useRef, useState } from "react";
import ColumnBoard from "../column-board/ColumnBoard";
import styles from "./Board.module.scss";
import Modal from "../modal/Modal";
import { CiSquarePlus } from "react-icons/ci";
import Input from "../input/Input";
import Button from "../button/Button";

const Board = () => {
  const inputRef = useRef(null);
  const [activeCard, setActiveCard] = useState(null);
  const [actionModal, setActionModal] = useState(null);

  const [board, setBoard] = useState({});

  const onDrop = (column, newPosition) => {
    if (!activeCard) return;
    const cardToMove = board[activeCard.column].find(
      (card) => card.id == activeCard.id
    );

    if (
      newPosition != 0 &&
      board[cardToMove.column][newPosition - 1]?.id == cardToMove.id &&
      board[cardToMove.column][newPosition - 1]?.column == column
    ) {
      return;
    }
    let newBoard = { ...board };
    newBoard[cardToMove.column] = newBoard[cardToMove.column].filter(
      (card) => card.id != activeCard.id
    );
    newBoard[column].splice(newPosition, 0, {
      ...cardToMove,
      column,
    });
    setBoard(newBoard);
  };

  const addColumn = (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    if (board[value] || !value) return;
    setBoard({ ...board, [value]: [] });
    setActionModal(null);
  };

  const addTask = (value, column) => {
    if(!value) return
    setBoard({
      ...board,
      [column]: [
        ...board[column],
        {
          column: column,
          createAt: new Date(),
          id: `${value}-${board[column].length + 1}`,
          value,
        },
      ],
    });
  };

  const preparedModalToUpdate = (card) => {
    setActionModal(ACTION_MODAL.UPDATE_CARD(card));
  };

  const updateCard = (e, activeCard) => {
    e.preventDefault();
    if (!inputRef.current.value) return setActionModal(null);

    const { column, id, value } = activeCard;
    const newBoard = {
      ...board,
      [column]: board[column].map((card) => ({
        ...card,
        value: card.id == id ? inputRef.current.value : card.value,
      })),
      };
    setBoard(newBoard);
    setActionModal(null);
  };


  const deleteCard = (column, cardToDelete) => {
    setBoard({
      ...board,
      [column]: board[column].filter((card) => card.id != cardToDelete.id),
    });
  };

  const deleteColumn = (column) => {
    if (board[column].length > 0)
      return setActionModal(ACTION_MODAL.STOP_DELETE_COLUMN);
    let newBoard = {};
    for (const key of Object.keys(board)) {
      if (key != column) newBoard[key] = board[key];
    }
    setBoard(newBoard);
  };

  const ACTION_MODAL = {
    ADD_COLUMN: (
      <form onSubmit={addColumn} className={styles.form_add_column}>
        <h3>Add a new column for manage your task</h3>
        <Input ref={inputRef} />
        <Button style={{ width: "max-content" }} onClick={addColumn}>
          Add column
        </Button>
      </form>
    ),
    STOP_DELETE_COLUMN: (
      <div className={styles.stop_delete_colum}>
        <h2>This action is not allowed</h2>
        <p>
          You need delete or move the card to other colum to proceed delete this
          column
        </p>
      </div>
    ),
    UPDATE_CARD: (card) => (
      <form
        onSubmit={(e) => updateCard(e, card)}
        className={styles.form_add_column}
      >
        <h3>Update</h3>
        <h3>{card?.value}</h3>
        <Input ref={inputRef} />
        <Button style={{ width: "max-content" }}>Update</Button>
      </form>
    ),
  };

  return (
    <>
      {actionModal && (
        <Modal onClose={() => setActionModal(null)}>{actionModal}</Modal>
      )}
      <div className={styles.container_board}>
        <div className={styles.header}>
          <Button
            className={styles.add_column_task}
            onClick={() => setActionModal(ACTION_MODAL.ADD_COLUMN)}
          >
            <CiSquarePlus size={30} />
            <span>Add column tasks</span>
          </Button>
        </div>
        <div className={styles.container_columns}>
          {Object.keys(board).map((column) => {
            const id = column;
            return (
              <ColumnBoard
                deleteCard={deleteCard}
                deleteColumn={deleteColumn}
                editCard={preparedModalToUpdate}
                addTask={addTask}
                key={id}
                column={id}
                activeCard={activeCard}
                setActiveCard={setActiveCard}
                listCards={board[id]}
                onDrop={onDrop}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Board;
