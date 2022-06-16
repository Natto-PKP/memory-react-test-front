import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { MouseEvent } from 'react';

import { GameContext } from '../../../contextes/gameContext';
import gameAPI from '../../../requests/game';

import styles from './Board.module.scss';

type Cards = { card: string, revealed: boolean }[][];

export default function Board() {
  // Sauvegarde du plateau dans une variable
  const gameBoard = useRef<HTMLDivElement>(null);

  const game = useContext(GameContext);
  const { size } = game.options;
  const setError = game.error[1];
  const [cards, setCards] = game.cards;
  const setHistory = game.history[1];
  const setTurn = game.turn[1];
  const [couple, setCouple] = game.couple;
  const [end, setEnd] = game.end;
  const setTime = game.time[1];

  // Une state non voulue ! Pour d'obscure raison mon useEffect se déclanché 2x,
  // donc ça chambouler mon système. J'ai eu beau chercher, j'en suis arrivé qu'à cette solution
  const [render, setRender] = useState(false);
  // Une state contenant un setInterval
  const [timer, setTimer] = useState<NodeJS.Timer | null>(null);

  // Une function qui permet de stoper et de clear le timer
  const stopTimer = useCallback(() => {
    if (timer === null) return;
    clearInterval(timer);
    setTimer(null);
  }, [timer]);

  // Une function qui créer le tableau de jeu et lance le timer
  const createBoard = useCallback(() => {
    gameAPI.getCards(size).then((response) => {
      const result: Cards = [];
      for (let i = 0, y = 0; i < response.length; i += 1) {
        if (!result[y]) result.push([]);

        if (i && i % size === 0) {
          result.push([]);
          y += 1;
        }

        result[y].push({ card: response[i], revealed: false });
      }

      setCards(result);

      const now = Date.now();
      setTimer(setInterval(() => setTime(Date.now() - now), 95));
    }).catch((err: Error) => setError(err.message));
  }, [setTime, setError, size, setCards]);

  // Une function qui remet à tout à 0 lors de la fin du componant
  const removeBoard = useCallback(() => {
    setEnd(false);
    setCouple([]);
    setHistory([]);
    setCards([]);
    setTurn(0);
  }, [setEnd, setCouple, setHistory, setCards, setTurn]);

  // Une function qui met fin à la partie
  const endGame = useCallback(() => {
    setEnd(true);
    stopTimer();
  }, [stopTimer, setEnd]);

  // Le useEffect qui lance créer la partie
  useEffect(() => {
    if (render) createBoard();
    else setRender(true);

    return () => removeBoard(); // Ceci remettra tout à 0 lors de la fin du component
  }, [createBoard, removeBoard, render]);

  // Un autre useEffect qui va permet de gérer les duo de cartes sélectionnées
  // Je sais que le faire de cette façon n'est pas bien, mais sur le coup, je n'ai pas trouvé mieux
  useEffect(() => {
    if (couple.length === 2) {
      const cardsArr = cards as Cards;
      const [a, b] = couple;

      if (cardsArr[a.x][a.y].card === cardsArr[b.x][b.y].card) {
        cardsArr[a.x][a.y].revealed = true;
        cardsArr[b.x][b.y].revealed = true;

        if (cardsArr.every((r) => r.every(({ revealed }) => revealed))) endGame();
        setCards(cardsArr);
        setCouple([]);
      } else {
        setTimeout(() => {
          const board = gameBoard.current as HTMLElement;
          const aElement = board.children[a.x].children[a.y];
          aElement.innerHTML = '';
          aElement.classList.remove(styles.card__active);
          cardsArr[a.x][a.y].revealed = false;

          const bElement = board.children[b.x].children[b.y];
          bElement.innerHTML = '';
          bElement.classList.remove(styles.card__active);
          cardsArr[b.x][b.y].revealed = false;

          setHistory((acc) => [...acc, { x: a.x, y: a.y, action: 'hide' }, { x: b.x, y: b.y, action: 'hide' }]);
          setCouple([]);
        }, 800);
      }

      setTurn((acc) => acc + 1);
    }
  }, [couple, setCouple, cards, endGame, setTurn, setCards, setHistory]);

  // Une function qui retoune la carte sur la quelle on clique
  const handleCardClick = (x: number, y: number) => {
    const handler = (event: MouseEvent<HTMLButtonElement>) => {
      if (couple.length >= 2 || end) return;
      const target = event.target as HTMLElement;
      const arr = cards as Cards;

      target.classList.add(styles.card__active);
      target.innerHTML = arr[x][y].card;
      arr[x][y].revealed = true;
      setHistory((acc) => [...acc, { x, y, action: 'flip' }]);

      setCouple((acc) => [...acc, { x, y }]);
      setCards(arr);
    };

    return handler;
  };

  // Je sais aussi qu'il faut mettre des key sur les éléments qu'on boucle.
  // Mon Eslint m'interdit de mettre l'index en tant que key,
  // je ne savais donc pas quoi mettre de façon propre
  return (
    <div ref={gameBoard} id="game-board" className={styles.board}>
      {cards.map((row, x) => (
        <div className={styles.row}>
          {row.map((_, y) => (
            <button type="button" className={styles.card} onClick={handleCardClick(x, y)}>{' '}</button>
          ))}
        </div>
      ))}
    </div>
  );
}
