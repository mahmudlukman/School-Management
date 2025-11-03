import { apiSlice } from "../api/apiSlice";

export const libraryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBooks: builder.query({
      query: ({ page = 1, limit = 20, category, search }) => {
        let url = `books?page=${page}&limit=${limit}`;
        if (category) url += `&category=${category}`;
        if (search) url += `&search=${search}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Library", id: "LIST" }],
    }),

    addBook: builder.mutation({
      query: (data) => ({
        url: "add-book",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Library", id: "LIST" }],
    }),

    issueBook: builder.mutation({
      query: (data) => ({
        url: "issue-book",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "BookIssue", id: "LIST" }, { type: "Library", id: "LIST" }],
    }),

    returnBook: builder.mutation({
      query: ({ issueId, data }) => ({
        url: `return-book/${issueId}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "BookIssue", id: "LIST" }, { type: "Library", id: "LIST" }],
    }),

    getBookIssues: builder.query({
      query: ({ studentId, status, bookId }) => {
        let url = "books-issued?";
        if (studentId) url += `studentId=${studentId}&`;
        if (status) url += `status=${status}&`;
        if (bookId) url += `bookId=${bookId}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "BookIssue", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllBooksQuery,
  useAddBookMutation,
  useIssueBookMutation,
  useReturnBookMutation,
  useGetBookIssuesQuery,
} = libraryApi;