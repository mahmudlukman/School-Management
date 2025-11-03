import { apiSlice } from "../api/apiSlice";

export const transportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransports: builder.query({
      query: ({ isActive, vehicleType, search }) => {
        let url = "transports?";
        if (isActive !== undefined) url += `isActive=${isActive}&`;
        if (vehicleType) url += `vehicleType=${vehicleType}&`;
        if (search) url += `search=${search}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Transport", id: "LIST" }],
    }),

    getTransport: builder.query({
      query: (id) => ({
        url: `transport/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (id) => [{ type: "Transport", id }],
    }),

    createTransport: builder.mutation({
      query: (data) => ({
        url: "create-transport",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Transport", id: "LIST" }],
    }),

    updateTransport: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-transport/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Transport", id: "LIST" }],
    }),

    deleteTransport: builder.mutation({
      query: (id) => ({
        url: `delete-transport/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Transport", id: "LIST" }],
    }),

    assignStudent: builder.mutation({
      query: (data) => ({
        url: "assign-transport",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Transport", id: "LIST" }],
    }),

    unassignStudent: builder.mutation({
      query: (assignmentId) => ({
        url: `unassign-transport/${assignmentId}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Transport", id: "LIST" }],
    }),

    getTransportAssignments: builder.query({
      query: ({ transportId, studentId, isActive }) => {
        let url = "transport-assignments?";
        if (transportId) url += `transportId=${transportId}&`;
        if (studentId) url += `studentId=${studentId}&`;
        if (isActive !== undefined) url += `isActive=${isActive}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Transport", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllTransportsQuery,
  useGetTransportQuery,
  useCreateTransportMutation,
  useUpdateTransportMutation,
  useDeleteTransportMutation,
  useAssignStudentMutation,
  useUnassignStudentMutation,
  useGetTransportAssignmentsQuery,
} = transportApi;