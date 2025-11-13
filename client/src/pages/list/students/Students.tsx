import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Pagination from "../../../components/Pagination";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Tooltip from "../../../components/Tooltip";
import Loading from "../../../components/Loading";
import type { ServerError, Student } from "../../../@types";
import {
  useDeleteStudentMutation,
  useGetAllStudentsQuery,
} from "../../../redux/features/students/studentsApi";
import DeleteAlert from "../../../components/DeleteAlert";
import toast from "react-hot-toast";

const Students = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const limit = 10;
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetAllStudentsQuery({
    page,
    limit,
    status: filterStatus !== "all" ? filterStatus : undefined,
    search: searchTerm || undefined,
  });

  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  const total = data?.pagination?.total || 0;
  const navigate = useNavigate();

  const handleDeleteClick = (id: string) => setDeleteStudentId(id);
  const handleCancelDelete = () => setDeleteStudentId(null);
  const handleConfirmDelete = async () => {
    if (!deleteStudentId) return;
    try {
      await deleteStudent(deleteStudentId).unwrap();
      toast.success("Generator deleted successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete student");
    } finally {
      setDeleteStudentId(null);
    }
  };

  // Filter students on frontend if needed (for additional filtering)
  const filteredStudents = useMemo(() => {
    const students = data?.students || [];
    return students.filter((student: Student) => {
      // Additional client-side filtering if needed
      if (searchTerm.trim() !== "") {
        const search = searchTerm.toLowerCase();
        const fullName =
          `${student.firstName} ${student.lastName}`.toLowerCase();
        const admissionNo = student.admissionNumber?.toLowerCase() || "";
        const className = student.classId?.name?.toLowerCase() || "";
        const sectionName = student.sectionId?.name?.toLowerCase() || "";

        return (
          fullName.includes(search) ||
          admissionNo.includes(search) ||
          className.includes(search) ||
          sectionName.includes(search)
        );
      }
      return true;
    });
  }, [data?.students, searchTerm]);

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
        Failed to load students.
      </div>
    );
  }

  return (
    <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-slate-600 font-semibold">
          Manage <span className="text-slate-800 font-bold">Students</span>
        </h1>

        <button
          onClick={() => navigate("/students/create")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition"
        >
          <Plus size={16} /> Add New Student
        </button>
      </div>

      {/* Filter + Search */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1); // Reset to first page when filter changes
          }}
          className="border border-gray-300 text-sm rounded-lg px-4 py-2 text-gray-700 bg-gray-50"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="graduated">Graduated</option>
          <option value="transferred">Transferred</option>
        </select>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
        >
          <Search size={16} className="text-slate-600" />
          <input
            type="text"
            placeholder="Search by name, Admission No, etc."
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
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 hidden md:table-cell">Admission No</th>
            <th className="px-4 py-3 hidden md:table-cell">Class</th>
            <th className="px-4 py-3 hidden md:table-cell">Section</th>
            <th className="px-4 py-3 hidden lg:table-cell">Admission Date</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="text-slate-700">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student: Student) => (
              <tr
                key={student._id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                {/* Name */}
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{student.email}</p>
                    <p className="text-xs text-slate-500">
                      Roll No: {student.rollNumber}
                    </p>
                  </div>
                </td>

                {/* Admission Number */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="font-mono text-slate-700">
                    {student.admissionNumber}
                  </span>
                </td>

                {/* Class */}
                <td className="px-4 py-3 hidden md:table-cell">
                  {student.classId?.name || "N/A"}
                </td>

                {/* Section */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {student.sectionId?.name || "N/A"}
                  </span>
                </td>

                {/* Admission Date */}
                <td className="px-4 py-3 hidden lg:table-cell">
                  {student.admissionDate
                    ? format(new Date(student.admissionDate), "dd MMM yyyy")
                    : "N/A"}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === "active"
                        ? "bg-green-100 text-green-700"
                        : student.status === "inactive"
                        ? "bg-gray-100 text-gray-700"
                        : student.status === "graduated"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Tooltip text="View Student" position="bottom">
                      <button
                        onClick={() => navigate(`/students/${student._id}`)}
                        className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                      >
                        <Eye size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Edit Student" position="bottom">
                      <button
                        onClick={() =>
                          navigate(`/students/edit/${student._id}`)
                        }
                        className="p-2 rounded-full hover:bg-yellow-200 text-yellow-600 transition"
                      >
                        <Pencil size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete Student" position="bottom">
                      <button
                        onClick={() => handleDeleteClick(student._id)}
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
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <Pagination
        page={page}
        count={total}
        onPageChange={(newPage) => setPage(newPage)}
      />
      {/* Delete Confirmation Modal */}
      {deleteStudentId && (
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
              content="Are you sure you want to delete this generator? This action cannot be undone."
              onDelete={handleConfirmDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
