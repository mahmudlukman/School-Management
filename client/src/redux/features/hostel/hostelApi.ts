import { apiSlice } from "../api/apiSlice";

export const hostelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllHostels: builder.query({
      query: ({ type }) => {
        let url = "hostels?";
        if (type) url += `type=${type}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Hostel", id: "LIST" }],
    }),

    getHostel: builder.query({
      query: (id) => ({
        url: `hostel/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (id) => [{ type: "Hostel", id }],
    }),

    createHostel: builder.mutation({
      query: (data) => ({
        url: "create-hostel",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Hostel", id: "LIST" }],
    }),

    updateHostel: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-hostel/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Hostel", id: "LIST" }],
    }),

    deleteHostel: builder.mutation({
      query: (id) => ({
        url: `delete-hostel/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Hostel", id: "LIST" }],
    }),

    createRoom: builder.mutation({
      query: (data) => ({
        url: "create-room",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Hostel", id: "LIST" }],
    }),

    getRoomsByHostel: builder.query({
      query: ({ hostelId, isAvailable, roomType }) => {
        let url = `hostel-rooms/${hostelId}?`;
        if (isAvailable !== undefined) url += `isAvailable=${isAvailable}&`;
        if (roomType) url += `roomType=${roomType}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Hostel", id: "LIST" }],
    }),

    updateRoom: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-room/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Hostel", id: "LIST" }],
    }),

    assignStudentToRoom: builder.mutation({
      query: (data) => ({
        url: "assign-room",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Hostel", id: "LIST" }],
    }),

    unassignStudentFromRoom: builder.mutation({
      query: (assignmentId) => ({
        url: `unassign-room/${assignmentId}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Hostel", id: "LIST" }],
    }),

    getHostelAssignments: builder.query({
      query: ({ hostelId, studentId, isActive }) => {
        let url = "hostels-assignments?";
        if (hostelId) url += `hostelId=${hostelId}&`;
        if (studentId) url += `studentId=${studentId}&`;
        if (isActive !== undefined) url += `isActive=${isActive}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Hostel", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllHostelsQuery,
  useGetHostelQuery,
  useCreateHostelMutation,
  useUpdateHostelMutation,
  useDeleteHostelMutation,
  useCreateRoomMutation,
  useGetRoomsByHostelQuery,
  useUpdateRoomMutation,
  useAssignStudentToRoomMutation,
  useUnassignStudentFromRoomMutation,
  useGetHostelAssignmentsQuery,
} = hostelApi;