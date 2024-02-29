// map.js
export function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: { lat: -34.397, lng: 150.644 }
    });
  
    const marker = new google.maps.Marker({
      position: { lat: -34.397, lng: 150.644 },
      map: map,
      title: "Hello World!"
    });
  }
  