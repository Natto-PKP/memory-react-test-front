import { createContext, Dispatch, SetStateAction } from 'react';

export type UserTokenContextModel = {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>
};

export const UserTokenContext = createContext<UserTokenContextModel>({
  token: null,
  setToken: () => null,
});
