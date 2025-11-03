import { apiSlice } from "../api/apiSlice";

export const academicYearApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAcademicYears: builder.query({
      query: () => ({
        url: "academic-years",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "AcademicYear", id: "LIST" }],
    }),

    getCurrentAcademicYear: builder.query({
      query: () => ({
        url: "current-academic-year",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "AcademicYear", id: "LIST" }],
    }),

    getAcademicYear: builder.query({
      query: (id) => ({
        url: `academic-year/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (id) => [{ type: "AcademicYear", id }],
    }),

    createAcademicYear: builder.mutation({
      query: (data) => ({
        url: "create-academic-year",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "AcademicYear", id: "LIST" }],
    }),

    updateAcademicYear: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-academic-year/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "AcademicYear", id: "LIST" }],
    }),

    setCurrentAcademicYear: builder.mutation({
      query: (id) => ({
        url: `set-current-academic-year/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: [
        { type: "AcademicYear", id: "LIST" },
        { type: "AcademicYear", id: "LIST" },
      ],
    }),

    deleteAcademicYear: builder.mutation({
      query: (id) => ({
        url: `delete-academic-year/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "AcademicYear", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllAcademicYearsQuery,
  useGetCurrentAcademicYearQuery,
  useGetAcademicYearQuery,
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
  useSetCurrentAcademicYearMutation,
  useDeleteAcademicYearMutation,
} = academicYearApi;
