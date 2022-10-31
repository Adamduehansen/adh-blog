import { act, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import UserServiceContext from '../contexts/UserServiceContext';
import User from '../User';
import UserList from './UserList';

describe('UserList', (): void => {
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
});
