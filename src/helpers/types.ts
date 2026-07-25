export interface IUser {
  _id: string;
  username: string;
  email: string;
  followers: string[];
  followings: string[];
  blocks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: IUser;
  message?: string;
}

export interface RegistrationPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface IAuthor {
  _id: string;
  username: string;
  email: string;
}

export interface IPost {
  _id: string;
  content: string;
  author: IAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  content: string;
  author: IAuthor;
  post: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorBody {
  status: 'error';
  code: string;
  message: string;
  details?: { fields?: string[] };
}

export interface IContext {
  account: IUser;
  setAccount: (account: IUser) => void;
}

export interface IAccount extends IUser {
  posts: IPost[];
  connection: {
    followsMe: boolean;
    following: boolean;
    requested: boolean;
  };
}

export interface IResponse {
  status: string;
  message?: string;
  user?: IUser;
  payload?: unknown;
}

export interface IChange {
  old?: string;
  newpwd?: string;
  password?: string;
  login?: string;
}
