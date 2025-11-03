import { apiSlice } from "../api/apiSlice";

export const classApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllClasses: builder.query({
      query: () => ({
        url: "classes",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Class", id: "LIST" }],
    }),

    createClass: builder.mutation({
      query: (data) => ({
        url: "create-class",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Class", id: "LIST" }],
    }),

    getSectionsByClass: builder.query({
      query: (classId) => ({
        url: `class-section/${classId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Section", id: "LIST" }],
    }),

    createSection: builder.mutation({
      query: (data) => ({
        url: "create-section",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Section", id: "LIST" }],
    }),
    assignClassTeacher: builder.query({
      query: (classId) => ({
        url: `assign-class-teacher/${classId}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Section", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllClassesQuery,
  useCreateClassMutation,
  useGetSectionsByClassQuery,
  useCreateSectionMutation,
  useAssignClassTeacherQuery
} = classApi;