<figure>
    <img src="public/WMICLOGO.png" height="20%" width="30%"
         alt="WMIC logo">
    <sub><figcaption>Logo Created By Bethany T. and Raquel M.</figcaption></sub>
</figure>
</br>

*Where's My Ice Cream? (WMIC) is a dual sided web application <ins>[soon to be fully mobile]</ins> that helps users locate ice cream trucks in their area.*

_<font color="#BCF4EF">Users</font> can view the locations of ice cream trucks, see details about each vendor, and even request catering services. </br>
<font color="#BCF4EF">Vendors</font> have the similar capabilities as well as responding to catering requests and seeing general transaction metrics._

### Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

**Real-time Location Tracking:** View the current location of ice cream trucks on a map.

**Vendor Details:** Get detailed information about each ice cream vendor, including ratings and reviews.

**Catering Requests:** Request catering services from your favorite ice cream vendors.

**Feedback System:** Submit feedback about your experience using the app.

**Customized Map Views:** Different map styles for users and vendors.

## Technologies Used

### Client Side:

- React
- Google Maps Places API
- Google Maps Geometry API
- Google Places Autocomplete API
- Firebase (for real-time updates and authentication)
- Websockets
- Bootstrap 5 & Bootstrap Icons
- Material UI
- Axios

### Server Side:

- Node.js
- Express.js
- PostgreSQL
- Firebase Admin SDK

## Setup and Installation

### Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running
- Firebase account setup

### Installation

1. **Fork the Repository**

   Click the <font color="green">Fork</font> button at the top right of the repository page to create a copy of this repository under your own GitHub account.

2. **Clone the Repository**

   Clone the forked repository to your local machine using the following command:

```
git clone https://github.com/figgeryboo/Capstone-Frontend.git
cd Capstone-Frontend
```
3. **Install dependencies:**
```
npm install
```
4. **Setup environment variables:**
Create a `.env` file in the root directory and add your environment variables: 

 _💡 The first 6 are given by Firebase when you create your own project. The mapId <font color="red">(OPTIONAL)</font> is created when customizing your map styles in [Google map's console](https://developers.google.com/maps). Just be sure to remove that object from `src/components/user/Map.jsx` if not utilizing a customized map theme_
```
VITE_REACT_APP_FIREBASE_API_KEY=FIREBASE_API_KEY
VITE_REACT_APP_FIREBASE_AUTH_DOMAIN=FIREBASE_AUTH_DOMAIN
VITE_REACT_APP_PROJECT_ID=PROJECT_ID
VITE_REACT_APP_STORAGE_BUCKET=STORAGE_BUCKET
VITE_REACT_APP_MESSAGING_SENDER_ID=MESSAGING_SENDER_ID
VITE_REACT_APP_APP_ID=APP_ID
VITE_GOOGLE_MAPID=GOOGLE_MAPID
VITE_BACKEND_URL=https://capstone-backend-vi3e.onrender.com
VITE_LOCAL_HOST=http://yourlocalhostendpoint
```



## Usage 
1. **Access the application:** </br>
Open your browser and go to http://localhost:3000 or your default local host. 
You will need [Server Side](https://github.com/figgeryboo/Capstone-Backend) set up to access full functionality 

2. **Explore features:** </br>
#### <center>User Side</centeR>
- Sign up/in as `user`
- View the map to see the locations of ice cream trucks.
- Click on a truck marker to see vendor details.
- Use the catering request form to book a vendor.
- Submit feedback via the feedback form.

#### <center>Vendor Side:</center>
- Sign up/in as `vendor`.
- Update your location to show on the user map.
- View and respond to catering requests.
- View general transaction metrics.

[Customize your vendor profile with details and images]:#

## Contributing
At this time, we welcome contributions _(THANK YOU)_ via pull requests from your forked repo.


## License 
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.