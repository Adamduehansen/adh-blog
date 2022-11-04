import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import UserServiceClientProvider from '../lib/UserServiceClientProvider';
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
});
