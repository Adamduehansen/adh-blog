---
title: Dependency Injection With React And How It Can Greatly Affect Your Code Quality
publish_date: 0000-00-00
---

I'm going to assume that you already know about how dependency injection in general works. In this post I'm going to show you how dependency injection can be achieved with React and how it can benefit the quality of your code.

Consider the following example where we want to create a component that lists a set of users. One way of doing this could be to write the component like this:

```javascript
// components/UserList.tsx

function UserList(): JSX.element {
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

But running this test gives we get an error: `ReferenceError: fetch is not defined`. A quick search on Google for "vitest fetch" shows us that we could either use an NPM package or override the global.fetch function. That seems like a lot of work to achieve somehing that should be quite simple. Therefore I'm going to show you a very simple way that enables us to manipulate our component to our liking. This can be done using dependency injection with useContext.

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

import { createContext } from "react";

interface UserServiceContextProps {
  getUsers: () => Promise<User[]>
}

const userServiceContext = createContext<UserServiceContextProps>({
  getUsers: () => []
});

export default UserServiceContext;
```

Now add a component that can act as a provider for the context.

```javascript
// lib/UserServiceProvider.tsx

import { useContext } from "react";
import UserServiceContext from "../contexts/UserServiceContext";
import { getUsers } from "../services/userService";

function UserServiceProvider(
  children: React.ReactNode
): JSX.element {
  const UserServiceContext = useContext(UserServiceContext);
  
  return (
    <UserServiceContext.Provider value={{
      getUsers: getUsers
    }}>
      { children }
    </UserServiceContext.Provider>
  );
}
```

Now go back to our UserList component and lets make a few changes:

```javascript
// Updates example with UserServiceContext
```

The component now consumes our UserServiceContext to fetch the list of users, and the component should render the list of users as before.
