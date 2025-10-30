export interface RootState {
  auth: {
    user: User | null;
  };
}

export interface User {
  _id: string;
  email: string;
  role: string;
  accountType: "individual" | "company";
  name?: string;
  companyName?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface ServerError {
  status?: number;
  data?: {
    message?: string;
  };
  message?: string;
}
