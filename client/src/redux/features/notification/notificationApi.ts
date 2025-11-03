import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserNotifications: builder.query({
      query: () => ({
        url: "notifications",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Notification", id: "LIST" }],
    }),

    markAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `mark-as-read/${notificationId}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: "mark-all-as-read",
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;