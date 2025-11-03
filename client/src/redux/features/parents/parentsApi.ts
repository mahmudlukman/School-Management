import { apiSlice } from "../api/apiSlice";

export const parentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllParents: builder.query({
      query: ({ page = 1, limit = 10, search }) => {
        let url = `parents?page=${page}&limit=${limit}`;
        if (search) url += `&search=${search}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Parent", id: "LIST" }],
    }),

    getParent: builder.query({
      query: (id) => ({
        url: `parent/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (id) => [{ type: "Parent", id }],
    }),
    createParent: builder.mutation({
      query: (data) => ({
        url: "create-parent",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Parent", id: "LIST" }],
    }),

    updateParent: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-parent/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Parent", id },
        { type: "Parent", id: "LIST" },
      ],
    }),

    deleteParent: builder.mutation({
      query: (id) => ({
        url: `delete-parent/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Parent", id: "LIST" }],
    }),

    linkToStudent: builder.mutation({
      query: (data) => ({
        url: "link-student",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Parent", id: "LIST" }, { type: "Student", id: "LIST" }],
    }),

    unlinkFromStudent: builder.mutation({
      query: (data) => ({
        url: "unlink-student",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Parent", id: "LIST" }, { type: "Student", id: "LIST" }],
    }),

    getChildrenInfo: builder.query({
      query: () => ({
        url: "children-info",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Student", id: "LIST" }],
    }),

    getChildAttendance: builder.query({
      query: ({ studentId, startDate, endDate }) => {
        let url = `child-attendance/${studentId}`;
        if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Attendance", id: "LIST" }],
    }),

    getChildResults: builder.query({
      query: (studentId) => ({
        url: `child-results/${studentId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Result", id: "LIST" }],
    }),

    getChildFeeSummary: builder.query({
      query: (studentId) => ({
        url: `child-fees-summary/${studentId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "FeePayment", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllParentsQuery,
  useGetParentQuery,
  useCreateParentMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
  useLinkToStudentMutation,
  useUnlinkFromStudentMutation,
  useGetChildrenInfoQuery,
  useGetChildAttendanceQuery,
  useGetChildResultsQuery,
  useGetChildFeeSummaryQuery,
} = parentApi;