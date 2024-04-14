import axios from "axios";
import { useEffect, useState } from "react";

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
    <div
      className="metrics_container"
      style={{
        padding: "3px",
        minWidth: "100vw",
        maxWidth: "500px",
        maxHeight: "85vh",
        overflowX: "auto",
        overflowY: "auto",
   
      }}
    >
      <h1 className="text-center">Metrics</h1>
      <div className="labels_container form-check-inline" style={{display: "flex", justifyContent:"space-evenly"}}>
        <label className="form-check-label" >
          <input
           className="form-check-input"
            type="radio"
            value="yearly"
            checked={selectedFilter === "yearly"}
            onChange={() => handleFilterChange("yearly")}
            style={{ backgroundColor: selectedFilter === "yearly" ? "rgb(234, 49, 135)" : "initial" }}
          />
          Yearly
        </label>
        <label className="form-check-label">
          <input
           className="form-check-input"
            type="radio"
            value="monthly"
            checked={selectedFilter === "monthly"}
            onChange={() => handleFilterChange("monthly")}
            style={{ backgroundColor: selectedFilter === "monthly" ? "rgb(234, 49, 135)" : "initial" }}
          />
          Monthly
        </label>
        <label className="form-check-label">
          <input
           className="form-check-input"
            type="radio"
            value="weekly"
            checked={selectedFilter === "weekly"}
            onChange={() => handleFilterChange("weekly")}
            style={{ backgroundColor: selectedFilter === "weekly" ? "rgb(234, 49, 135)" : "initial" }}
          />
          Weekly
        </label>
        <label className="form-check-label">
          <input
           className="form-check-input"
            type="radio"
            value="daily"
            checked={selectedFilter === "daily"}
            onChange={() => handleFilterChange("daily")}
            style={{ backgroundColor: selectedFilter === "daily" ? "rgb(234, 49, 135)" : "initial" }}
          />
          Daily
        </label>
      </div>

      {selectedFilter === "yearly" && yearlyMetrics && (
        <div>
          <table className="table table-bordered table-striped m-3">
            <thead className="thead-light">
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
          </table>
        </div>
      )}
      {selectedFilter === "monthly" && monthlyMetrics && monthlyMetrics.length > 0 && (
          <div>
            <table className="table table-striped m-3">
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
          <table className="table table-striped m-3">
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
                  const sales = monthData.sales_per_day
                    .slice(startDay, endDay)
                    .reduce((a, b) => a + b, 0);
                  const transactions = monthData.transactions_per_day
                    .slice(startDay, endDay)
                    .reduce((a, b) => a + b, 0);
                  weeksData.push({ week: i + 1, sales, transactions });
                }
                return weeksData.map((weekData, idx) => (
                  <tr key={idx}>
                    {idx === 0 ? (
                      <td rowSpan={weeksData.length}>{monthData.month}</td>
                    ) : null}
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
        <table className="table table-striped m-3">
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
