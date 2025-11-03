import { apiSlice } from "../api/apiSlice";

export const examApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllExams: builder.query({
      query: ({ classId, academicYearId, type }) => {
        let url = "exams?";
        if (classId) url += `classId=${classId}&`;
        if (academicYearId) url += `academicYearId=${academicYearId}&`;
        if (type) url += `type=${type}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Examination", id: "LIST" }],
    }),

    createExam: builder.mutation({
      query: (data) => ({
        url: "create-exams",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Examination", id: "LIST" }],
    }),

    createExamSchedule: builder.mutation({
      query: (data) => ({
        url: "create-exams-schedule",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "ExamSchedule", id: "LIST" }],
    }),

    getExamSchedule: builder.query({
      query: (examId) => ({
        url: `exams-schedule/${examId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "ExamSchedule", id: "LIST" }],
    }),

    addResult: builder.mutation({
      query: (data) => ({
        url: "add-result",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Result", id: "LIST" }],
    }),

    getResults: builder.query({
      query: ({ examId, studentId, subjectId }) => {
        let url = "results?";
        if (examId) url += `examId=${examId}&`;
        if (studentId) url += `studentId=${studentId}&`;
        if (subjectId) url += `subjectId=${subjectId}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Result", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllExamsQuery,
  useCreateExamMutation,
  useCreateExamScheduleMutation,
  useGetExamScheduleQuery,
  useAddResultMutation,
  useGetResultsQuery,
} = examApi;
