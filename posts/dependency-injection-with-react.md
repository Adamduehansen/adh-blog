---
title: Dependency Injection With React And How It Can Greatly Affect Your Code Quality
publish_date: 0000-00-00
---

I'm going to assume that you already know about how dependency injection in general works. In this post I'm going to show you how dependency injection can be achieved with React and how it can benefit the quality of your code. If you want a TL;DR, here is a link to the Github repo.

Consider the following example where we want a component to list a set of users. One way of doing this could be to write the component like this:

```javascript
// src/components/UserList.tsx

function UserList(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);

  useEffect((): void => {
    async function fetchUsers(): Promise<void> {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      const json = await response.json();
      setUsers(json);
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
    ) : null;

  return (
    <div>
      <h1>Users</h1>
      {userList}
    </div>
  );
}

export default UserList;
```

As a starting point, the above example is a great way to achieve our goal. As good developers we want to write a unit test for our component. With Vitest and React Testing Library that one could look like this:

```javascript
// src/components/UserList.test.tsx

test('should render a list of users from service', async (): Promise<void> => {
  // Arrange
  render(<UserList />);

  // Act
  const userListElement = await screen.findByRole('list');

  // Assert
  expect(userListElement).toBeInTheDocument();
});
```

But running this test gives we get an error: `ReferenceError: fetch is not defined`. A quick search on Google for "vitest fetch" shows us that one solution could be to use an NPM package. I don't think that the propper solution is an NPM package. My main problem is that we use `fetch` inside the component. Therefore I'm going to show you a very simple way that enables us to rewrite our component to give us more control. This can be done using dependency injection with useContext.

Lets start by adding a new file for the service functions:
```javascript
// src/services/userService.ts

export async function getUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const json = await response.json();
  return json as User[];
}
```

Now add a new file for a React context for the user service:

```javascript
// src/contexts/UserServiceContext.ts

interface UserServiceContextProps {
  getUsers: () => Promise<User[]>;
}

const UserServiceContext = createContext<UserServiceContextProps>({
  getUsers: async () => [],
});

export default UserServiceContext;
```

Now add a component that can act as a provider for the context.

```javascript
// src/lib/UserServiceProvider.tsx

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
```

Now go back to our UserList component and lets make a few changes:

```javascript
// components/UserList.tsx

function UserList(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const { getUsers } = useContext(UserServiceContext);

  useEffect((): void => {
    async function fetchUsers(): Promise<void> {
      const response = await getUsers();
      setUsers(response);
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
    ) : null;

  return (
    <div>
      <h1>Users</h1>
      {userList}
    </div>
  );
}

export default UserList;
```

The component now consumes the `UserServiceContext` to fetch the list of users. But we need to provide our implementation of  `UserServiceContext` somewhere in the component tree. Lets do that at the root of the application:

```javascript
// src/main.tsx

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserServiceProvider>
      <UserList />
    </UserServiceProvider>
  </React.StrictMode>
);
```

The application should now fetch and render the list of users again. We can now revisit the test case and make a custom implementation of `UserServiceContext`:

```javascript
// src/components/UserList.test.tsx

test('should render a list of users from service', async (): Promise<void> => {
  // Arrange
  async function mockGetUsers(): Promise<User[]> {
    return [
      {
        id: 1,
        username: 'any-username',
      },
    ];
  }

  render(
    <UserServiceContext.Provider
      value={{
        getUsers: mockGetUsers,
      }}
    >
      <UserList />
    </UserServiceContext.Provider>
  );

  // Act
  const users = await screen.findByRole('list');

  // Assert
  expect(users).toBeInTheDocument();
});
```

Our test now succeeds. Let's take a look at the full flexibility of our dependency injection. Let's add another two tests for:
1. render a message if the user list is empty.
2. render a message if the service threw an exception.

```javascript
// src/components/UserList.test.tsx

test('should render info message if no users were found', async (): Promise<void> => {
  // Arrange
  async function mockGetUsers(): Promise<User[]> {
    return [];
  }

  render(
    <UserServiceContext.Provider
      value={{
        getUsers: mockGetUsers,
      }}
    >
      <UserList />
    </UserServiceContext.Provider>
  );

  // Act
  const noUsersFoundElement = await screen.findByText('No users found');

  // Assert
  expect(noUsersFoundElement).toBeInTheDocument();
});

test('should render alert if service threw an error', async (): Promise<void> => {
  // Arrange
  async function mockGetUsers(): Promise<User[]> {
    throw new Error('any-error');
  }

  render(
    <UserServiceContext.Provider
      value={{
        getUsers: mockGetUsers,
      }}
    >
      <UserList />
    </UserServiceContext.Provider>
  );

  // Act
  const errorElement = await screen.findByRole('alert');

  // Assert
  expect(errorElement).toBeInTheDocument();
});
```

The updated component now looks like this:

```javascript
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
```

Tests are now running and we've done some throughout testing of our component
```
 ✓ src/components/UserList.test.tsx (3)

Test Files  1 passed (1)
     Tests  3 passed (3)
```

Why is this better than mocking the fetch function? In my opinion:
- It enforces us to separate business layer and view layer which makes our components much more clean.
- It is simpler and closer to the test. One can look down through the test case and read exactly what is the intention is.
- It does not leave a tests with mocks that needs to be cleaned.
