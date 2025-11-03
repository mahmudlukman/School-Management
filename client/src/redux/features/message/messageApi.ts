import { apiSlice } from "../api/apiSlice";

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "send-message",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Message", id: "LIST" }],
    }),

    getInbox: builder.query({
      query: () => ({
        url: "message-inbox",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Message", id: "LIST" }],
    }),

    getSentMessages: builder.query({
      query: () => ({
        url: "message-sent",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Message", id: "SENT" }],
    }),

    markMessageAsRead: builder.mutation({
      query: (messageId) => ({
        url: `mark-message/${messageId}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Message", id: "LIST" }],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetInboxQuery,
  useGetSentMessagesQuery,
  useMarkMessageAsReadMutation,
} = messageApi;
