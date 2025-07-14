import { createContext, useContext } from 'react';

interface UserData {
  name: string;
  handle: string;
}

export const UserContext = createContext<UserData>({ name: 'You', handle: 'yourhandle' });

export const useUser = () => useContext(UserContext); 