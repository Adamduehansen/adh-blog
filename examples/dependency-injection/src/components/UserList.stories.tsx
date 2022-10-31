import { ComponentMeta, ComponentStory } from '@storybook/react';
import UserServiceContext from '../contexts/UserServiceContext';
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
    <UserServiceContext.Provider
      value={{
        getUsers: getUsers,
      }}
    >
      <UserList />
    </UserServiceContext.Provider>
  );
};
