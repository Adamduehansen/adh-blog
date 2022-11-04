import React from 'react';
import ReactDOM from 'react-dom/client';
import UserList from './components/UserList';
import UserServiceClientProvider from './lib/UserServiceClientProvider';
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
