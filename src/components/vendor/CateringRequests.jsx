import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { Button, Card, Collapse } from "react-bootstrap";

const CateringRequests = () => {
  const url = import.meta.env.VITE_LOCAL_HOST;
  const [requests, setRequests] = useState([]);
  const { currentUser } = useAuth();
  const [expanded, setExpanded] = useState(null); // State for tracking expanded card

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
        fetchCustomerData()
      ]);

      const eventsData = eventsResponse.data;

      // Combine events data with customer names
      const combinedData = eventsData.map(event => ({
        ...event,
        customer_name: customersData[event.customer_id]?.customer_name || "Unknown Customer"
      }));

      setRequests(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
          request.order_id === orderId
            ? { ...request, status: "confirmed" }
            : request
        )
      );
    } catch (error) {
      console.error("Error confirming event:", error);
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
    <div className="catering_container" style={{ minWidth: "100vw", maxWidth: "500px", overflowX: "auto", overflowY: "auto" }}>
       <div className="header-container" style={{ minWidth: "100vw", maxWidth: "100%", position: "sticky", zIndex: 100, padding: "10px", borderRadius: "10px" }}>
        <h3 style={{ textAlign: "center", margin: 0 }}>Catering Requests</h3>
      </div>
      <div className="card-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0", gap: "10px" }}>
        {requests.map((request, index) => (
          <Card key={request.order_id} style={{ width: "90%", maxWidth: "500px" }}>
            <Card.Header onClick={() => setExpanded(expanded === index ? null : index)} style={{ cursor: "pointer", backgroundColor:"#59e0c8", padding: "5px 10px", minHeight: "auto" }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <b>Customer Name: {request.customer_name}</b> <br/>Event Date: {new Date(request.event_date).toLocaleDateString()} | Event Size: {request.event_size}
                </div>
                <i className={expanded === index ? "bi bi-chevron-contract" : "bi bi-chevron-expand"}></i>
              </div>
            </Card.Header>
            <Collapse in={expanded === index}>
              <div style={{ backgroundColor: "#d0f2ef" }}>
                <Card.Body style={{ padding: "10px" }}>
                  <Card.Title>Delivery Location: {request.delivery_location}</Card.Title>
                  <p>Event Time: {formatEventTime(request.event_time)}</p>
                  <p>Menu Items: {request.menu_items}</p>
                  <p>Dietary Options: {request.dietary_options}</p>
                  <p>Special Instructions: {request.special_instructions}</p>
                  {request.status !== "confirmed" && (
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






// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useAuth } from "../../contexts/authContext";
// import { Button, Table } from "react-bootstrap";

// const CateringRequests = () => {
//   const url = import.meta.env.VITE_LOCAL_HOST;
//   const [requests, setRequests] = useState([]);
//     const { currentUser } = useAuth();
//   //   const [vendorId, setVendorId] = useState("");
//   const fetchCateringRequests = async () => {
//     try {
//       const response = await axios.get(`${url}/events`);
//       setRequests(response.data);
//       console.log(response.data)
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       return [];
//     }
//   };
//   useEffect(() => {
//     fetchCateringRequests();
//   }, []);
//   const handleEventConfirmation = async (orderId) => {
//     try {
//       await axios.put(`${url}/events/${orderId}`, { status: "confirmed" });
//       setRequests((prevRequests) =>
//         prevRequests.map((request) =>
//           request.order_id === orderId
//             ? { ...request, status: "confirmed" }
//             : request
//         )
//       );
//     } catch (error) {
//       console.error("Error confirming event:", error);
//     }
//   };
//   return (
//     <div className="catering_container table-responsive-sm">
//       <h2 style={{ textAlign: "center" }}>Catering Requests</h2>
//       <div style={{ display: "flex", overflow: "scroll" }}>
//         <Table
//           className="align-middle table-danger table-striped table-bordered hover"
//           style={{ height: "80vh", width: "90vw" }}
//         >
//           <thead>
//             <tr>
//               <th>Event Date</th>
//               <th>Event Time</th>
//               <th>Delivery Location</th>
//               <th>Menu Items</th>
//               <th>Event Size</th>
//               <th>Dietary Options</th>
//               <th>Special Instructions</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((request) => (
//               <tr key={request.order_id}>
//                 <td>{new Date(request.event_date).toLocaleDateString()}</td>
//                 <td>{request.event_time}</td>
//                 <td>{request.delivery_location}</td>
//                 <td>{request.menu_items}</td>
//                 <td>{request.event_size}</td>
//                 <td>{request.dietary_options}</td>
//                 <td>{request.special_instructions}</td>
//                 <td>
//                   {request.status !== "confirmed" && (
//                     <Button
//                       variant="light"
//                       onClick={() => handleEventConfirmation(request.order_id)}
//                     >
//                       Confirm
//                     </Button>
//                   )}
//                   {request.status === "confirmed" && (
//                     <Button variant="info" disabled>
//                       Confirmed
//                     </Button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     </div>
//   );
// };
// export default CateringRequests;