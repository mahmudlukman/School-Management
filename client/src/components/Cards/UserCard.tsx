import More from "../../assets/images/more.png";
import { useGetCurrentAcademicYearQuery } from "../../redux/features/academicYear/academicYear";
import { format } from "date-fns";

interface UserCardProps {
  type: "student" | "teacher" | "parent" | "staff";
  count: number;
}

const UserCard = ({ type, count }: UserCardProps) => {
  const { data } = useGetCurrentAcademicYearQuery({});
  const academicYear = data?.academicYear || {};

  const startYear = academicYear?.startDate
    ? format(new Date(academicYear.startDate), "yyyy")
    : "";
  const endYear = academicYear?.endDate
    ? format(new Date(academicYear.endDate), "yyyy")
    : "";

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px] card">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {startYear} - {endYear}
        </span>
        <img src={More} alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">
        {count.toLocaleString()}
      </h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;
