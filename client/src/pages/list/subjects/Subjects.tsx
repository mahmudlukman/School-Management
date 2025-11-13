import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { ServerError, Subject } from "../../../@types";
import Pagination from "../../../components/Pagination";
import Tooltip from "../../../components/Tooltip";
import Loading from "../../../components/Loading";
import DeleteAlert from "../../../components/DeleteAlert";
import {
  useDeleteSubjectMutation,
  useGetAllSubjectsQuery,
} from "../../../redux/features/subject/subjectApi";

const Subjects = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const limit = 10;
  const navigate = useNavigate();

  // Fetch subjects
  const { data, isLoading, isError, refetch } = useGetAllSubjectsQuery({
    page,
    limit,
    search: searchTerm || undefined,
  });

  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  const total = data?.pagination?.total || 0;

  const handleDeleteClick = (id: string) => setDeleteSubjectId(id);
  const handleCancelDelete = () => setDeleteSubjectId(null);

  const handleConfirmDelete = async () => {
    if (!deleteSubjectId) return;
    try {
      await deleteSubject(deleteSubjectId).unwrap();
      toast.success("Subject deleted successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete subject");
    } finally {
      setDeleteSubjectId(null);
    }
  };

  // Filter subjects on frontend
  const filteredSubjects = useMemo(() => {
    const subjects = data?.subjects || [];
    return subjects.filter((subject: Subject) => {
      const matchSearch =
        searchTerm.trim() === "" ||
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.teacherId?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        subject.teacherId?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchYear =
        filterYear === "all" ||
        subject.classId?.academicYearId?.year === filterYear;

      return matchSearch && matchYear;
    });
  }, [data?.subjects, searchTerm, filterYear]);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load subjects.
      </div>
    );
  }

  return (
    <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-slate-600 font-semibold">
          Manage <span className="text-slate-800 font-bold">Subjects</span>
        </h1>

        <button
          onClick={() => navigate("/subjects/create")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition"
        >
          <Plus size={16} /> Add New Subject
        </button>
      </div>

      {/* Filter + Search */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <select
          value={filterYear}
          onChange={(e) => {
            setFilterYear(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 text-sm rounded-lg px-4 py-2 text-gray-700 bg-gray-50"
        >
          <option value="all">All Academic Years</option>
          {[
            ...new Set(
              (data?.subjects ?? []).map(
                (s: any) => s.classId?.academicYearId?.year as string
              )
            ),
          ]
            .filter(Boolean)
            .map((year: string) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
        >
          <Search size={16} className="text-slate-600" />
          <input
            type="text"
            placeholder="Search by subject, code, or teacher"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none placeholder-slate-600"
          />
        </form>
      </div>

      {/* Table */}
      <table className="w-full text-left ring ring-slate-200 rounded overflow-hidden text-sm">
        <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Subject Name</th>
            <th className="px-4 py-3 hidden md:table-cell">Code</th>
            <th className="px-4 py-3 hidden lg:table-cell">Class</th>
            <th className="px-4 py-3 hidden lg:table-cell">Academic Year</th>
            <th className="px-4 py-3 hidden xl:table-cell">Teacher</th>
            <th className="px-4 py-3 hidden xl:table-cell">Created</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="text-slate-700">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject: Subject) => (
              <tr
                key={subject._id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {subject.name}
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  {subject.code || "—"}
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  {subject.classId?.name || "—"}
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  {subject.classId?.academicYearId?.year || "—"}
                </td>

                <td className="px-4 py-3 hidden xl:table-cell">
                  {subject.teacherId ? (
                    <span className="text-slate-700">
                      {subject.teacherId.firstName} {subject.teacherId.lastName}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-4 py-3 hidden xl:table-cell">
                  {subject.createdAt
                    ? format(new Date(subject.createdAt), "dd MMM yyyy")
                    : "N/A"}
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <Tooltip text="View Subject" position="bottom">
                      <button
                        onClick={() => navigate(`/subjects/${subject._id}`)}
                        className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                      >
                        <Eye size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Edit Subject" position="bottom">
                      <button
                        onClick={() =>
                          navigate(`/subjects/edit/${subject._id}`)
                        }
                        className="p-2 rounded-full hover:bg-yellow-200 text-yellow-600 transition"
                      >
                        <Pencil size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete Subject" position="bottom">
                      <button
                        onClick={() => handleDeleteClick(subject._id)}
                        disabled={isDeleting}
                        className="p-2 rounded-full hover:bg-red-200 text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                No subjects found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        page={page}
        count={total}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Delete Confirmation Modal */}
      {deleteSubjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 cursor-pointer bg-black/20"
            onClick={handleCancelDelete}
          ></div>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Deletion
              </h3>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <DeleteAlert
              content="Are you sure you want to delete this subject? This action cannot be undone."
              onDelete={handleConfirmDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
