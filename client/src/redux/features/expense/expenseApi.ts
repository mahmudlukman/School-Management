import { apiSlice } from "../api/apiSlice";

export const expenseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllExpenses: builder.query({
      query: ({
        page = 1,
        limit = 10,
        category,
        startDate,
        endDate,
        paymentMethod,
      }) => {
        let url = `expenses?page=${page}&limit=${limit}`;
        if (category) url += `&category=${category}`;
        if (startDate && endDate)
          url += `&startDate=${startDate}&endDate=${endDate}`;
        if (paymentMethod) url += `&paymentMethod=${paymentMethod}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Expenses", id: "LIST" }],
    }),

    getExpense: builder.query({
      query: (id) => ({
        url: `expense/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (id) => [{ type: "Expenses", id }],
    }),

    createExpense: builder.mutation({
      query: (data) => ({
        url: "create-expense",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Expenses", id: "LIST" }],
    }),

    updateExpense: builder.mutation({
      query: ({ id, data }) => ({
        url: `update-expense/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Expenses", id: "LIST" }],
    }),

    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `delete-expense/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Expenses", id: "LIST" }],
    }),

    getExpenseSummary: builder.query({
      query: ({ startDate, endDate }) => {
        let url = "expenses-summary?";
        if (startDate && endDate)
          url += `startDate=${startDate}&endDate=${endDate}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Expenses", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpenseSummaryQuery,
} = expenseApi;
