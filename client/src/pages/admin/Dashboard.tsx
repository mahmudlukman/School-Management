import UserCard from "../../components/Cards/UserCard";
import AttendanceChart from "../../components/Charts/AttendanceChart";
import Announcements from "../../components/Announcements";
import CountChart from "../../components/Charts/CountChart";
import FinanceChart from "../../components/Charts/FinanceChart";
import { useGetAllStudentsQuery } from "../../redux/features/students/studentsApi";
import { useGetAllTeachersQuery } from "../../redux/features/teachers/teachersApi";
import { useGetAllParentsQuery } from "../../redux/features/parents/parentsApi";
import EventCalendar from "../../components/EventCalender";

const Dashboard = () => {
  const { data: studentsData } = useGetAllStudentsQuery({
    page: 1,
    limit: 1,
    status: "active",
  });

  const { data: teachersData } = useGetAllTeachersQuery({
    page: 1,
    limit: 1,
  });

  const { data: parentsData } = useGetAllParentsQuery({
    page: 1,
    limit: 1,
  });

  const totalStudents = studentsData?.pagination?.total || 0;
  const totalTeachers = teachersData?.pagination?.total || 0;
  const totalParents = parentsData?.pagination?.total || 0;
  const totalStaff = totalTeachers; // Can be updated to include other staff

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row card my-4">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" count={totalStudents} />
          <UserCard type="teacher" count={totalTeachers} />
          <UserCard type="parent" count={totalParents} />
          <UserCard type="staff" count={totalStaff} />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default Dashboard;
