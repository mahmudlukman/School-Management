import { useState } from "react";
import { Link } from "react-router-dom";
import FormModal from "../../../components/FormModal";
import TableSearch from "../../../components/TableSearch";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import Filter from "../../../assets/images/filter.png";
import Sort from "../../../assets/images/sort.png";
import View from "../../../assets/images/view.png";
import toast from "react-hot-toast";
import { role } from "../../../utils/dummyData";
import type { ServerError } from "../../../@types";
import { useDeleteTeacherMutation, useGetAllTeachersQuery } from "../../../redux/features/teachers/teachersApi";

type Teacher = {
  _id: string;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const Teachers = () => {
  // Pagination & search
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  // Fetch teachers
  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllTeachersQuery({ page, limit, search });

  // Delete mutation
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTeacher(id).unwrap();
      toast.success("Teacher deleted successfully");
      refetch();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError?.data?.message ||
        serverError?.message ||
        "Failed to delete teacher";
      toast.error(errorMessage);
    }
  };

  // Handle search input
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // Derived data
  const teachers: Teacher[] = data?.teachers || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const renderRow = (item: Teacher) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <img
          src={item.photo}
          alt={item.name}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden md:table-cell">
        {item.subjects?.join(", ") || "—"}
      </td>
      <td className="hidden md:table-cell">
        {item.classes?.join(", ") || "—"}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link to={`/list/teachers/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <img src={View} alt="view" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal
              table="teacher"
              type="delete"
              id={item._id}
              onConfirmDelete={() => handleDelete(item._id)}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={handleSearch} isLoading={isFetching} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <img src={Filter} alt="filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <img src={Sort} alt="sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="teacher" type="create" />}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="p-4 text-center text-gray-500">Loading teachers...</p>
      ) : isError ? (
        <p className="p-4 text-center text-red-500">Failed to load teachers</p>
      ) : teachers.length === 0 ? (
        <p className="p-4 text-center text-gray-500">No teachers found</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={teachers} />
      )}

      {/* Pagination */}
      {total > 0 && (
        <Pagination
          page={page}
          count={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default Teachers;
