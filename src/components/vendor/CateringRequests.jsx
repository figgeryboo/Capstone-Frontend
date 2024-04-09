import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { Button, Card, Collapse } from "react-bootstrap";

const CateringRequests = () => {
  const { currentUser } = useAuth();
  const url = import.meta.env.VITE_LOCAL_HOST;
  const [requests, setRequests] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [sortOption, setSortOption] = useState("");

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`${url}/customers`);
      return response.data.reduce((acc, customer) => {
        acc[customer.customer_id] = customer; // Map customer_id to customer object
        return acc;
      }, {});
    } catch (error) {
      console.error("Error fetching customer data:", error);
      return {};
    }
  };

  const fetchCateringRequests = async () => {
    try {
      const [eventsResponse, customersData] = await Promise.all([
        axios.get(`${url}/events`),
        fetchCustomerData(),
      ]);

      const eventsData = eventsResponse.data;

      // Combine events data with customer names
      const combinedData = eventsData.map((event) => ({
        ...event,
        customer_name:
          customersData[event.customer_id]?.customer_name || "Unknown Customer",
      }));

      const unconfirmedData = combinedData.filter((event) => !event.confirmed);

      let sortedData;
      switch (sortOption) {
        case "eventDate":
          sortedData = unconfirmedData.sort(
            (a, b) => new Date(a.event_date) - new Date(b.event_date)
          );
          break;
        case "lastName":
          sortedData = unconfirmedData.sort((a, b) =>
            a.customer_name
              .split(" ")[1]
              .localeCompare(b.customer_name.split(" ")[1])
          );
          break;
        case "firstName":
          sortedData = unconfirmedData.sort((a, b) =>
            a.customer_name
              .split(" ")[0]
              .localeCompare(b.customer_name.split(" ")[0])
          );
          break;
        case "eventSize":
          sortedData = unconfirmedData.sort((a, b) => a.event_size - b.event_size);
          break;
        default:
          sortedData = unconfirmedData;
      }

      setRequests(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCateringRequests();
  }, []);

  // const handleEventConfirmation = async (orderId) => {
  //   try {
  //     const response = await axios.put(`${url}/events/${orderId}`, { confirmed: true });
  //     console.log(response.data);
  //     setRequests((prevRequests) =>
  //       prevRequests.map((request) =>
  //         request.order_id === orderId ? { ...request, status: "confirmed" } : request
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error confirming event:", error);
  //   }
  // };

  const handleEventConfirmation = async (orderId, currentStatus) => {
    try {
      const response = await axios.put(`${url}/events/${orderId}`, {
        confirmed: !currentStatus,
      });
      console.log(response.data);
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.order_id === orderId
            ? { ...request, status: !currentStatus ? "confirmed" : null }
            : request
        )
      );
    } catch (error) {
      console.error("Error toggling event confirmation:", error);
    }
  };

  const handleExpand = (orderId) => {
    setExpanded(orderId === expanded ? null : orderId);
  };

  const formatEventTime = (time) => {
    const [hours, minutes] = time.split(":");
    const formattedHours = parseInt(hours, 10) % 12 || 12;
    const period = parseInt(hours, 10) >= 12 ? "PM" : "AM";
    return `${formattedHours}:${minutes} ${period}`;
  };

  return (
    <div
      className="catering_container"
      style={{
        minWidth: "100vw",
        maxWidth: "500px",
        overflowX: "auto",
        overflowY: "auto",
      }}
    >
      <div
        className="header-container"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          minWidth: "100vw",
          maxWidth: "100%",
          position: "sticky",
          zIndex: 100,
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <h3 style={{ fontWeight: "bolder", textAlign: "center", margin: 0 }}>
          Catering Requests
        </h3>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Filter By</option>
          <option value="eventDate">Date of Event</option>
          <option value="lastName">Last Name</option>
          <option value="firstName">First Name</option>
          <option value="eventSize">Event Size</option>
        </select>
      </div>
      <div
        className="card-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 0",
          gap: "10px",
        }}
      >
        {requests.map((request, index) => (
          <Card
            key={request.order_id}
            style={{ width: "90%", maxWidth: "500px" }}
          >
            <Card.Header
              onClick={() => setExpanded(expanded === index ? null : index)}
              style={{
                cursor: "pointer",
                backgroundColor: "#59e0c8",
                padding: "5px 10px",
                minHeight: "auto",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <b>Customer Name: {request.customer_name}</b> <br />
                  Event Date:{" "}
                  {new Date(request.event_date).toLocaleDateString()} | Event
                  Size: {request.event_size}
                </div>
                <i
                  className={
                    expanded === index
                      ? "bi bi-chevron-contract"
                      : "bi bi-chevron-expand"
                  }
                ></i>
              </div>
            </Card.Header>
            <Collapse in={expanded === index}>
              <div style={{ backgroundColor: "#d0f2ef" }}>
                <Card.Body style={{ padding: "10px" }}>
                  <Card.Title>
                    Delivery Location: {request.delivery_location}
                  </Card.Title>
                  <p>Event Time: {formatEventTime(request.event_time)}</p>
                  <p>Menu Items: {request.menu_items}</p>
                  <p>Dietary Options: {request.dietary_options}</p>
                  <p>Special Instructions: {request.special_instructions}</p>
                  {/* {request.status !== "confirmed" && (
                    <Button variant="light" onClick={() => handleEventConfirmation(request.order_id)}>
                      Confirm
                    </Button>
                  )}
                  {request.status === "confirmed" && (
                    <>
                      <Button variant="info" disabled>
                        Confirmed
                      </Button>
                    </>
                  )} */}
                  {request.status !== "confirmed" && (
                    <Button
                      variant="light"
                      onClick={() =>
                        handleEventConfirmation(request.order_id, false)
                      }
                    >
                      Confirm
                    </Button>
                  )}
                  {request.status === "confirmed" && (
                    <Button
                      variant="info"
                      onClick={() =>
                        handleEventConfirmation(request.order_id, true)
                      }
                    >
                      Unconfirm
                    </Button>
                  )}
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CateringRequests;
