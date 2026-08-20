export interface GuestUser {
  id: string;
  email: string | null;
  name: string | null;
  fullName: string | null;
  title: string | null;
  username: string | null;
  avatarUrl: string | null;
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

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'OWNER' | 'MEMBER';
  joinedAt: string;
  workspace: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateProfileInput {
  fullName?: string;
  title?: string;
  username?: string;
  avatarUrl?: string;
}
