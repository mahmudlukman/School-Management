import { apiSlice } from "../api/apiSlice";

export const teacherApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeachers: builder.query({
      query: ({ page = 1, limit = 10, search }) => {
        let url = `teachers?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Teacher", id: "LIST" }],
    }),

    getTeacher: builder.query({
      query: (id) => ({
        url: `teacher/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (id) => [{ type: "Teacher", id }],
    }),

    createTeacher: builder.mutation({
      query: (data) => ({
        url: "create-teacher",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Teacher", id: "LIST" }],
    }),

    updateTeacher: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-teacher/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Teacher", id },
        { type: "Teacher", id: "LIST" },
      ],
    }),

    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `delete-teacher/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Teacher", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllTeachersQuery,
  useGetTeacherQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
