export interface CreateUserBody {
  telegramId: string | number;
  username?: string;
}

export interface User {
  id: string;
  telegramId: bigint;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  telegramId: string;
  username: string | null;
  createdAt: string;
  updatedAt: string;
}
