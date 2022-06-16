import { useState } from 'react';

import { GameContext } from '../../contextes/gameContext';
import gameAPI from '../../requests/game';
import Board from './Board/Board';

import styles from './Game.module.scss';
import cardStyles from './Board/Board.module.scss';

type Cards = { card: string, revealed: boolean }[][];

export default function Game() {
  // State pour afficher un message d'erreur
  const [error, setError] = useState<string | null>(null);

  // State contenant les cartes et si elle sont ou non retournées
  const [cards, setCards] = useState<Cards>([]);

  // State contenant le nombre de tour
  const [turn, setTurn] = useState(0);

  // State contenant le temps en ms
  const [time, setTime] = useState(0);

  // State contenant le duo de carte retournées
  const [couple, setCouple] = useState<{ x: number, y: number }[]>([]);

  // State contenant l'historique de toute les actions de la partie
  const [history, setHistory] = useState<{ x: number, y: number, action: 'flip' | 'undo' | 'hide' }[]>([]);

  // State indiquant si la partie est terminée ou non
  const [end, setEnd] = useState(false);

  // State comptant le nombre de partie qui permet de reset Board à chaque update
  const [restartCount, setRestartCount] = useState(0);

  // Function qui fait revenir annule le duo en cours
  const handleUndoClick = () => {
    couple.forEach(({ x, y }) => {
      const gameBoard = document.getElementById('game-board') as HTMLElement;

      setHistory((acc) => [...acc, { x, y, action: 'undo' }]);
      const element = gameBoard.children[x].children[y];
      const cardsArr = cards;

      element.innerHTML = '';
      element.className = cardStyles.card;
      cardsArr[x][y].revealed = false;
      setCards(cardsArr);
    });

    setCouple([]);
  };

  // Function qui relis la partie grâce à l'historique
  const handleReviewClick = async () => {
    const gameBoard = document.getElementById('game-board') as HTMLElement;

    for (let x = 0; x < gameBoard.children.length; x += 1) {
      for (let y = 0; y < gameBoard.children[x].children.length; y += 1) {
        const element = gameBoard.children[x].children[y];
        element.innerHTML = '';
        element.className = cardStyles.card;
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for await (const { x, y, action } of history) {
      const element = gameBoard.children[x].children[y];
      await new Promise((resolve) => { setTimeout(resolve, 500); });
      if (action === 'hide' || action === 'undo') {
        element.innerHTML = '';
        element.className = cardStyles.card;
      } else if (action === 'flip') {
        element.innerHTML = cards[x][y].card;
        element.classList.add(cardStyles.card__active);
      }
    }
  };

  // Function qui remet tout à 0 et qui relance une partie
  const handleRestartClick = () => {
    gameAPI.postScore(time, turn).catch((err: Error) => setError(err.message));
    setRestartCount((acc) => acc + 1);
  };

  return (
    <GameContext.Provider value={{
      options: { size: 4 },
      error: [error, setError],
      cards: [cards, setCards],
      turn: [turn, setTurn],
      couple: [couple, setCouple],
      history: [history, setHistory],
      time: [time, setTime],
      end: [end, setEnd],
    }}
    >
      <section className={styles.board}>
        {error && (<span className={styles.error}>{error}</span>)}
        {end && (
        <div className={styles.message}>
          <span>End game</span>
          <button type="button" onClick={handleRestartClick}>Reset</button>
        </div>
        )}

        <Board key={restartCount} />

        <footer className={styles.footer}>
          {!end
            ? (<button type="button" className={styles.button} onClick={handleUndoClick}>Undo</button>)
            : (<button type="button" className={styles.button} onClick={handleReviewClick}>Revoir</button>)}

          {/* Le timer ne s'actualise pas ici */}
          <span className={styles.details}>{`${turn} coups - ${((time) / 1000).toFixed(2)}s`}</span>
        </footer>
      </section>
    </GameContext.Provider>
  );
}
