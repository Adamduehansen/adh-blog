import { createContext } from 'react';
import type User from '../User';

interface UserServiceContextProps {
  getUsers: () => Promise<User[]>;
}

const UserServiceContext = createContext<UserServiceContextProps>({
  getUsers: async () => [],
});

export default UserServiceContext;
