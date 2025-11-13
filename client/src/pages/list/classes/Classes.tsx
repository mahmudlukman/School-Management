import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { Classes, ServerError } from "../../../@types";
import Pagination from "../../../components/Pagination";
import Tooltip from "../../../components/Tooltip";
import Loading from "../../../components/Loading";
import DeleteAlert from "../../../components/DeleteAlert";
import { useDeleteClassMutation, useGetAllClassesQuery } from "../../../redux/features/class/classApi";

const Classes = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const limit = 10;
  const navigate = useNavigate();

  // Fetch classes
  const { data, isLoading, isError, refetch } = useGetAllClassesQuery({
    page,
    limit,
    search: searchTerm || undefined,
  });

  const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();

  const total = data?.pagination?.total || 0;

  const handleDeleteClick = (id: string) => setDeleteClassId(id);
  const handleCancelDelete = () => setDeleteClassId(null);
  const handleConfirmDelete = async () => {
    if (!deleteClassId) return;
    try {
      await deleteClass(deleteClassId).unwrap();
      toast.success("Class deleted successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete class");
    } finally {
      setDeleteClassId(null);
    }
  };

  // Filter + Search logic
  const filteredClasses = useMemo(() => {
    const classes = data?.classes || [];
    return classes.filter((cls: Classes) => {
      const search = searchTerm.toLowerCase();
      const name = cls.name?.toLowerCase() || "";
      const level = cls.level?.toString() || "";
      const teacher =
        `${cls.classTeacherId?.firstName || ""} ${
          cls.classTeacherId?.lastName || ""
        }`.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        name.includes(search) ||
        level.includes(search) ||
        teacher.includes(search);

      const matchesYear =
        filterYear === "all" ||
        cls.academicYearId?.year === filterYear;

      return matchesSearch && matchesYear;
    });
  }, [data?.classes, searchTerm, filterYear]);

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
        Failed to load classes.
      </div>
    );
  }

  return (
    <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-slate-600 font-semibold">
          Manage <span className="text-slate-800 font-bold">Classes</span>
        </h1>

        <button
          onClick={() => navigate("/classes/create")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition"
        >
          <Plus size={16} /> Add New Class
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
          {[...new Set(data?.classes?.map((c: any) => c.academicYearId?.year))].map(
            (year) =>
              year && (
                <option key={year} value={year}>
                  {year}
                </option>
              )
          )}
        </select>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
        >
          <Search size={16} className="text-slate-600" />
          <input
            type="text"
            placeholder="Search by name, level, or teacher"
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
            <th className="px-4 py-3">Class Name</th>
            <th className="px-4 py-3 hidden md:table-cell">Level</th>
            <th className="px-4 py-3 hidden md:table-cell">Capacity</th>
            <th className="px-4 py-3 hidden lg:table-cell">Sections</th>
            <th className="px-4 py-3 hidden lg:table-cell">Academic Year</th>
            <th className="px-4 py-3 hidden xl:table-cell">Supervisor</th>
            <th className="px-4 py-3 text-center">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="text-slate-700">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls: Classes) => (
              <tr
                key={cls._id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                {/* Class Info */}
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">{cls.name}</p>
                  <p className="text-xs text-slate-500">
                    Level {cls.level || "—"}
                  </p>
                </td>

                <td className="px-4 py-3 hidden md:table-cell">{cls.level}</td>
                <td className="px-4 py-3 hidden md:table-cell">{cls.capacity}</td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  {cls.sections?.length ? cls.sections.join(", ") : "—"}
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  {cls.academicYearId?.year || "—"}
                </td>

                <td className="px-4 py-3 hidden xl:table-cell">
                  {cls.classTeacherId
                    ? `${cls.classTeacherId.firstName} ${cls.classTeacherId.lastName}`
                    : "—"}
                </td>

                <td className="px-4 py-3 text-center">
                  {cls.createdAt
                    ? format(new Date(cls.createdAt), "dd MMM yyyy")
                    : "N/A"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Tooltip text="View Class" position="bottom">
                      <button
                        onClick={() => navigate(`/classes/${cls._id}`)}
                        className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                      >
                        <Eye size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Edit Class" position="bottom">
                      <button
                        onClick={() => navigate(`/classes/edit/${cls._id}`)}
                        className="p-2 rounded-full hover:bg-yellow-200 text-yellow-600 transition"
                      >
                        <Pencil size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete Class" position="bottom">
                      <button
                        onClick={() => handleDeleteClick(cls._id)}
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
                No classes found
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
      {deleteClassId && (
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
              content="Are you sure you want to delete this class? This action cannot be undone."
              onDelete={handleConfirmDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
