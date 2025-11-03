import { apiSlice } from "../api/apiSlice";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: ({ eventType, startDate, endDate }) => {
        let url = "events?";
        if (eventType) url += `eventType=${eventType}&`;
        if (startDate && endDate) url += `startDate=${startDate}&endDate=${endDate}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Event", id: "LIST" }],
    }),

    createEvent: builder.mutation({
      query: (data) => ({
        url: "create-event",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),

    updateEvent: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-event/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),

    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `delete-event/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;