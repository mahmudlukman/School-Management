// ==================== ENUMS ====================
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  PRINCIPAL = "principal",
  TEACHER = "teacher",
  STUDENT = "student",
  PARENT = "parent",
  ACCOUNTANT = "accountant",
  LIBRARIAN = "librarian",
  RECEPTIONIST = "receptionist",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
  EXCUSED = "excused",
}

export enum ExamType {
  MIDTERM = "midterm",
  FINAL = "final",
  QUIZ = "quiz",
  ASSIGNMENT = "assignment",
  PROJECT = "project",
}

export enum FeeStatus {
  PAID = "paid",
  PENDING = "pending",
  OVERDUE = "overdue",
  PARTIAL = "partial",
}

export enum LeaveStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}


export interface IPhoto {
  public_id: string;
  url: string;
}
