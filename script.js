"use strict";
const form = document.querySelector(".form");
const containerMarkers = document.querySelector(".markers");
const inputNamePoint = document.querySelector(".form__input--namePoint");
const inputComment = document.querySelector(".form__input--comment");
class Marker {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, namePoint, comment) {
    this.coords = coords;
    this.namePoint = namePoint;
    this.comment = comment;
    this.setDescription();
  }
  setDescription() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.description = `${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}

let map, cursorClick;

class MapApp {
  #map;
  #cursorClick;
  #markers = [];

  constructor() {
    this.getPosition();
    form.addEventListener("submit", this.newMarker.bind(this));
    containerMarkers.addEventListener("click", this.moveToPopup.bind(this));
  }

  getPosition() {
    navigator.geolocation.getCurrentPosition(
      this.loadMap.bind(this),
      function () {
        alert("Your position is not found");
      }
    );
  }
  loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    L.mapbox.accessToken =
      "pk.eyJ1Ijoidml0YWxpaW1lZHZlemh5bnNreWkiLCJhIjoiY2tsMHdpN3BtMHJyNDJ2bWxuNXQ0ejZiaiJ9.ym_s42Y9Idi4D2M7ElaYLA";
    this.#map = L.mapbox
      .map("map")
      .setView(coords, 9)
      .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));

    // Event: click on map

    this.#map.on("click", this.showForm.bind(this));
    //this._renderMarker(mark);
  }
  showForm(cursorEvent) {
    this.#cursorClick = cursorEvent;
    form.classList.remove("hidden");
    inputNamePoint.focus();
  }
  hideForm() {
    // Empty inputs
    inputNamePoint.value = inputComment.value = "";

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }
  newMarker(e) {
    e.preventDefault();

    //Get data
    const name = inputNamePoint.value;
    const comment = inputComment.value;
    const { lat, lng } = this.#cursorClick.latlng;
    let marker;
    marker = new Marker([lat, lng], name, comment);

    //Check data
    //
    this.#markers.push(marker);

    this.renderMarker(marker);

    this.render(marker);

    this.hideForm();
  }
  renderMarker(marker) {
    L.marker(marker.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          autoClose: false,
          closeOnClick: false,
          className: "my-popup",
        })
      )
      .setPopupContent(
        `${marker.namePoint} ,
        ${marker.description}`
      )
      .openPopup();
  }

  //Display marker

  render(marker) {
    const html = `
        <li class="marker marker--running" data-id="${marker.id}">
          <h2 class="marker__title">${marker.description}</h2>
          <div class="marker__details">
            <span class="marker__name">Name:</span>
            <span class="marker__value">${marker.namePoint}</span>
            
          </div>
          <div class="marker__details">
            <span class="marker__name">Comment:</span>
            <span class="marker__value">${marker.comment}</span>
            
          </div>`;
    form.insertAdjacentHTML("afterend", html);
  }

  moveToPopup(e) {
    const markerElement = e.target.closest(".marker");
    if (!markerElement) return;

    const marker = this.#markers.find(
      (mark) => mark.id === markerElement.dataset.id
    );
    this.#map.setView(marker.coords, 12, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
}

const app = new MapApp();
