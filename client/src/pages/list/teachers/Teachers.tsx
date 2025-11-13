import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  useDeleteTeacherMutation,
  useGetAllTeachersQuery,
} from "../../../redux/features/teachers/teachersApi";
import type { ServerError, Teacher } from "../../../@types";
import Pagination from "../../../components/Pagination";
import Tooltip from "../../../components/Tooltip";
import Loading from "../../../components/Loading";
import DeleteAlert from "../../../components/DeleteAlert";

const Teachers = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteTeacherId, setDeleteTeacherId] = useState<string | null>(null);
  const limit = 10;
  const navigate = useNavigate();

  // Fetch teachers
  const { data, isLoading, isError, refetch } = useGetAllTeachersQuery({
    page,
    limit,
    search: searchTerm || undefined,
  });

  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const total = data?.pagination?.total || 0;

  const handleDeleteClick = (id: string) => setDeleteTeacherId(id);
  const handleCancelDelete = () => setDeleteTeacherId(null);
  const handleConfirmDelete = async () => {
    if (!deleteTeacherId) return;
    try {
      await deleteTeacher(deleteTeacherId).unwrap();
      toast.success("Teacher deleted successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete teacher");
    } finally {
      setDeleteTeacherId(null);
    }
  };

  // Filter teachers on frontend
  const filteredTeachers = useMemo(() => {
    const teachers = data?.teachers || [];
    return teachers.filter((teacher: Teacher) => {
      if (searchTerm.trim() !== "") {
        const search = searchTerm.toLowerCase();
        const fullName =
          `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
        const email = teacher.email?.toLowerCase() || "";
        const employeeId = teacher.employeeId?.toLowerCase() || "";
        const phone = teacher.phone?.toLowerCase() || "";

        return (
          fullName.includes(search) ||
          email.includes(search) ||
          employeeId.includes(search) ||
          phone.includes(search)
        );
      }
      return true;
    });
  }, [data?.teachers, searchTerm]);

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
        Failed to load teachers.
      </div>
    );
  }

  return (
    <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-slate-600 font-semibold">
          Manage <span className="text-slate-800 font-bold">Teachers</span>
        </h1>

        <button
          onClick={() => navigate("/teachers/create")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition"
        >
          <Plus size={16} /> Add New Teacher
        </button>
      </div>

      {/* Filter + Search */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 text-sm rounded-lg px-4 py-2 text-gray-700 bg-gray-50"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="onleave">On Leave</option>
        </select>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
        >
          <Search size={16} className="text-slate-600" />
          <input
            type="text"
            placeholder="Search by name, ID, or email"
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
            <th className="px-4 py-3 hidden md:table-cell">Employee ID</th>
            <th className="px-4 py-3 hidden md:table-cell">Subjects</th>
            <th className="px-4 py-3 hidden lg:table-cell">Qualification</th>
            <th className="px-4 py-3 hidden lg:table-cell">Experience</th>
            <th className="px-4 py-3 hidden xl:table-cell">Joining Date</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="text-slate-700">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher: Teacher) => (
              <tr
                key={teacher._id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                {/* Name */}
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {teacher.firstName} {teacher.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{teacher.email}</p>
                    <p className="text-xs text-slate-500">
                      Phone: {teacher.phone}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="font-mono text-slate-700">
                    {teacher.employeeId}
                  </span>
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  {teacher.subjects && teacher.subjects.length > 0
                    ? teacher.subjects.map((s) => s.name).join(", ")
                    : "—"}
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  {teacher.qualification || "—"}
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  {teacher.experience ? `${teacher.experience} yrs` : "—"}
                </td>

                <td className="px-4 py-3 hidden xl:table-cell">
                  {teacher.joiningDate
                    ? format(new Date(teacher.joiningDate), "dd MMM yyyy")
                    : "N/A"}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      teacher.status === "active"
                        ? "bg-green-100 text-green-700"
                        : teacher.status === "inactive"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {teacher.status || "active"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Tooltip text="View Teacher" position="bottom">
                      <button
                        onClick={() => navigate(`/teachers/${teacher._id}`)}
                        className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                      >
                        <Eye size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Edit Teacher" position="bottom">
                      <button
                        onClick={() =>
                          navigate(`/teachers/edit/${teacher._id}`)
                        }
                        className="p-2 rounded-full hover:bg-yellow-200 text-yellow-600 transition"
                      >
                        <Pencil size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete Teacher" position="bottom">
                      <button
                        onClick={() => handleDeleteClick(teacher._id)}
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
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                No teachers found
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
      {deleteTeacherId && (
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
              content="Are you sure you want to delete this teacher? This action cannot be undone."
              onDelete={handleConfirmDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
