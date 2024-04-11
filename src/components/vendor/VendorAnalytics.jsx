import axios from "axios";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const VendorAnalytics = () => {
  const url = import.meta.env.VITE_LOCAL_HOST;
  const [vendorId, setVendorId] = useState("3");
  const [vendorMetrics, setVendorMetrics] = useState({});
  const [selectedMetric, setSelectedMetric] = useState("daily");

  useEffect(() => {
    axios.get(`${url}/vendors/${vendorId}/metrics`).then((res) => {

      setVendorMetrics(res.data[0].transaction_metrics[0]);
    });
  }, []);



  const handleChange = (event) => {
    setSelectedMetric(event.target.value);
  };

  return (
    <div className="analytics_container">
      <h2>Vendor ID: {vendorId}</h2>
      <select value={selectedMetric} onChange={handleChange}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <Table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Total Sales</th>
            <th>Transactions</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </Table>
{"Loading ..."}

    </div>
  );
};

export default VendorAnalytics;
