import { createContext, PropsWithChildren, useContext } from 'react';
import User from '../User';

interface UserServiceClient {
  getUsers: () => Promise<User[]>;
}

const UserServiceContext = createContext<UserServiceClient>({
  getUsers: async () => [],
});

interface UserServiceClientProviderProps extends PropsWithChildren {
  client: UserServiceClient;
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
