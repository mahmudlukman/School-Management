import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Pagination from "../../../components/Pagination";
import Tooltip from "../../../components/Tooltip";
import Loading from "../../../components/Loading";
import DeleteAlert from "../../../components/DeleteAlert";
import toast from "react-hot-toast";
import type { ServerError, Parent } from "../../../@types";
import {
  useDeleteParentMutation,
  useGetAllParentsQuery,
} from "../../../redux/features/parents/parentsApi";

const Parents = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteParentId, setDeleteParentId] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading, isError, refetch } = useGetAllParentsQuery({
    page,
    limit,
    status: filterStatus !== "all" ? filterStatus : undefined,
    search: searchTerm || undefined,
  });

  const [deleteParent, { isLoading: isDeleting }] = useDeleteParentMutation();

  const navigate = useNavigate();
  const total = data?.pagination?.total || 0;

  const handleDeleteClick = (id: string) => setDeleteParentId(id);
  const handleCancelDelete = () => setDeleteParentId(null);

  const handleConfirmDelete = async () => {
    if (!deleteParentId) return;
    try {
      await deleteParent(deleteParentId).unwrap();
      toast.success("Parent deleted successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      toast.error(serverError.data?.message || "Failed to delete parent");
    } finally {
      setDeleteParentId(null);
    }
  };

  // Client-side search filtering
  const filteredParents = useMemo(() => {
    const parents = data?.parents || [];
    return parents.filter((parent: Parent) => {
      if (searchTerm.trim() !== "") {
        const search = searchTerm.toLowerCase();
        const fullName = `${parent.firstName} ${parent.lastName}`.toLowerCase();
        const email = parent.email?.toLowerCase() || "";
        const phone = parent.phone?.toLowerCase() || "";
        const address = parent.address?.toLowerCase() || "";
        return (
          fullName.includes(search) ||
          email.includes(search) ||
          phone.includes(search) ||
          address.includes(search)
        );
      }
      return true;
    });
  }, [data?.parents, searchTerm]);

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
        Failed to load parents.
      </div>
    );
  }

  return (
    <div className="my-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-slate-600 font-semibold">
          Manage <span className="text-slate-800 font-bold">Parents</span>
        </h1>

        <button
          onClick={() => navigate("/parents/create")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition"
        >
          <Plus size={16} /> Add New Parent
        </button>
      </div>

      {/* Filters + Search */}
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
        </select>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full"
        >
          <Search size={16} className="text-slate-600" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
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
            <th className="px-4 py-3 hidden md:table-cell">Relationship</th>
            <th className="px-4 py-3 hidden md:table-cell">Email</th>
            <th className="px-4 py-3 hidden md:table-cell">Phone</th>
            <th className="px-4 py-3 hidden md:table-cell">Address</th>
            <th className="px-4 py-3 hidden md:table-cell">Students</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="text-slate-700">
          {filteredParents.length > 0 ? (
            filteredParents.map((parent: Parent) => (
              <tr
                key={parent._id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                {/* Name */}
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {parent.firstName} {parent.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{parent.email}</p>
                  </div>
                </td>

                {/* Relationship */}
                <td className="px-4 py-3 hidden md:table-cell capitalize">
                  {parent.relationship || "—"}
                </td>

                {/* Email */}
                <td className="px-4 py-3 hidden md:table-cell">
                  {parent.email || "N/A"}
                </td>

                {/* Phone */}
                <td className="px-4 py-3 hidden md:table-cell">
                  {parent.phone || "N/A"}
                </td>

                {/* Address */}
                <td className="px-4 py-3 hidden md:table-cell">
                  {parent.address || "N/A"}
                </td>

                {/* Students */}
                <td className="px-4 py-3 hidden md:table-cell">
                  {parent.studentIds && parent.studentIds.length > 0 ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {parent.studentIds
                        .map((s) => `${s.firstName} ${s.lastName}`)
                        .join(", ")}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">No students</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Tooltip text="View Parent" position="bottom">
                      <button
                        onClick={() => navigate(`/parents/${parent._id}`)}
                        className="p-2 rounded-full hover:bg-blue-200 text-blue-600 transition"
                      >
                        <Eye size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Edit Parent" position="bottom">
                      <button
                        onClick={() => navigate(`/parents/edit/${parent._id}`)}
                        className="p-2 rounded-full hover:bg-yellow-200 text-yellow-600 transition"
                      >
                        <Pencil size={18} />
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete Parent" position="bottom">
                      <button
                        onClick={() => handleDeleteClick(parent._id)}
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
                No parents found
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
      {deleteParentId && (
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
              content="Are you sure you want to delete this parent? This action cannot be undone."
              onDelete={handleConfirmDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Parents;
