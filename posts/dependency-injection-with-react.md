---
title: Dependency Injection With React And How It Can Greatly Affect Your Code Quality
publish_date: 0000-00-00
---

I'm going to assume that you already know about how dependency injection in general works. In this post I'm going to show you how dependency injection can be achieved with React and how it can benefit the quality of your code.

Consider the following example where we want to create a component that lists a set of users. One way of doing this could be to write the component like this:

```javascript
function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );
      const json = await response.json();
      setUsers(json);
    }

    fetchUsers();
  }, []);

  const userList = users.map((user) => {
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
describe('UserList', () => {
  test('should first', () => {
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

Lets start by adding a new file for the service part "userService.ts":
```javascript
export async function getUsers(): Promise<User[]> {
  const response = await fetch("");
  const json = await response.json();
  return json as User[];
}
```

Now add a new file for a React context for the user service.
