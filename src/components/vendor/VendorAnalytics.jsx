import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const VendorAnalytics = () => {
  const url = import.meta.env.VITE_LOCAL_HOST;
  const [vendorId, setVendorId] = useState("3");
  const [yearlyMetrics, setYearlyMetrics] = useState({});
  const [monthlyMetrics, setMonthlyMetrics] = useState([]);
  const [weeklyMetric, setWeeklyMetric] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("yearly");

  useEffect(() => {
    axios.get(`${url}/vendors/${vendorId}/metrics`).then((res) => {
      setYearlyMetrics(res.data[0].transaction_metrics[0]);
      setMonthlyMetrics(res.data[0].transaction_metrics[0].monthly_variation);
      setWeeklyMetric(res.data[0].transaction_metrics[0].monthly_variation);
    });
  }, []);

  // const handleChange = (event) => {
  //   setSelectedMetric(event.target.value);
  // };
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    //     <div className="analytics_container">
    //       <h2>Vendor ID: {vendorId}</h2>
    //       <select value={selectedMetric} onChange={handleChange}>
    //         <option value="daily">Daily</option>
    //         <option value="weekly">Weekly</option>
    //         <option value="monthly">Monthly</option>
    //         <option value="yearly">Yearly</option>
    //       </select>
    //       <Table>
    //         <thead>
    //           <tr>
    //             <th>Period</th>
    //             <th>Total Sales</th>
    //             <th>Transactions</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //         </tbody>
    //       </Table>
    // {"Loading ..."}

    // {console.log(monthlyMetrics)}
    //     </div>
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
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Days</th>
                <th>Sales per Day</th>
                <th>Transactions per Day</th>
              </tr>
            </thead>
            <tbody>
              {monthlyMetrics.map((monthData, index) => (
                <tr key={index}>
                  <td>{monthData.sales}</td>
                  <td>{monthData.days}</td>
                  <td>
                    <ul>
                      {monthData.sales_per_day.map((sales, index) => (
                        <li key={index}>{sales}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {monthData.transactions_per_day.map(
                        (transactions, index) => (
                          <li key={index}>{transactions}</li>
                        )
                      )}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedFilter === "monthly" && monthlyMetrics.length > 0 && (
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

      {selectedFilter === "weekly" && (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Days</th>
                <th>Sales per Day</th>
                <th>Transactions per Day</th>
              </tr>
            </thead>
            <tbody>
              {monthlyMetrics.map((monthData, index) => (
                <div key={index}>{/* Weekly data rendering */}</div>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedFilter === "daily" &&
        monthlyMetrics &&
        monthlyMetrics.length > 0 && (
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Days</th>
                  <th>Sales per Day</th>
                  <th>Transactions per Day</th>
                </tr>
              </thead>
              <tbody>
                {monthlyMetrics.map((monthData, index) => (
                  <div key={index}>{/* Daily data rendering */}</div>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default VendorAnalytics;
