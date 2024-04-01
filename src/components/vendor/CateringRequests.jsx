import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { Button, Table } from "react-bootstrap";

const CateringRequests = () => {
  const url = import.meta.env.VITE_LOCAL_HOST;
  const [requests, setRequests] = useState([]);
  const { user } = useAuth();
  const [vendorId, setVendorId] = useState("");

  const fetchCateringRequests = async () => {
    try {
      const response = await axios.get(`${url}/events`);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchCateringRequests();
  }, []);

  const handleEventConfirmation = async (orderId) => {
    try {
        await axios.put(`${url}/events/${orderId}`, { status: "confirmed" });
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.order_id === orderId ? { ...request, status: "confirmed" } : request
          )
        );
      } catch (error) {
        console.error("Error confirming event:", error);
      }
  }


  return (
    <div className="catering_container">
      <h2>Catering Requests</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Event Date</th>
            <th>Event Time</th>
            <th>Delivery Location</th>
            <th>Menu Items</th>
            <th>Event Size</th>
            <th>Dietary Options</th>
            <th>Special Instructions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.order_id}>
              <td>{new Date(request.event_date).toLocaleDateString()}</td>
              <td>{request.event_time}</td>
              <td>{request.delivery_location}</td>
              <td>{request.menu_items}</td>
              <td>{request.event_size}</td>
              <td>{request.dietary_options}</td>
              <td>{request.special_instructions}</td>
              <td>
              {request.status !== "confirmed" && (
                  <Button
                    variant="success"
                    onClick={() => handleEventConfirmation(request.order_id)}
                  >
                    Confirm
                  </Button>
                )}
                {request.status === "confirmed" && (
                  <Button variant="info" disabled>
                    Confirmed
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CateringRequests;
