import axios from 'axios';
import { clearAuthToken, getAuthToken, setAuthToken } from './auth';
import type {
  ApiErrorBody,
  AuthResponse,
  IComment,
  IPost,
  IUser,
  LoginPayload,
  RegistrationPayload,
} from './types';

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4002/api';

export const Axios = axios.create({ baseURL: apiBaseUrl });

Axios.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export class ApiError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly fields: string[];

  constructor(message: string, code = 'REQUEST_FAILED', status?: number, fields: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

const normalizeError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;
    return new ApiError(
      body?.message || 'The server could not complete the request.',
      body?.code,
      error.response?.status,
      body?.details?.fields
    );
  }
  return new ApiError('The server could not be reached.');
};

const request = async <T>(operation: () => Promise<{ data: T }>): Promise<T> => {
  try {
    return (await operation()).data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const registerUser = async (
  payload: RegistrationPayload
): Promise<AuthResponse> => {
  const response = await request(() =>
    Axios.post<AuthResponse>('/users/register', payload)
  );
  setAuthToken(response.token);
  return response;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await request(() =>
    Axios.post<AuthResponse>('/users/login', payload)
  );
  setAuthToken(response.token);
  return response;
};

export const getCurrentUser = (): Promise<IUser> =>
  request(async () => {
    const response = await Axios.get<{ user: IUser }>('/users/me');
    return { data: response.data.user };
  });

export const logoutUser = (): void => clearAuthToken();

export const getUserPosts = (userId: string): Promise<IPost[]> =>
  request(async () => {
    const response = await Axios.get<{ data: { posts: IPost[] } }>(
      `/users/${userId}/posts`
    );
    return { data: response.data.data.posts };
  });

export const createPost = (content: string): Promise<IPost> =>
  request(async () => {
    const response = await Axios.post<{ data: { post: IPost } }>('/posts', {
      content,
    });
    return { data: response.data.data.post };
  });

export const updatePost = (postId: string, content: string): Promise<IPost> =>
  request(async () => {
    const response = await Axios.put<{ data: { post: IPost } }>(
      `/posts/${postId}`,
      { content }
    );
    return { data: response.data.data.post };
  });

export const deletePost = (postId: string): Promise<void> =>
  request(async () => {
    await Axios.delete(`/posts/${postId}`);
    return { data: undefined };
  });

export const getComments = (postId: string): Promise<IComment[]> =>
  request(async () => {
    const response = await Axios.get<{ data: { comments: IComment[] } }>(
      `/posts/${postId}/comments`
    );
    return { data: response.data.data.comments };
  });

export const createComment = (
  postId: string,
  content: string
): Promise<IComment> =>
  request(async () => {
    const response = await Axios.post<{ data: { comment: IComment } }>(
      `/posts/${postId}/comments`,
      { content }
    );
    return { data: response.data.data.comment };
  });

export const updateComment = (
  postId: string,
  commentId: string,
  content: string
): Promise<IComment> =>
  request(async () => {
    const response = await Axios.put<{ data: { comment: IComment } }>(
      `/posts/${postId}/comments/${commentId}`,
      { content }
    );
    return { data: response.data.data.comment };
  });

export const deleteComment = (
  postId: string,
  commentId: string
): Promise<void> =>
  request(async () => {
    await Axios.delete(`/posts/${postId}/comments/${commentId}`);
    return { data: undefined };
  });

export const getErrorMessage = (error: unknown): string =>
  error instanceof ApiError ? error.message : 'Something went wrong.';
