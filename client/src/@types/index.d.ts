export interface RootState {
  auth: {
    user: User | null;
  };
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  role: 'super_admin' | 'admin' | 'principal' | 'teacher' | 'student' | 'parent' | 'accountant' | 'librarian' | 'receptionist';
  isActive: boolean;
  profileId?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServerError {
  status?: number;
  data?: {
    message?: string;
  };
  message?: string;
}
