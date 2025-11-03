import { apiSlice } from "../api/apiSlice";

export const certificateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCertificates: builder.query({
      query: ({ page = 1, limit = 10, studentId, certificateType, status }) => {
        let url = `certificates?page=${page}&limit=${limit}`;
        if (studentId) url += `&studentId=${studentId}`;
        if (certificateType) url += `&certificateType=${certificateType}`;
        if (status) url += `&status=${status}`;
        return {
          url,
          method: "GET",
          credentials: "include" as const,
        };
      },
      providesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    getCertificate: builder.query({
      query: (id) => ({
        url: `certificate/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (id) => [{ type: "Certificate", id }],
    }),

    getCertificateByNumber: builder.query({
      query: (certificateNumber) => ({
        url: `certificate-by-number/${certificateNumber}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    issueCertificate: builder.mutation({
      query: (data) => ({
        url: "issue-certificate",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    revokeCertificate: builder.mutation({
      query: (id) => ({
        url: `revoke-certificate/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    getStudentCertificates: builder.query({
      query: (studentId) => ({
        url: `student-certificate/${studentId}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: [{ type: "Certificate", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllCertificatesQuery,
  useGetCertificateQuery,
  useGetCertificateByNumberQuery,
  useIssueCertificateMutation,
  useRevokeCertificateMutation,
  useGetStudentCertificatesQuery,
} = certificateApi;