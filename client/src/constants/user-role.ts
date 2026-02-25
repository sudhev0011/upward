export const UserRole = {
  CLIENT: 'client',
  PROVIDER: 'provider',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];