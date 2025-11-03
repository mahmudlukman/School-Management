import { apiSlice } from "../api/apiSlice";

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubjects: builder.query({
      query: ({ classId }) => {
        let url = "subjects";
        if (classId) url += `?classId=${classId}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Subject", id: "LIST" }],
    }),

    createSubject: builder.mutation({
      query: (data) => ({
        url: "create-subject",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Subject", id: "LIST" }],
    }),

    assignTeacher: builder.mutation({
      query: ({ subjectId, data }) => ({
        url: `assign-teacher/${subjectId}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Subject", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllSubjectsQuery,
  useCreateSubjectMutation,
  useAssignTeacherMutation,
} = subjectApi;