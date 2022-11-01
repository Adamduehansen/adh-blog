import { createContext, PropsWithChildren, useContext } from 'react';
import User from '../User';

interface UserServiceContextProps {
  getUsers: () => Promise<User[]>;
}

const UserServiceContext = createContext<UserServiceContextProps>({
  getUsers: async () => [],
});

interface UserServiceClientProviderProps extends PropsWithChildren {
  client: UserServiceContextProps;
}

function UserServiceClientProvider({
  children,
  client,
}: UserServiceClientProviderProps): JSX.Element {
  return (
    <UserServiceContext.Provider value={client}>
      {children}
    </UserServiceContext.Provider>
  );
}

export function useUserServiceClient() {
  return useContext(UserServiceContext);
}

export default UserServiceClientProvider;
