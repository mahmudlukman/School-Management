// redux/features/class/classApi.ts
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

    updateClass: builder.mutation({
      query: (data) => ({
        url: `update-class/${data.id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Class", id: "LIST" }],
    }),

    deleteClass: builder.mutation({
      query: (id) => ({
        url: `delete-class/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Class", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllClassesQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;
