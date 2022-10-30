---
title: Dependency Injection With React And How It Can Greatly Affect Your Code Quality
publish_date: 0000-00-00
---

I'm going to assume that you already know about how dependency injection in general works. In this post I'm going to show you how dependency injection can be achieved with React and how it can benefit the quality of your code.

Consider the following example where we want to create a component that lists a set of users. One way of doing this could be to write the component like this:

```javascript
// components/UserList.tsx

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

  const userList = users.map((user): React.ReactNode => {
    return (
      <ul>
        <li key={user.id}>
          <div>{user.username}</div>
        </li>
      </ul>
    );
  });

  return (
    <div>
      <h1>Users</h1>
      {userList}
    </div>
  );
}
```

As a starting point, the above example is a great way to achieve our goal. As good developers we want to write a unit tests for our component. With Vitest and React Testing Library that one could look like this:

```javascript
// components/UserList.test.tsx

describe('UserList', (): void => {
  test('should first', (): void => {
    // Arrange
    render(<UserList />);

    // Act
    const users = screen.queryByRole('list');

    // Assert
    expect(users).not.toBeNull();
  });
});
```

But running this test gives we get an error: `ReferenceError: fetch is not defined`. A quick search on Google for "vitest fetch" shows us that one solution could be to use an NPM package. I don't think that the propper solution is an NPM package. My main proplem is that we use `fetch` inside the component. Therefore I'm going to show you a very simple way that enables us to rewrite our component to give us more control. This can be done using dependency injection with useContext.

Lets start by adding a new file for the service functions:
```javascript
// services/userService.ts

export async function getUsers(): Promise<User[]> {
  const response = await fetch("");
  const json = await response.json();
  return json as User[];
}
```

Now add a new file for a React context for the user service:

```javascript
// contexts/UserServiceContext.ts

interface UserServiceContextProps {
  getUsers: () => Promise<User[]>
}

const UserServiceContext = createContext<UserServiceContextProps>({
  getUsers: async () => []
});

export default UserServiceContext;
```

Now add a component that can act as a provider for the context.

```javascript
// lib/UserServiceProvider.tsx

function UserServiceProvider(children: React.ReactNode): JSX.Element {
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
// Updated example component with UserServiceContext
```

The component now consumes the `UserServiceContext` to fetch the list of users. But we need to provide our implementation of  `UserServiceContext` somewhere in the component tree. Lets do that at the root of the application:

```javascript
// Updated example from main.tsx
```

The application should now fetch and render the list of users again. We can now revisit the test case and make a custom implementation of `UserServiceContext`:

```javascript
// Updated example of the test.
```

Our test now succeeds. Let's take a look at the full flexibility of our dependency injection. Let's add another two tests for:
1. render a message if the user list is empty.
2. render a message if the service threw an exception.

```javascript
// Updated test case with two new tests
```

Why is this better than mocking the fetch function? In my opinion
- Enforces us to separate business layer and view layer which makes our components much more clean.
- Is simpler and closer to the test. One can look down through the test case and read exactly what is the intention is.
- Does not leave a tests with mocks that needs to be cleaned.
