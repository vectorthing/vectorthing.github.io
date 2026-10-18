(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const SVG_NS = "http://www.w3.org/2000/svg";
  const shapeNames = { heart: "Heart", star: "Star", infinity: "Infinity", circle: "Circle", diamond: "Diamond", square: "Square" };
  const elements = {
    location: $("#location"), latitude: $("#latitude"), longitude: $("#longitude"), coordinateFields: $("#coordinate-fields"),
    radius: $("#radius"), radiusValue: $("#radius-value"), waypoints: $("#waypoints"), waypointsValue: $("#waypoints-value"),
    altitude: $("#altitude"), speed: $("#speed"), routeLayer: $("#route-layer"), centerLayer: $("#center-layer"),
    table: $("#waypoint-table"), toast: $("#toast")
  };
  let activeShape = "heart";
  let route = [];
  let center = { lat: 37.6213, lon: -122.379, name: "San Francisco International" };
  let toastTimer;

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function getCenter() {
    const selection = elements.location.value;
    if (selection === "custom") {
      const lat = Number(elements.latitude.value);
      const lon = Number(elements.longitude.value);
      return { lat: clamp(Number.isFinite(lat) ? lat : 0, -85, 85), lon: clamp(Number.isFinite(lon) ? lon : 0, -180, 180), name: "Custom coordinates" };
    }
    const [lat, lon, name] = selection.split(",");
    return { lat: Number(lat), lon: Number(lon), name };
  }

  function shapeAt(shape, t) {
    if (shape === "circle") return { x: Math.cos(t), y: Math.sin(t) };
    if (shape === "square") {
      const phase = ((t / (Math.PI * 2)) % 1 + 1) % 1;
      const side = phase * 4;
      if (side < 1) return { x: -1 + side * 2, y: 1 };
      if (side < 2) return { x: 1, y: 1 - (side - 1) * 2 };
      if (side < 3) return { x: 1 - (side - 2) * 2, y: -1 };
      return { x: -1, y: -1 + (side - 3) * 2 };
    }
    if (shape === "diamond") {
      const phase = ((t / (Math.PI * 2)) % 1 + 1) % 1;
      const side = phase * 4;
      if (side < 1) return { x: side, y: 1 - side };
      if (side < 2) return { x: 1 - (side - 1), y: -(side - 1) };
      if (side < 3) return { x: -(side - 2), y: -1 + (side - 2) };
      return { x: -1 + (side - 3), y: side - 3 };
    }
    if (shape === "star") {
      const turn = t / (Math.PI * 2) * 10;
      const vertex = Math.floor(turn);
      const fraction = turn - vertex;
      const point = (index) => {
        const angle = -Math.PI / 2 + index * Math.PI / 5;
        const radius = index % 2 === 0 ? 1 : 0.43;
        return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      };
      const from = point(vertex);
      const to = point(vertex + 1);
      return { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction };
    }
    if (shape === "infinity") {
      const denominator = 1 + Math.cos(t) ** 2;
      return { x: Math.sin(t) / denominator, y: Math.sin(t) * Math.cos(t) / denominator };
    }
    // A classic parametric heart, sampled at even intervals for smooth turns.
    return {
      x: 16 * Math.sin(t) ** 3 / 17,
      y: (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17
    };
  }

  function greatCircleDistance(a, b) {
    const rad = Math.PI / 180;
    const lat1 = a.lat * rad;
    const lat2 = b.lat * rad;
    const deltaLat = (b.lat - a.lat) * rad;
    const deltaLon = (b.lon - a.lon) * rad;
    const h = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
    return 3440.065 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
  }

  function initialBearing(a, b) {
    const rad = Math.PI / 180;
    const lat1 = a.lat * rad;
    const lat2 = b.lat * rad;
    const deltaLon = (b.lon - a.lon) * rad;
    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  function buildRoute() {
    center = getCenter();
    const count = Number(elements.waypoints.value);
    const radius = Number(elements.radius.value);
    const altitude = clamp(Number(elements.altitude.value) || 5500, 500, 30000);
    const speed = clamp(Number(elements.speed.value) || 110, 40, 400);
    elements.altitude.value = altitude;
    elements.speed.value = speed;
    route = Array.from({ length: count }, (_, index) => {
      const point = shapeAt(activeShape, index / count * Math.PI * 2);
      const northNm = point.y * radius;
      const eastNm = point.x * radius;
      const lat = center.lat + northNm / 60;
      const lonScale = Math.max(0.087, Math.cos(center.lat * Math.PI / 180));
      const lon = center.lon + eastNm / (60 * lonScale);
      return { index, x: point.x * radius, y: point.y * radius, lat, lon, altitudeFt: altitude, speedKts: speed };
    });
    route.forEach((waypoint, index) => {
      const next = route[(index + 1) % route.length];
      waypoint.headingDeg = initialBearing(waypoint, next);
      waypoint.legDistanceNm = greatCircleDistance(waypoint, next);
      waypoint.legTimeMin = waypoint.legDistanceNm / speed * 60;
    });
    updateMap();
    updateSummary();
    updateTable();
  }

  function svgElement(name, attributes = {}) {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }

  function mapPoint(waypoint) {
    return { x: 450 + waypoint.x * 9.1, y: 270 - waypoint.y * 9.1 };
  }

  function updateMap() {
    elements.routeLayer.replaceChildren();
    elements.centerLayer.replaceChildren();
    const projected = route.map(mapPoint);
    if (projected.length) {
      const pathData = projected.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ") + " Z";
      elements.routeLayer.append(svgElement("path", { d: pathData, class: "route-path-shadow" }));
      elements.routeLayer.append(svgElement("path", { d: pathData, class: "route-path" }));
      const stride = Math.max(1, Math.floor(route.length / 16));
      route.forEach((waypoint, index) => {
        if (index === 0 || index % stride === 0) {
          const point = projected[index];
          elements.routeLayer.append(svgElement("circle", { cx: point.x, cy: point.y, r: index === 0 ? 5 : 2.4, class: index === 0 ? "start-dot" : "waypoint-dot" }));
        }
      });
      const first = projected[0];
      const rotation = (route[0].headingDeg + 90) % 360;
      const plane = svgElement("g", { transform: `translate(${first.x} ${first.y}) rotate(${rotation})` });
      plane.append(svgElement("path", { d: "M0 -9 3.1 2.2 0 1.1 -3.1 2.2Z", fill: "#0a725f", stroke: "#fff", "stroke-width": "1.5", "stroke-linejoin": "round" }));
      elements.routeLayer.append(plane);
    }
    const centerPoint = svgElement("g", { transform: "translate(450 270)" });
    centerPoint.append(svgElement("circle", { r: 12, class: "center-ring" }));
    centerPoint.append(svgElement("path", { d: "M-4 0H4M0-4V4", class: "center-cross" }));
    elements.centerLayer.append(centerPoint);
    const latLabel = `${Math.abs(center.lat).toFixed(4)}° ${center.lat >= 0 ? "N" : "S"}`;
    const lonLabel = `${Math.abs(center.lon).toFixed(4)}° ${center.lon >= 0 ? "E" : "W"}`;
    $("#map-coordinate").innerHTML = `${latLabel} &nbsp; ${lonLabel}`;
    $("#map-location").textContent = center.name;
    $("#footer-lat").textContent = `${center.lat < 0 ? "−" : ""}${Math.abs(center.lat).toFixed(4)}°`;
    $("#footer-lon").textContent = `${center.lon < 0 ? "−" : ""}${Math.abs(center.lon).toFixed(4)}°`;
  }

  function updateSummary() {
    const distance = route.reduce((total, waypoint) => total + waypoint.legDistanceNm, 0);
    const time = route.reduce((total, waypoint) => total + waypoint.legTimeMin, 0);
    $("#distance-value").innerHTML = `${distance.toFixed(1)} <small>NM</small>`;
    $("#time-value").innerHTML = `${Math.max(1, Math.round(time))} <small>MIN</small>`;
    $("#point-value").innerHTML = `${route.length} <small>PTS</small>`;
    $("#waypoint-count").textContent = route.length;
    elements.radiusValue.textContent = elements.radius.value;
    elements.waypointsValue.textContent = elements.waypoints.value;
    updateRangeFill(elements.radius);
    updateRangeFill(elements.waypoints);
  }

  function updateRangeFill(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const percent = ((Number(input.value) - min) / (max - min)) * 100;
    input.style.background = `linear-gradient(90deg,#299b83 0%,#299b83 ${percent}%,#e6edeb ${percent}%,#e6edeb 100%)`;
  }

  function updateTable() {
    const visible = route.slice(0, 8);
    const rows = visible.map((waypoint, index) => `<tr><td><span class="wp-id ${index === 0 ? "wp-start" : ""}">${index === 0 ? "START" : String(index + 1).padStart(2, "0")}</span></td><td>${waypoint.lat.toFixed(5)}°</td><td>${waypoint.lon.toFixed(5)}°</td><td>${String(Math.round(waypoint.headingDeg)).padStart(3, "0")}°</td><td>${waypoint.altitudeFt.toLocaleString()} ft</td><td>${waypoint.legDistanceNm.toFixed(2)} NM</td></tr>`).join("");
    elements.table.innerHTML = rows;
    $("#table-range").textContent = `Showing 1–${visible.length} of ${route.length} waypoints`;
  }

  function buildFlightPlan() {
    const distanceNm = route.reduce((total, waypoint) => total + waypoint.legDistanceNm, 0);
    const estimatedMinutes = route.reduce((total, waypoint) => total + waypoint.legTimeMin, 0);
    return {
      format: "vectorthing.flight-plan",
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      plan: {
        name: `${shapeNames[activeShape]} over ${center.name}`,
        shape: activeShape,
        center: { name: center.name, latitude: Number(center.lat.toFixed(6)), longitude: Number(center.lon.toFixed(6)) },
        dimensions: { radiusNm: Number(elements.radius.value), approximateWidthNm: Number((Number(elements.radius.value) * 2).toFixed(1)), approximateHeightNm: Number((Number(elements.radius.value) * 2).toFixed(1)) },
        totalDistanceNm: Number(distanceNm.toFixed(2)),
        estimatedFlightTimeMinutes: Number(estimatedMinutes.toFixed(1)),
        cruiseAltitudeFt: Number(elements.altitude.value),
        cruiseSpeedKts: Number(elements.speed.value),
        waypointCount: route.length,
        units: { distance: "nautical miles", altitude: "feet", speed: "knots", coordinates: "WGS84 decimal degrees" }
      },
      waypoints: route.map((waypoint, index) => ({
        id: `VT-${String(index + 1).padStart(3, "0")}`,
        name: index === 0 ? "Shape start" : `Shape point ${String(index + 1).padStart(2, "0")}`,
        latitude: Number(waypoint.lat.toFixed(6)),
        longitude: Number(waypoint.lon.toFixed(6)),
        altitudeFt: waypoint.altitudeFt,
        speedKts: waypoint.speedKts,
        headingDeg: Number(waypoint.headingDeg.toFixed(1)),
        legDistanceNm: Number(waypoint.legDistanceNm.toFixed(3)),
        estimatedLegTimeMinutes: Number(waypoint.legTimeMin.toFixed(2)),
        action: "fly-through"
      })),
      notes: [
        "Fly waypoints in listed order and return to the first waypoint to close the shape.",
        "This is a VectorThing route-planning JSON format, not an official GeoFS import file. Enter or adapt the waypoint coordinates in your simulator.",
        "Distance and time are estimates; actual flight path, wind, aircraft performance, and local airspace may differ."
      ]
    };
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2600);
  }

  function filename() {
    const locationSlug = center.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `vectorthing-${activeShape}-${locationSlug || "flight-plan"}.json`;
  }

  function downloadPlan() {
    const blob = new Blob([JSON.stringify(buildFlightPlan(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename();
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showToast("Your flight plan JSON is downloaded.");
  }

  async function copyPlan() {
    const data = JSON.stringify(buildFlightPlan(), null, 2);
    try {
      await navigator.clipboard.writeText(data);
    } catch {
      const temporary = document.createElement("textarea");
      temporary.value = data;
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.append(temporary);
      temporary.select();
      document.execCommand("copy");
      temporary.remove();
    }
    showToast("Flight plan JSON copied to clipboard.");
  }

  $$(".shape-option").forEach((button) => button.addEventListener("click", () => {
    activeShape = button.dataset.shape;
    $$(".shape-option").forEach((option) => {
      const selected = option === button;
      option.classList.toggle("selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    buildRoute();
  }));
  elements.location.addEventListener("change", () => {
    const custom = elements.location.value === "custom";
    elements.coordinateFields.hidden = !custom;
    if (custom) {
      elements.latitude.value = center.lat.toFixed(4);
      elements.longitude.value = center.lon.toFixed(4);
    }
    buildRoute();
  });
  [elements.latitude, elements.longitude, elements.radius, elements.waypoints, elements.altitude, elements.speed].forEach((control) => {
    control.addEventListener("input", buildRoute);
    control.addEventListener("change", buildRoute);
  });
  $("#generate-button").addEventListener("click", () => {
    buildRoute();
    showToast(`${shapeNames[activeShape]} flight plan generated · ${route.length} waypoints.`);
  });
  $("#download-button").addEventListener("click", downloadPlan);
  $("#copy-button").addEventListener("click", copyPlan);
  $("#recenter-button").addEventListener("click", () => {
    buildRoute();
    showToast("Route preview recentered.");
  });
  buildRoute();
})();
