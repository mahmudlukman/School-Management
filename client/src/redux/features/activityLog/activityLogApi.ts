import { apiSlice } from "../api/apiSlice";

export const activityLogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query({
      query: ({
        page = 1,
        limit = 20,
        userId,
        module,
        action,
        startDate,
        endDate,
      }) => {
        let url = `activity-logs?page=${page}&limit=${limit}`;
        if (userId) url += `&userId=${userId}`;
        if (module) url += `&module=${module}`;
        if (action) url += `&action=${action}`;
        if (startDate && endDate)
          url += `&startDate=${startDate}&endDate=${endDate}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "ActivityLog", id: "LIST" }],
    }),
    activityStatistics: builder.query({
      query: () => ({
        url: "activity-logs-statistics",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["ActivityLog"],
    }),
    userActivityLogs: builder.query({
      query: (userId) => ({
        url: `user-activity-logs/${userId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["ActivityLog"],
    }),
    activityLogsByModule: builder.query({
      query: (module) => ({
        url: `activity-logs-by-module/${module}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["ActivityLog"],
    }),
    exportActivityLogs: builder.query({
      query: () => ({
        url: "export-activity-logs",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["ActivityLog"],
    }),
    activityLog: builder.query({
      query: (id) => ({
        url: `activity-log/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["ActivityLog"],
    }),
    deleteOldActivityLogs: builder.query({
      query: () => ({
        url: "cleanup-activity-logs",
        method: "DELETE",
        credentials: "include" as const,
      }),
      providesTags: ["ActivityLog"],
    }),
  }),
});

export const { useGetActivityLogsQuery } = activityLogApi;
