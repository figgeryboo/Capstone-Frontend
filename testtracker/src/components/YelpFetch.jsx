import { useEffect, useState } from "react";

const YelpFetch = () => {
const [trucks, setTrucks] = useState([]);
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/yelp`, {
          params: {
            location: "new-york",
            // categories: "icecream",
            categories: "foodtrucks,icecream",
            term: "ice cream truck",
          },
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        console.log(response.data.businesses);
        setTrucks(response.data.businesses);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [apiKey, url]);

return (
    <div className="container">
    <h2>Yelp API Call</h2>

    {trucks.map((truck) => (
      <div key={truck.id} className="truck">
        <p>
          Categories:
          {truck.categories.map((category) => category.title).join(", ")}
        </p>
        <img
          src={truck.image_url}
          width={"200px"}
          height={"200px"}
          alt="image "
        />
        <p>
          <span> {truck.name}</span>
        </p>
        {/* <span> {truck.is_closed}</span> */}
        <p>
          {" "}
          Reviews: <span> {truck.review_count}</span>
        </p>
        <p>
          {" "}
          Rating: <span>{truck.rating}</span>
        </p>
        <p>
          {" "}
          Address: <span> {truck.location.display_address}</span>
        </p>
        <p>
          {" "}
          Distance: <span>{truck.distance.toFixed(2)}</span> miles
        </p>
      </div>
    ))}
  </div>
)


}

export default YelpFetch