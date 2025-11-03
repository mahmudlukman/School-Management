import { apiSlice } from "../api/apiSlice";

export const feeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeeStructures: builder.query({
      query: ({ classId, academicYearId }) => {
        let url = "fee-structure?";
        if (classId) url += `classId=${classId}&`;
        if (academicYearId) url += `academicYearId=${academicYearId}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Fees", id: "LIST" }],
    }),

    createFeeStructure: builder.mutation({
      query: (data) => ({
        url: "create-fee-structure",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Fees", id: "LIST" }],
    }),

    recordPayment: builder.mutation({
      query: (data) => ({
        url: "record-fee-payment",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "FeePayment", id: "LIST" }],
    }),

    getFeePayments: builder.query({
      query: ({ studentId, status, startDate, endDate }) => {
        let url = "fee-payment?";
        if (studentId) url += `studentId=${studentId}&`;
        if (status) url += `status=${status}&`;
        if (startDate && endDate)
          url += `startDate=${startDate}&endDate=${endDate}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "FeePayment", id: "LIST" }],
    }),

    getStudentFeeSummary: builder.query({
      query: (studentId) => ({
        url: `fee-summary/${studentId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "FeePayment", id: "LIST" }],
    }),
  }),
});

export const {
  useGetFeeStructuresQuery,
  useCreateFeeStructureMutation,
  useRecordPaymentMutation,
  useGetFeePaymentsQuery,
  useGetStudentFeeSummaryQuery,
} = feeApi;
