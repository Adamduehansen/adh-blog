import { useEffect, useState, useContext } from 'react';
import UserServiceContext from '../contexts/UserServiceContext';
import type User from '../User';

function UserList(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>();
  const { getUsers } = useContext(UserServiceContext);

  useEffect((): void => {
    async function fetchUsers(): Promise<void> {
      try {
        const response = await getUsers();
        setUsers(response);
        setError(undefined);
      } catch (error) {
        setError('Could not load users!');
      }
    }

    fetchUsers();
  }, []);

  const userList =
    users.length > 0 ? (
      <ul>
        {users.map((user): React.ReactNode => {
          return (
            <li key={user.id}>
              <div>{user.username}</div>
            </li>
          );
        })}
      </ul>
    ) : (
      <div>No users found</div>
    );

  return (
    <div>
      {error && <div role='alert'>{error}</div>}
      <h1>Users</h1>
      {userList}
    </div>
  );
}

export default UserList;
