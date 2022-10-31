import React from 'react';
import ReactDOM from 'react-dom/client';
import UserList from './components/UserList';
import UserServiceProvider from './lib/UserServiceProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserServiceProvider>
      <UserList />
    </UserServiceProvider>
  </React.StrictMode>
);
