import MoreDark from "../../assets/images/moreDark.png";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { useGetFeePaymentsQuery } from "../../redux/features/fee/feeApi";
import { useGetAllExpensesQuery } from "../../redux/features/expense/expenseApi";
import type { Expense, FeePayment } from "../../@types";

const FinanceChart = () => {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  const { data: paymentsData } = useGetFeePaymentsQuery({
    startDate,
    endDate,
    status: "paid",
  });

  const { data: expensesData } = useGetAllExpensesQuery({
    startDate,
    endDate,
    page: 1,
    limit: 1000,
  });

  const chartData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dataByMonth: Record<string, { income: number; expense: number }> = {};

    // Initialize all months
    months.forEach((month) => {
      dataByMonth[month] = { income: 0, expense: 0 };
    });

    // Aggregate income from fee payments
    paymentsData?.payments?.forEach((payment: FeePayment) => {
      const date = new Date(payment.paymentDate);
      const month = months[date.getMonth()];
      dataByMonth[month].income += payment.amountPaid;
    });

    // Aggregate expenses
    expensesData?.expenses?.forEach((expense: Expense) => {
      const date = new Date(expense.date);
      const month = months[date.getMonth()];
      dataByMonth[month].expense += expense.amount;
    });

    return months.map((month) => ({
      name: month,
      ...dataByMonth[month],
    }));
  }, [paymentsData, expensesData]);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4 card">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <img src={MoreDark} alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#CFCEFF"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
