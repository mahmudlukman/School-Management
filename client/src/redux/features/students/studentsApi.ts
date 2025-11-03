import { apiSlice } from "../api/apiSlice";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStudents: builder.query({
      query: ({ page = 1, limit = 10, classId, sectionId, status, search }) => {
        let url = `students?page=${page}&limit=${limit}`;
        if (classId) url += `&classId=${classId}`;
        if (sectionId) url += `&sectionId=${sectionId}`;
        if (status) url += `&status=${status}`;
        if (search) url += `&search=${search}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Student", id: "LIST" }],
    }),

    getStudent: builder.query({
      query: (id) => ({
        url: `student/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (id) => [{ type: "Student", id }],
    }),

    createStudent: builder.mutation({
      query: (data) => ({
        url: "create-student",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),

    updateStudent: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-student/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Student", id },
        { type: "Student", id: "LIST" },
      ],
    }),

    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `delete-student/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),

    bulkUploadStudents: builder.mutation({
      query: (data) => ({
        url: "bulk-upload-students",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),

    promoteStudent: builder.mutation({
      query: ({ studentId, data }) => ({
        url: `promote-student/${studentId}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),

    bulkPromoteStudents: builder.mutation({
      query: (data) => ({
        url: "bulk-promote-students",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),

    graduateStudents: builder.mutation({
      query: (data) => ({
        url: "graduate-students",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),

    transferStudent: builder.mutation({
      query: ({ studentId, data }) => ({
        url: `transfer-student/${studentId}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),
    bulkUpdateStudents: builder.mutation({
      query: (data) => ({
        url: "bulk-update-students",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useBulkUploadStudentsMutation,
  usePromoteStudentMutation,
  useBulkPromoteStudentsMutation,
  useGraduateStudentsMutation,
  useTransferStudentMutation,
  useBulkUpdateStudentsMutation,
} = studentApi;
