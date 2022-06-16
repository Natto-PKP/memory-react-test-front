import axios from 'axios';

import type { AxiosResponse, AxiosError } from 'axios';

const account = {
  login: async (email: string, password: string) => {
    const result = await axios.post('https://api.littleworker.fr/2.0/account/login', {
      login: email,
      password,
    }).catch((error: AxiosError) => error.response as AxiosResponse);

    if (result.status !== 200) throw Error(`Error code: ${result.status}`);
    localStorage.setItem('token', result.data.token);

    return result.data.token;
  },

  register: async (email: string, password: string) => {
    const result = await axios.post('https://api.littleworker.fr/2.0/account/register', {
      email,
      password,
    }).catch((error: AxiosError) => error.response as AxiosResponse);

    if (result.status !== 200) throw Error(`Error code: ${result.status}`);
    return account.login(email, password);
  },
};

export default account;
