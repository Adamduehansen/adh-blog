import UserServiceContext from '../contexts/UserServiceContext';
import { getUsers } from '../services/userService';

function UserServiceProvider({
  children,
}: React.PropsWithChildren): JSX.Element {
  return (
    <UserServiceContext.Provider
      value={{
        getUsers: getUsers,
      }}
    >
      {children}
    </UserServiceContext.Provider>
  );
}

export default UserServiceProvider;
