import type User from '../User';

export async function getUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const json = await response.json();
  return json as User[];
}
