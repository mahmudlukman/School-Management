import { apiSlice } from "../api/apiSlice";

export const timetableApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTimetable: builder.query({
      query: ({ classId, sectionId, academicYearId }) => ({
        url: `timetable?classId=${classId}&sectionId=${sectionId}&academicYearId=${academicYearId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Timetable", id: "LIST" }],
    }),

    upsertTimetable: builder.mutation({
      query: (data) => ({
        url: "upsert-timetable",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Timetable", id: "LIST" }],
    }),

    getTeacherTimetable: builder.query({
      query: ({ teacherId, academicYearId }) => ({
        url: `teacher-timetable?teacherId=${teacherId}&academicYearId=${academicYearId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Timetable", id: "TEACHER" }],
    }),
  }),
});

export const {
  useGetTimetableQuery,
  useUpsertTimetableMutation,
  useGetTeacherTimetableQuery,
} = timetableApi;
