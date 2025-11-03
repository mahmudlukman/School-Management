import { apiSlice } from "../api/apiSlice";

export const announcementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAnnouncements: builder.query({
      query: ({ priority, isActive }) => {
        let url = "announcements?";
        if (priority) url += `priority=${priority}&`;
        if (isActive !== undefined) url += `isActive=${isActive}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Announcement", id: "LIST" }],
    }),

    createAnnouncement: builder.mutation({
      query: (data) => ({
        url: "create-announcement",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),

    updateAnnouncement: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-announcement/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),

    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `delete-announcement/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementApi;
