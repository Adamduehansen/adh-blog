import { ComponentMeta, ComponentStory } from '@storybook/react';
import UserServiceClientProvider from '../lib/UserServiceClientProvider';
import User from '../User';
import UserList from './UserList';

export default {
  title: 'UserList',
  component: UserList,
} as ComponentMeta<typeof UserList>;

export const Default: ComponentStory<typeof UserList> = function () {
  async function getUsers(): Promise<User[]> {
    return [
      {
        id: 1,
        username: 'Jane Doe',
      },
      {
        id: 2,
        username: 'John Smith',
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
