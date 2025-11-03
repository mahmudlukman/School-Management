import { apiSlice } from "../api/apiSlice";

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    markAttendance: builder.mutation({
      query: (data) => ({
        url: "mark-attendance",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Attendance", id: "LIST" }],
    }),

    getAttendance: builder.query({
      query: ({ classId, sectionId, date, startDate, endDate }) => {
        let url = "attendance?";
        if (classId) url += `classId=${classId}&`;
        if (sectionId) url += `sectionId=${sectionId}&`;
        if (date) url += `date=${date}&`;
        if (startDate && endDate)
          url += `startDate=${startDate}&endDate=${endDate}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Attendance", id: "LIST" }],
    }),

    getStudentAttendanceReport: builder.query({
      query: ({ studentId, startDate, endDate }) => ({
        url: `attendance-report/${studentId}?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Attendance", id: "LIST" }],
    }),

    updateAttendance: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-attendance/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Attendance", id: "LIST" }],
    }),
  }),
});

export const {
  useMarkAttendanceMutation,
  useGetAttendanceQuery,
  useGetStudentAttendanceReportQuery,
  useUpdateAttendanceMutation,
} = attendanceApi;
