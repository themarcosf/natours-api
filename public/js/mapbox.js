export const displayMap = function (locations) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWFyY29zZi1uYXRvdXJzIiwiYSI6ImNsZGJxczhrdTAzODUzcW9kMGwyYTM5dTMifQ.4_IR3gtJl4qPv3KvLWmIrA";

  const _map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/marcosf-natours/cldbr3wb8000801nsfayzzbdx",
    scrollZoom: false,
    interactive: false,
  });

  const _bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const _el = document.createElement("div");
    _el.className = "marker";

    // add marker to map
    new mapboxgl.Marker({
      element: _el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(_map);

    // add popup to map
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(_map);

    // extend map bounds to include location
    _bounds.extend(loc.coordinates);
  });

  _map.fitBounds(_bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 300,
      right: 300,
    },
  });
};
