import { useCallback, useEffect, useRef, useState } from "react";
import ColumnBoard from "../column-board/ColumnBoard";
import styles from "./Board.module.scss";
import Modal from "../modal/Modal";
import { CiSquarePlus } from "react-icons/ci";
import Input from "../input/Input";
import Button from "../button/Button";

const Board = () => {
  const inputRef = useRef(null);
  const [actionModal, setActionModal] = useState(null);
  const [movingCard, setMovingCard] = useState(null);

  const [board, setBoard] = useState({});

  const onDrop = (column, newPosition) => {
    if (!movingCard) return;

    let cardToMove = null;

    const columnsBoard = Object.keys(board);

    columnsBoard.forEach((col) => {
      const cardToFind = board[col].cards.find(
        (card) => card.id == movingCard?.id
      );
      if (cardToFind) cardToMove = cardToFind;
    });

    if (
      newPosition != 0 &&
      board[cardToMove.column].cards[newPosition - 1]?.id == cardToMove.id &&
      board[cardToMove.column].cards[newPosition - 1]?.column == column
    ) {
      return;
    }

    let newBoard = structuredClone(board);

    const boardFilter = newBoard[cardToMove.column].cards.filter(
      (card) => card.id != movingCard?.id
    );

    newBoard[cardToMove.column].cards = boardFilter;

    newBoard[column].cards = newBoard[column].cards.toSpliced(newPosition, 0, {
      ...cardToMove,
      column,
    });

    setBoard(newBoard);
    setMovingCard(null);
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

  //*Event mobile
  const startTouche = (e, card) => {
    const touchPoint = {
      x: e.touches?.[0].clientX,
      y: e.touches?.[0].clientY,
    };

    setMovingCard({
      ...card,
      drop: false,
      style: {
        position: "fixed",
        top: `${touchPoint.y}px`,
        left: `${touchPoint.x - 50}px`,
      },
    });
  };

  const moveTouche = (e) => {
    if (!e?.touches?.[0] || !movingCard) return;
    const touchPoint = {
      x: e.touches?.[0].clientX,
      y: e.touches?.[0].clientY,
    };
    const elementUnderTouch = document.elementFromPoint(
      touchPoint.x - 50,
      touchPoint.y
    );
    window.scroll({
      top: touchPoint.y,
      left: 0,
      behavior: "smooth",
    });

    setMovingCard({
      ...movingCard,
      elementBelow: elementUnderTouch?.id,
      style: {
        position: "fixed",
        top: `${touchPoint.y}px`,
        left: `${touchPoint.x - 50}px`,
      },
    });
  };
  const endTouche = useCallback(() => {
    if (!movingCard?.id) return;
    setMovingCard({
      ...movingCard,
      style: null,
      drop: true,
    });
  }, [movingCard]);

  //*Event desktop

  const onMouseDown = (e, card) => {
    const touchPoint = {
      x: e.clientX,
      y: e.clientY,
    };

    setMovingCard({
      ...card,
      drop: false,
      style: {
        position: "fixed",
        top: `${touchPoint.y - 80}px`,
        left: `${touchPoint.x - 50}px`,
      },
    });
  };

  const onMouseMove = (e) => {
    if (!movingCard) return;
    const positionMouse = {
      x: e.clientX,
      y: e.clientY,
    };

    const elementUnderTouch = document.elementFromPoint(
      positionMouse.x - 150,
      positionMouse.y - 90
    );

    setMovingCard({
      ...movingCard,
      elementBelow: elementUnderTouch?.id,
      style: {
        position: "fixed",
        top: `${positionMouse.y - 80}px`,
        left: `${positionMouse.x - 165}px`,
      },
    });
  };
  const onMouseUp = () => {
    if (!movingCard) return;
    setMovingCard({
      ...movingCard,
      style: null,
      drop: true,
    });
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
                startTouche={startTouche}
                moveTouche={moveTouche}
                endTouche={endTouche}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                deleteCard={deleteCard}
                deleteColumn={deleteColumn}
                editCard={preparedModalToUpdate}
                addTask={addTask}
                key={key}
                columnName={board[key].name}
                columnId={key}
                listCards={board[key].cards}
                onDrop={onDrop}
                movingCard={movingCard}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Board;
