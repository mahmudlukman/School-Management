import { apiSlice } from "../api/apiSlice";

export const complaintApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllComplaints: builder.query({
      query: ({ page = 1, limit = 10, status, category, priority }) => {
        let url = `complaints?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (category) url += `&category=${category}`;
        if (priority) url += `&priority=${priority}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Complaint", id: "LIST" }],
    }),

    getMyComplaints: builder.query({
      query: () => ({
        url: "my-complaints",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Complaint", id: "MY" }],
    }),

    getComplaint: builder.query({
      query: (id) => ({
        url: `complaint/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (id) => [{ type: "Complaint", id }],
    }),

    submitComplaint: builder.mutation({
      query: (data) => ({
        url: "submit-complaint",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Complaint", id: "LIST" }],
    }),

    assignComplaint: builder.mutation({
      query: (data) => ({
        url: "assign-complaint",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Complaint", id: "LIST" }],
    }),

    updateComplaintStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-complaints-status/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Complaint", id: "LIST" }],
    }),

    deleteComplaint: builder.mutation({
      query: (id) => ({
        url: `delete-complaint/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Complaint", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllComplaintsQuery,
  useGetMyComplaintsQuery,
  useGetComplaintQuery,
  useSubmitComplaintMutation,
  useAssignComplaintMutation,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,
} = complaintApi;
