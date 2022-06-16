import { createContext, Dispatch, SetStateAction } from 'react';

type Cards = { card: string, revealed: boolean }[][];

export type GameContextModel = {
  options: { size: number };
  cards: [Cards, Dispatch<SetStateAction<Cards>>]
  turn: [number, Dispatch<SetStateAction<number>>];
  couple: [{ x: number, y: number }[], Dispatch<SetStateAction<{ x: number, y: number }[]>>];
  history: [{ x: number, y: number, action: 'flip' | 'undo' | 'hide' }[], Dispatch<SetStateAction<{ x: number, y: number, action: 'flip' | 'undo' | 'hide' }[]>>];
  end: [boolean, Dispatch<SetStateAction<boolean>>];
  error: [string | null, Dispatch<SetStateAction<string | null>>];
  time: [number, Dispatch<SetStateAction<number>>];
};

export const GameContext = createContext<GameContextModel>({
  options: { size: 4 },
  cards: [[], () => []],
  turn: [0, () => 0],
  couple: [[], () => []],
  history: [[], () => []],
  end: [false, () => false],
  error: [null, () => null],
  time: [0, () => 0],
});
