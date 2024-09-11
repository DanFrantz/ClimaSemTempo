const x = document.getElementById("cidade");
var lat;
var lng;

getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCidade);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function getCidade(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;

    var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
        if (data.address && data.address.city) {
            document.getElementById("cidade").textContent = data.address.city;
        } else {
            document.getElementById("cidade").textContent = "Cidade não encontrada";
        }
    })
    .catch(error => console.error('Erro:', error));
}

function showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
  }