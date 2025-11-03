import { apiSlice } from "../api/apiSlice";

export const leaveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyLeave: builder.mutation({
      query: (data) => ({
        url: "apply-for-leave",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Leave", id: "LIST" }],
    }),

    getAllLeaves: builder.query({
      query: ({ status, userRole, userId }) => {
        let url = "leaves?";
        if (status) url += `status=${status}&`;
        if (userRole) url += `userRole=${userRole}&`;
        if (userId) url += `userId=${userId}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Leave", id: "LIST" }],
    }),

    updateLeaveStatus: builder.mutation({
      query: ({ leaveId, data }) => ({
        url: `update-leave-status/${leaveId}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Leave", id: "LIST" }],
    }),
  }),
});

export const {
  useApplyLeaveMutation,
  useGetAllLeavesQuery,
  useUpdateLeaveStatusMutation,
} = leaveApi;
