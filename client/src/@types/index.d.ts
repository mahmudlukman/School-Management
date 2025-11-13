export interface RootState {
  auth: {
    user: User | null;
  };
}

export interface User {
  _id: string;
  email: string;
  name?: string;
  role:
    | "super_admin"
    | "admin"
    | "principal"
    | "teacher"
    | "student"
    | "parent"
    | "accountant"
    | "librarian"
    | "receptionist";
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

export interface AcademicYear {
  year: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: Date;
}


export interface Attendance {
  _id: string;
  date: Date;
  status: string;
}

export interface Student {
  _id: string;
  userId: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  bloodGroup?: string;
  religion?: string;
  nationality: string;
  address: string;
  phone?: string;
  email?: string;
  classId: Types.ObjectId;
  sectionId: Types.ObjectId;
  rollNumber: number;
  admissionDate: Date;
  photo?: IPhoto;
  parentIds: Types.ObjectId[];
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
  previousSchool?: string;
  status: "active" | "inactive" | "graduated" | "transferred";
}

export interface FeePayment {
  _id: string;
  studentId: string;
  feeStructureId: string;
  amountPaid: number;
  paymentDate: Date;
  paymentMethod: string;
  transactionId?: string;
  status: FeeStatus;
  discount?: number;
  remarks?: string;
  receivedBy: string;
}

export interface Expense {
  _id: string;
  category: string;
  description: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  receipt?: string;
  approvedBy: string;
  remarks?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location?: string;
  eventType: string;
  createdBy: string;
}

