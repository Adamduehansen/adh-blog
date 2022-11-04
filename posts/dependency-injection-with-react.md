---
title: Dependency Injection With React And How It Can Greatly Affect Your Code Quality
publish_date: 0000-00-00
---
In this post I'm going to show you how dependency injection can be achieved with React and how it can benefit the quality of your code.

I'm going to assume two things:
1. that you already know the concept of dependency injection
2. how React Context and the useContext hook works

If you would like to just view the code, here is a link to the [example Github repo](https://github.com/Adamduehansen/adh-blog/tree/draft/examples/dependency-injection).

***

# Introduction the problem

Imagine that we want a component that renders a list of users fetched from a web service. One way of doing this could be to write the component like this:

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
```

As a starting point, the above example is a great way to achieve our goal. Now - as good developers we want to write a unit test for our component. With Vitest and React Testing Library that one could look like this:

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

But running this test gives us an error: `ReferenceError: fetch is not defined`. A quick search on Google for "vitest fetch" shows us that one solution could be to use an NPM package. I don't think that an NPM package is the propper solution for two reason:
1. Introducing an NPM package as a solution for the problem can lead to external complications and more maintanance.
2. Mocking the `fetch` functions kinda feels like a code smell.

Therefore I'm going to show you a very simple way that enables us to rewrite our component to give us more control. We are going to move the service call out of the component and inject it into the component via dependency injection. This can be done with React Context.

# Using React Context for Dependency Injection

Lets start by adding a new file for the service function:
```javascript
// src/services/userService.ts

export async function getUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const json = await response.json();
  return json as User[];
}
```

Now add a new file. This file is going to contain a few interesting things:

```javascript
// src/lib/UserServiceClientProvider.tsx

interface UserServiceClient {
  getUsers: () => Promise<User[]>;
}

const UserServiceClientContext = createContext<UserServiceClient>({
  getUsers: async () => [],
});

interface UserServiceClientProviderProps extends PropsWithChildren {
  client: UserServiceClient;
}

export default function UserServiceClientProvider({
  children,
  client,
}: UserServiceClientProviderProps): JSX.Element {
  return (
    <UserServiceClientContext.Provider value={client}>
      {children}
    </UserServiceClientContext.Provider>
  );
}

export function useUserServiceClient(): UserServiceClient {
  return useContext(UserServiceClientContext);
}
```

1. `UserServiceClientContext` is a React Context which contains the implementations of a client. The client functions can be used by our components.
2. `UserServiceClientProvider` is a component that takes a client as a property and exposes it through a provider of the `UserServiceClientContext`.
3. `useUserServiceClient` is a custom hook that uses the `UserServiceClientContext` context.

Now go back to our UserList component and lets make a few changes:

```javascript
// components/UserList.tsx

function UserList(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const { getUsers } = useUserServiceClient(); // <--

  useEffect((): void => {
    async function fetchUsers(): Promise<void> {
      const response = await getUsers(); // <--
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
```

The component now uses our custom hook `useUserServiceClient`. From this hook we can use `getUsers`.

We also need to provide a client to `UserServiceClientProvider` somewhere in the component tree. Lets do that at the root of the application:

```javascript
// src/main.tsx

import { getUsers } from './services/userService';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserServiceClientProvider
      client={{
        getUsers: getUsers,
      }}
    >
      <UserList />
    </UserServiceClientProvider>
  </React.StrictMode>
);
```

The application should now fetch and render the list of users again. We can now revisit the test case and make a custom implementation of a client to the `UserServiceClientProvider`:

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
    <UserServiceClientProvider
      client={{
        getUsers: mockGetUsers,
      }}
    >
      <UserList />
    </UserServiceClientProvider>
  );

  // Act
  const users = await screen.findByRole('list');

  // Assert
  expect(users).toBeInTheDocument();
});
```

Our test now succeeds!

Why is this better than mocking the fetch function? In my opinion:
- It enforces us to separate business layer and view layer which makes our components much more clean.
- It is simpler and closer to the test. One can look down through the test case and read exactly what is the intention is.
- It does not leave the tests with mocks that needs to be cleaned.
- Does not require you to install NPM packages.

# Let's Add Some Extra Spices With More Tests and Storybook Stories

Let's take a look at the full flexibility of our dependency injection. Let's add another two tests to ensure that our component:
1. renders a message if the list of users is empty.
2. renders a message if the service threw an exception.

```javascript
// src/components/UserList.test.tsx

test('should render info message if no users were found', async (): Promise<void> => {
  // Arrange
  async function mockGetUsers(): Promise<User[]> {
    return [];
  }

  render(
    <UserServiceClientProvider
      client={{
        getUsers: mockGetUsers,
      }}
    >
      <UserList />
    </UserServiceClientProvider>
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
    <UserServiceClientProvider
      client={{
        getUsers: mockGetUsers,
      }}
    >
      <UserList />
    </UserServiceClientProvider>
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
  const { getUsers } = useUserServiceClient();

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
```

Tests are now running and we've done some throughout testing of our component.
```
 ✓ src/components/UserList.test.tsx (3)

Test Files  1 passed (1)
     Tests  3 passed (3)
```

You can also use this for the stories in your Storybook files. Consider this story for our component:

```javascript
// src/compoents/UserList.stories.tsx

export const Default: ComponentStory<typeof UserList> = function () {
  async function getUsers(): Promise<User[]> {
    return [
      {
        id: 1,
        username: 'jane-doe',
      },
      {
        id: 2,
        username: 'john-smith',
      },
    ];
  }

  return (
    <UserServiceClientProvider
      client={{
        getUsers: getUsers,
      }}
    >
      <UserList />
    </UserServiceClientProvider>
  );
};
```

This story is never dependend on the actual web service, and the full functionality of the component can always be viewed.
