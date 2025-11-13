import MoreDark from "../../assets/images/moreDark.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { useGetAttendanceQuery } from "../../redux/features/attendance/attendanceApi";
import type { Attendance } from "../../@types";

const AttendanceChart = () => {
  // Get attendance for last 7 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  const { data: attendanceData } = useGetAttendanceQuery({
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  });

  const chartData = useMemo(() => {
    if (!attendanceData?.attendance) return [];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dataByDay: Record<string, { present: number; absent: number }> = {};

    // Initialize last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayName = days[date.getDay()];
      dataByDay[dayName] = { present: 0, absent: 0 };
    }

    // Aggregate attendance data
    attendanceData.attendance.forEach((record: Attendance) => {
      const date = new Date(record.date);
      const dayName = days[date.getDay()];
      
      if (dataByDay[dayName]) {
        if (record.status === "present") {
          dataByDay[dayName].present++;
        } else if (record.status === "absent") {
          dataByDay[dayName].absent++;
        }
      }
    });

    return Object.entries(dataByDay).map(([name, counts]) => ({
      name,
      ...counts,
    }));
  }, [attendanceData]);

  return (
    <div className="bg-white rounded-lg p-4 h-full card">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <img src={MoreDark} alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={chartData} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="present"
            fill="#FAE27C"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#C3EBFA"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;