import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const VendorAnalytics = () => {
  const url = import.meta.env.VITE_LOCAL_HOST;
  const [vendorId, setVendorId] = useState("3");
  const [yearlyMetrics, setYearlyMetrics] = useState({});
  const [monthlyMetrics, setMonthlyMetrics] = useState([]);
  const [dailyMetrics, setDailyMetrics] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("yearly");

  useEffect(() => {
    axios.get(`${url}/vendors/${vendorId}/metrics`).then((res) => {
      setYearlyMetrics(res.data[0].transaction_metrics[0]);
      setMonthlyMetrics(res.data[0].transaction_metrics[0].monthly_variation);
      setDailyMetrics(res.data[0].transaction_metrics[0].monthly_variation);
    });
  }, []);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <div>
      <h1>Metrics</h1>
      <div>
        <label>
          <input
            type="radio"
            value="yearly"
            checked={selectedFilter === "yearly"}
            onChange={() => handleFilterChange("yearly")}
          />
          Yearly
        </label>
        <label>
          <input
            type="radio"
            value="monthly"
            checked={selectedFilter === "monthly"}
            onChange={() => handleFilterChange("monthly")}
          />
          Monthly
        </label>
        <label>
          <input
            type="radio"
            value="weekly"
            checked={selectedFilter === "weekly"}
            onChange={() => handleFilterChange("weekly")}
          />
          Weekly
        </label>
        <label>
          <input
            type="radio"
            value="daily"
            checked={selectedFilter === "daily"}
            onChange={() => handleFilterChange("daily")}
          />
          Daily
        </label>
      </div>
      {selectedFilter === "yearly" && yearlyMetrics && (
        <div>
          <Table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Sales</th>
                <th>Transactions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{2024}</td>
                <td>{yearlyMetrics.sales}</td>
                <td>{yearlyMetrics.transactions}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
{selectedFilter === "monthly" &&
  monthlyMetrics &&
  monthlyMetrics.length > 0 && (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Day</th>
            <th>Sales</th>
            <th>Transactions</th>
          </tr>
        </thead>
        <tbody>
          {dailyMetrics.map((dayData, index) => (
            <tr key={index}>
              <td>{dayData.month}</td>
              <td>{index + 1}</td>
              <td>{dayData.sales_per_day[index]}</td>
              <td>{dayData.transactions_per_day[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
   

{selectedFilter === "weekly" && (
  <div>
    <table className="table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Week</th>
          <th>Sales</th>
          <th>Transactions</th>
        </tr>
      </thead>
      <tbody>
        {monthlyMetrics.map((monthData, index) => {
          const weeksData = [];
          for (let i = 0; i < Math.ceil(monthData.days / 7); i++) {
            const startDay = i * 7;
            const endDay = Math.min((i + 1) * 7, monthData.days);
            const sales = monthData.sales_per_day.slice(startDay, endDay).reduce((a, b) => a + b, 0);
            const transactions = monthData.transactions_per_day.slice(startDay, endDay).reduce((a, b) => a + b, 0);
            weeksData.push({ week: i + 1, sales, transactions });
          }
          return weeksData.map((weekData, idx) => (
            <tr key={idx}>
              {idx === 0 ? <td rowSpan={weeksData.length}>{monthData.month}</td> : null}
              <td>{weekData.week}</td>
              <td>{weekData.sales}</td>
              <td>{weekData.transactions}</td>
            </tr>
          ));
        })}
      </tbody>
    </table>
  </div>
)}

{selectedFilter === "daily" && monthlyMetrics.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Month</th>
              <th>Day</th>
              <th>Sales</th>
              <th>Transactions</th>
            </tr>
          </thead>
          <tbody>
            {monthlyMetrics.map((monthData) =>
              monthData.sales_per_day.map((sales, index) => (
                <tr key={monthData.month + index}>
                  <td>{monthData.month}</td>
                  <td>{index + 1}</td>
                  <td>${sales.toFixed(2)}</td>
                  <td>{monthData.transactions_per_day[index]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default VendorAnalytics;
