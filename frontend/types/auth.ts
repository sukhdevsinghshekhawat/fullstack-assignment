export interface GuestUser {
  id: string;
  email: string | null;
  name: string | null;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuestLoginResponse {
  success: boolean;
  user: GuestUser;
  message: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}