import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type JsonPrimitive = string | number | boolean | null;

export type JsonArray = JsonValue[];

export type JsonObject = { [key: string]: JsonValue };

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface IPostgresInterval {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export interface AuthAccount {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: ColumnType<Date, Date | string, Date | string> | null;
  refreshTokenExpiresAt: ColumnType<Date, Date | string, Date | string> | null;
  scope: string | null;
  idToken: string | null;
  password: string | null;
  createdAt: ColumnType<Date, Date | string, Date | string> | null;
  updatedAt: ColumnType<Date, Date | string, Date | string> | null;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: ColumnType<Date, Date | string, Date | string>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: ColumnType<Date, Date | string, Date | string> | null;
  updatedAt: ColumnType<Date, Date | string, Date | string> | null;
}

export interface AuthVerification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: ColumnType<Date, Date | string, Date | string>;
  createdAt: ColumnType<Date, Date | string, Date | string> | null;
  updatedAt: ColumnType<Date, Date | string, Date | string> | null;
}

export interface File {
  id: string;
  filename: string;
  mimeType: string;
  size: ColumnType<string, string | number | bigint, string | number | bigint>;
  status: string;
  createdAt: ColumnType<Date, Date | string, Date | string> | null;
  updatedAt: ColumnType<Date, Date | string, Date | string> | null;
  etag: string | null;
  updatedByUserId: string | null;
  metadata: JsonValue | null;
}

export interface Todo {
  id: Generated<number>;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: ColumnType<Date, Date | string, Date | string> | null;
  updatedAt: ColumnType<Date, Date | string, Date | string> | null;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean | null;
  image: string | null;
  createdAt: ColumnType<Date, Date | string, Date | string> | null;
  updatedAt: ColumnType<Date, Date | string, Date | string> | null;
}

export interface DB {
  authAccounts: AuthAccount;
  authSessions: AuthSession;
  authVerifications: AuthVerification;
  files: File;
  todos: Todo;
  users: User;
}
