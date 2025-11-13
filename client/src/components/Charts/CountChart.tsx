import MoreDark from "../../assets/images/moreDark.png";
import MaleFemale from "../../assets/images/maleFemale.png";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { useGetAllStudentsQuery } from "../../redux/features/students/studentsApi";
import type { Student } from "../../@types";

const CountChart = () => {
  const { data: studentsData } = useGetAllStudentsQuery({
    page: 1,
    limit: 1000,
    status: "active",
  });

  const chartData = useMemo(() => {
    const students = studentsData?.students || [];
    const total = students.length;
    const boys = students.filter((s: Student) => s.gender === "male").length;
    const girls = students.filter((s: Student) => s.gender === "female").length;

    const boysPercentage = total > 0 ? Math.round((boys / total) * 100) : 0;
    const girlsPercentage = total > 0 ? Math.round((girls / total) * 100) : 0;

    return {
      data: [
        { name: "Total", count: total, fill: "white" },
        { name: "Girls", count: girls, fill: "#FAE27C" },
        { name: "Boys", count: boys, fill: "#C3EBFA" },
      ],
      boys,
      girls,
      boysPercentage,
      girlsPercentage,
    };
  }, [studentsData]);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4 card">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <img src={MoreDark} alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={chartData.data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <img
          src={MaleFemale}
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{chartData.boys.toLocaleString()}</h1>
          <h2 className="text-xs text-gray-300">
            Boys ({chartData.boysPercentage}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{chartData.girls.toLocaleString()}</h1>
          <h2 className="text-xs text-gray-300">
            Girls ({chartData.girlsPercentage}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
