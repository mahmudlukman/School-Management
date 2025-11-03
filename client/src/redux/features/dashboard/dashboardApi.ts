import { apiSlice } from "../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => ({
        url: "admin-dashboard",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["User", "Student", "Teacher"],
    }),

    getTeacherDashboard: builder.query({
      query: () => ({
        url: "teacher-dashboard",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Teacher", "Class", "Subject"],
    }),

    getStudentDashboard: builder.query({
      query: () => ({
        url: "student-dashboard",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Student", "Attendance", "Homework"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetTeacherDashboardQuery,
  useGetStudentDashboardQuery,
} = dashboardApi;