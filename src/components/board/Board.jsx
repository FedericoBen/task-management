import { useEffect, useRef, useState } from "react";
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
    const cardToMove = board[activeCard.column].cards.find(
      (card) => card.id == activeCard.id
    );

    if (
      newPosition != 0 &&
      board[cardToMove.column].cards[newPosition - 1]?.id == cardToMove.id &&
      board[cardToMove.column].cards[newPosition - 1]?.column == column
    ) {
      return;
    }
    let newBoard = { ...board };
    newBoard[cardToMove.column].cards = newBoard[
      cardToMove.column
    ].cards.filter((card) => card.id != activeCard.id);
    newBoard[column].cards.splice(newPosition, 0, {
      ...cardToMove,
      column,
    });
    setBoard(newBoard);
  };

  const addColumn = (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    if (board[value] || !value) return;
    setBoard({ ...board, [crypto.randomUUID()]: { name: value, cards: [] } });
    setActionModal(null);
  };

  const addTask = (value, column) => {
    if (!value) return;
    const { name, cards } = board[column];
    setBoard({
      ...board,
      [column]: {
        name,
        cards: [
          {
            column: column,
            createAt: new Date(),
            id: crypto.randomUUID(),
            value,
          },
          ...cards,
        ],
      },
    });
  };

  const preparedModalToUpdate = (card) => {
    setActionModal(ACTION_MODAL.UPDATE_CARD(card));
  };

  const updateCard = (e, activeCard) => {
    e.preventDefault();
    if (!inputRef.current.value) return setActionModal(null);

    const { column, id } = activeCard;
    const { cards, name } = board[column];
    const newBoard = {
      ...board,
      [column]: {
        name,
        cards: cards.map((card) => ({
          ...card,
          value: card.id == id ? inputRef.current.value : card.value,
        })),
      },
    };
    setBoard(newBoard);
    setActionModal(null);
  };

  const deleteCard = (column, cardToDelete) => {
    const { cards, name } = board[column];
    setBoard({
      ...board,
      [column]: {
        name,
        cards: cards.filter((card) => card.id != cardToDelete.id),
      },
    });
  };

  const deleteColumn = (column) => {
    if (board[column].cards.length > 0)
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

  useEffect(() => {
    if (!actionModal) return;
    inputRef.current?.focus();
  }, [actionModal]);

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
            const key = column;
            return (
              <ColumnBoard
                deleteCard={deleteCard}
                deleteColumn={deleteColumn}
                editCard={preparedModalToUpdate}
                addTask={addTask}
                key={key}
                columnName={board[key].name}
                columnId={key}
                activeCard={activeCard}
                setActiveCard={setActiveCard}
                listCards={board[key].cards}
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
