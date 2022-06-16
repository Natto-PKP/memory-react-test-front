import axios from 'axios';

import type { AxiosError, AxiosResponse } from 'axios';

const game = {
  getCards: async (size = 4) => {
    const result = await axios.get(`https://api.littleworker.fr/2.0/account/cards?size=${size}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    }).catch((error: AxiosError) => error.response as AxiosResponse);

    if (result.status !== 200) throw Error(`Error code: ${result.status}`);
    return result.data;
  },

  postScore: async (time: number, moves: number) => {
    const result = await axios.post('https://api.littleworker.fr/2.0/account/cards/scores', {
      time,
      moves,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
    }).catch((error: AxiosError) => error.response as AxiosResponse);

    if (result.status !== 200 && result.status !== 201) throw Error(`Error code: ${result.status}`);
  },
};

export default game;
