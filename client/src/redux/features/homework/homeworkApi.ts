import { apiSlice } from "../api/apiSlice";

export const homeworkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllHomework: builder.query({
      query: ({ classId, sectionId, subjectId }) => {
        let url = "homework?";
        if (classId) url += `classId=${classId}&`;
        if (sectionId) url += `sectionId=${sectionId}&`;
        if (subjectId) url += `subjectId=${subjectId}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Homework", id: "LIST" }],
    }),

    createHomework: builder.mutation({
      query: (data) => ({
        url: "create-homework",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Homework", id: "LIST" }],
    }),

    submitHomework: builder.mutation({
      query: (data) => ({
        url: "submit-homework",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "HomeworkSubmission", id: "LIST" }],
    }),

    gradeHomework: builder.mutation({
      query: ({ submissionId, data }) => ({
        url: `grade-homework/${submissionId}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "HomeworkSubmission", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllHomeworkQuery,
  useCreateHomeworkMutation,
  useSubmitHomeworkMutation,
  useGradeHomeworkMutation,
} = homeworkApi;
