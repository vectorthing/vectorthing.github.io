(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const SVG_NS = "http://www.w3.org/2000/svg";
  const elements = {
    location: $("#location"), latitude: $("#latitude"), longitude: $("#longitude"), coordinateFields: $("#coordinate-fields"),
    airportSearch: $("#airport-search"), airportStatus: $("#airport-status"),
    radius: $("#radius"), radiusValue: $("#radius-value"), waypoints: $("#waypoints"), waypointsValue: $("#waypoints-value"),
    altitude: $("#altitude"), speed: $("#speed"), routeLayer: $("#route-layer"), centerLayer: $("#center-layer"),
    table: $("#waypoint-table"), toast: $("#toast")
  };
  const savedShapesKey = "vectorthing.saved-shapes.v1";
  const shapeNames = { heart: "Heart", star: "Star", infinity: "Infinity", circle: "Circle", diamond: "Diamond", square: "Square" };
  const airports = [
    ["KSFO", "SFO", "San Francisco International", "San Francisco", "USA", 37.6213, -122.3790],
    ["KLAX", "LAX", "Los Angeles International", "Los Angeles", "USA", 33.9416, -118.4085],
    ["KJFK", "JFK", "John F. Kennedy International", "New York", "USA", 40.6413, -73.7781],
    ["KEWR", "EWR", "Newark Liberty International", "Newark", "USA", 40.6895, -74.1745],
    ["KLGA", "LGA", "LaGuardia", "New York", "USA", 40.7769, -73.8740],
    ["KORD", "ORD", "O'Hare International", "Chicago", "USA", 41.9742, -87.9073],
    ["KATL", "ATL", "Hartsfield-Jackson Atlanta International", "Atlanta", "USA", 33.6407, -84.4277],
    ["KMIA", "MIA", "Miami International", "Miami", "USA", 25.7959, -80.2870],
    ["KSEA", "SEA", "Seattle-Tacoma International", "Seattle", "USA", 47.4502, -122.3088],
    ["KLAS", "LAS", "Harry Reid International", "Las Vegas", "USA", 36.0840, -115.1537],
    ["KDEN", "DEN", "Denver International", "Denver", "USA", 39.8561, -104.6737],
    ["KDFW", "DFW", "Dallas Fort Worth International", "Dallas", "USA", 32.8998, -97.0403],
    ["KBOS", "BOS", "Logan International", "Boston", "USA", 42.3656, -71.0096],
    ["KPHX", "PHX", "Phoenix Sky Harbor International", "Phoenix", "USA", 33.4343, -112.0116],
    ["KIAH", "IAH", "George Bush Intercontinental", "Houston", "USA", 29.9902, -95.3368],
    ["KMSP", "MSP", "Minneapolis-Saint Paul International", "Minneapolis", "USA", 44.8848, -93.2223],
    ["CYVR", "YVR", "Vancouver International", "Vancouver", "Canada", 49.1967, -123.1815],
    ["CYYZ", "YYZ", "Toronto Pearson International", "Toronto", "Canada", 43.6777, -79.6248],
    ["KTPA", "TPA", "Tampa International", "Tampa", "USA", 27.9755, -82.5332],
    ["MMMX", "MEX", "Mexico City International", "Mexico City", "Mexico", 19.4363, -99.0721],
    ["SBGR", "GRU", "São Paulo/Guarulhos International", "São Paulo", "Brazil", -23.4356, -46.4731],
    ["EGLL", "LHR", "Heathrow", "London", "United Kingdom", 51.4700, -0.4543],
    ["EGKK", "LGW", "Gatwick", "London", "United Kingdom", 51.1537, -0.1821],
    ["LFPG", "CDG", "Charles de Gaulle", "Paris", "France", 49.0097, 2.5479],
    ["LFPO", "ORY", "Orly", "Paris", "France", 48.7262, 2.3652],
    ["EDDF", "FRA", "Frankfurt Airport", "Frankfurt", "Germany", 50.0379, 8.5622],
    ["EHAM", "AMS", "Amsterdam Schiphol", "Amsterdam", "Netherlands", 52.3105, 4.7683],
    ["LEMD", "MAD", "Adolfo Suárez Madrid-Barajas", "Madrid", "Spain", 40.4983, -3.5676],
    ["LIRF", "FCO", "Leonardo da Vinci–Fiumicino", "Rome", "Italy", 41.8003, 12.2389],
    ["LSZH", "ZRH", "Zurich Airport", "Zurich", "Switzerland", 47.4581, 8.5555],
    ["EDDM", "MUC", "Munich Airport", "Munich", "Germany", 48.3538, 11.7861],
    ["LTFM", "IST", "Istanbul Airport", "Istanbul", "Türkiye", 41.2753, 28.7519],
    ["OMDB", "DXB", "Dubai International", "Dubai", "United Arab Emirates", 25.2532, 55.3657],
    ["OTHH", "DOH", "Hamad International", "Doha", "Qatar", 25.2731, 51.6081],
    ["VIDP", "DEL", "Indira Gandhi International", "New Delhi", "India", 28.5562, 77.1000],
    ["VABB", "BOM", "Chhatrapati Shivaji Maharaj International", "Mumbai", "India", 19.0896, 72.8656],
    ["WSSS", "SIN", "Singapore Changi", "Singapore", "Singapore", 1.3644, 103.9915],
    ["WMKK", "KUL", "Kuala Lumpur International", "Kuala Lumpur", "Malaysia", 2.7456, 101.7072],
    ["VTBS", "BKK", "Suvarnabhumi", "Bangkok", "Thailand", 13.6900, 100.7501],
    ["VHHH", "HKG", "Hong Kong International", "Hong Kong", "Hong Kong", 22.3080, 113.9185],
    ["ZBAA", "PEK", "Beijing Capital International", "Beijing", "China", 40.0799, 116.6031],
    ["ZSPD", "PVG", "Shanghai Pudong International", "Shanghai", "China", 31.1443, 121.8083],
    ["RJTT", "HND", "Tokyo Haneda", "Tokyo", "Japan", 35.5494, 139.7798],
    ["RJAA", "NRT", "Narita International", "Tokyo", "Japan", 35.7720, 140.3929],
    ["RKSI", "ICN", "Incheon International", "Seoul", "South Korea", 37.4602, 126.4407],
    ["YSSY", "SYD", "Sydney Kingsford Smith", "Sydney", "Australia", -33.9399, 151.1753],
    ["YMML", "MEL", "Melbourne Airport", "Melbourne", "Australia", -37.6690, 144.8410],
    ["NZAA", "AKL", "Auckland Airport", "Auckland", "New Zealand", -37.0082, 174.7850],
    ["FAOR", "JNB", "O. R. Tambo International", "Johannesburg", "South Africa", -26.1392, 28.2460],
    ["HECA", "CAI", "Cairo International", "Cairo", "Egypt", 30.1219, 31.4056],
    ["GMMN", "CMN", "Mohammed V International", "Casablanca", "Morocco", 33.3675, -7.5898],
    ["UUEE", "SVO", "Sheremetyevo International", "Moscow", "Russia", 55.9726, 37.4146],
    ["EKCH", "CPH", "Copenhagen Airport", "Copenhagen", "Denmark", 55.6180, 12.6508],
    ["ESSA", "ARN", "Stockholm Arlanda", "Stockholm", "Sweden", 59.6519, 17.9186],
    ["BIRK", "RKV", "Reykjavik Airport", "Reykjavik", "Iceland", 64.1300, -21.9406]
  ];
  let activeShape = "heart";
  let savedShapes = loadSavedShapes();
  let drawingPoints = [];
  let isDrawing = false;
  let route = [];
  let center = { lat: 37.6213, lon: -122.379, name: "San Francisco International" };
  let manualCoordinates = false;
  let toastTimer;

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function getCenter() {
    if (manualCoordinates) {
      const lat = Number(elements.latitude.value);
      const lon = Number(elements.longitude.value);
      return { lat: clamp(Number.isFinite(lat) ? lat : 0, -85, 85), lon: clamp(Number.isFinite(lon) ? lon : 0, -180, 180), name: "Custom coordinates" };
    }
    const airport = airports.find(([icao]) => icao === elements.location.value) || airports[0];
    return { lat: airport[5], lon: airport[6], name: `${airport[3]} · ${airport[0]}` };
  }

  function renderAirports(query = "") {
    const needle = query.trim().toLocaleLowerCase();
    const matches = airports.filter((airport) => airport.join(" ").toLocaleLowerCase().includes(needle));
    const previous = elements.location.value;
    elements.location.replaceChildren();
    matches.forEach((airport) => {
      const option = document.createElement("option");
      option.value = airport[0];
      option.textContent = `${airport[3]} · ${airport[2]} (${airport[1]} / ${airport[0]})`;
      elements.location.append(option);
    });
    if (matches.length) {
      elements.location.value = matches.some(([icao]) => icao === previous) ? previous : matches[0][0];
      elements.location.disabled = false;
      elements.airportStatus.textContent = needle ? `${matches.length} matching airport${matches.length === 1 ? "" : "s"} · choose one below.` : `${airports.length} airports available · search by city or code.`;
      if (!matches.some(([icao]) => icao === previous)) buildRoute();
    } else {
      elements.location.disabled = true;
      elements.airportStatus.textContent = "No matching airports. Try another search or enter coordinates instead.";
    }
  }

  function normalizeShapePoints(points) {
    if (!Array.isArray(points)) return [];
    return points
      .filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y))
      .map((point) => ({ x: Number(point.x), y: Number(point.y) }))
      .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  }

  function loadSavedShapes() {
    try {
      const parsed = JSON.parse(localStorage.getItem(savedShapesKey) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.flatMap((shape) => {
        if (!shape || typeof shape.id !== "string" || typeof shape.name !== "string") return [];
        const points = normalizeShapePoints(shape.points);
        if (points.length < 3) return [];
        return [{ ...shape, points }];
      });
    } catch {
      return [];
    }
  }

  function sampleCustomShape(shape, t) {
    const id = shape.slice("custom:".length);
    const points = savedShapes.find((item) => item.id === id)?.points;
    if (!points || points.length < 3) return { x: 0, y: 0 };
    const lengths = points.map((point, index) => {
      const next = points[(index + 1) % points.length];
      return Math.hypot(next.x - point.x, next.y - point.y);
    });
    const total = lengths.reduce((sum, length) => sum + length, 0);
    let target = ((t / (Math.PI * 2)) % 1 + 1) % 1 * total;
    for (let index = 0; index < points.length; index += 1) {
      if (target <= lengths[index] || index === points.length - 1) {
        const fraction = lengths[index] ? target / lengths[index] : 0;
        const from = points[index];
        const to = points[(index + 1) % points.length];
        return { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction };
      }
      target -= lengths[index];
    }
    return points[0];
  }

  function shapeAt(shape, t) {
    if (shape.startsWith("custom:")) return sampleCustomShape(shape, t);
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
    return {
      version: 1,
      route: route.map((waypoint, index) => ({
        ident: `VT${String(index + 1).padStart(3, "0")}`,
        type: "WPT",
        lat: Number(waypoint.lat.toFixed(5)),
        lon: Number(waypoint.lon.toFixed(5)),
        alt: Math.round(waypoint.altitudeFt),
        spd: Math.round(waypoint.speedKts),
        heading: Number(waypoint.headingDeg.toFixed(2))
      }))
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
    const shapeSlug = (shapeNames[activeShape] || "custom-shape").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `geofs-${shapeSlug}-${locationSlug || "flight-plan"}.json`;
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
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("GeoFS flight-plan JSON downloaded. Open NAV → Flight Plan → Import in GeoFS.");
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
    showToast("GeoFS flight-plan JSON copied to clipboard.");
  }

  function setActiveShape(shape, name) {
    activeShape = shape;
    if (name) shapeNames[shape] = name;
    $$(".shape-option[data-shape]").forEach((button) => {
      const selected = button.dataset.shape === shape;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $$(".saved-shape-button").forEach((button) => {
      const selected = button.dataset.shape === shape;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    buildRoute();
  }

  function renderSavedShapes() {
    const container = $("#saved-shapes");
    container.replaceChildren();
    savedShapes.forEach((shape) => {
      const points = normalizeShapePoints(shape.points);
      if (points.length < 3) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "saved-shape-button";
      button.dataset.shape = `custom:${shape.id}`;
      button.setAttribute("aria-pressed", "false");
      button.title = `Use saved shape: ${shape.name}`;
      const icon = document.createElementNS(SVG_NS, "svg");
      icon.setAttribute("viewBox", "0 0 40 40");
      const preview = document.createElementNS(SVG_NS, "polyline");
      preview.setAttribute("points", points.map((point) => `${(20 + point.x * 14).toFixed(1)},${(20 - point.y * 14).toFixed(1)}`).join(" "));
      icon.append(preview);
      const label = document.createElement("span");
      label.textContent = shape.name;
      button.append(icon, label);
      button.addEventListener("click", () => setActiveShape(button.dataset.shape, shape.name));
      container.append(button);
      shapeNames[button.dataset.shape] = shape.name;
    });
  }

  function updateDrawingPreview() {
    $("#drawing-stroke").setAttribute("points", drawingPoints.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "));
  }

  function clearDrawing() {
    drawingPoints = [];
    updateDrawingPreview();
  }

  function saveDrawing() {
    const cleanPoints = drawingPoints.filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y));
    if (cleanPoints.length < 3) {
      showToast("Draw a shape with at least three points first.");
      return;
    }
    const minX = Math.min(...cleanPoints.map((point) => point.x));
    const maxX = Math.max(...cleanPoints.map((point) => point.x));
    const minY = Math.min(...cleanPoints.map((point) => point.y));
    const maxY = Math.max(...cleanPoints.map((point) => point.y));
    const scale = Math.max(maxX - minX, maxY - minY, 1) / 2;
    const stride = Math.max(1, Math.ceil(cleanPoints.length / 120));
    const points = cleanPoints.filter((_, index) => index % stride === 0).map((point) => ({
      x: Number(((point.x - (minX + maxX) / 2) / scale).toFixed(4)),
      y: Number((((minY + maxY) / 2 - point.y) / scale).toFixed(4))
    })).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
    if (points.length < 3) {
      showToast("Your drawing needs more distinct points to save a safe shape.");
      return;
    }
    const name = $("#shape-name").value.trim() || `My shape ${savedShapes.length + 1}`;
    const shape = { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, name, points };
    savedShapes.push(shape);
    try {
      localStorage.setItem(savedShapesKey, JSON.stringify(savedShapes));
    } catch {
      savedShapes.pop();
      showToast("Could not save this shape in browser storage.");
      return;
    }
    renderSavedShapes();
    setActiveShape(`custom:${shape.id}`, shape.name);
    $("#shape-drawing-panel").hidden = true;
    $("#draw-shape-button").setAttribute("aria-expanded", "false");
    clearDrawing();
    $("#shape-name").value = "";
    showToast(`${shape.name} saved in this browser and selected.`);
  }

  $$(".shape-option[data-shape]").forEach((button) => button.addEventListener("click", () => setActiveShape(button.dataset.shape)));
  $("#draw-shape-button").addEventListener("click", () => {
    const panel = $("#shape-drawing-panel");
    panel.hidden = !panel.hidden;
    $("#draw-shape-button").setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) $("#shape-name").focus();
  });
  $("#close-drawing-button").addEventListener("click", () => {
    $("#shape-drawing-panel").hidden = true;
    $("#draw-shape-button").setAttribute("aria-expanded", "false");
  });
  $("#clear-drawing-button").addEventListener("click", clearDrawing);
  $("#save-shape-button").addEventListener("click", saveDrawing);
  const drawingCanvas = $("#shape-drawing-canvas");
  drawingCanvas.addEventListener("pointerdown", (event) => {
    const bounds = drawingCanvas.getBoundingClientRect();
    const point = { x: (event.clientX - bounds.left) * 600 / bounds.width, y: (event.clientY - bounds.top) * 300 / bounds.height };
    drawingPoints = [point];
    isDrawing = true;
    drawingCanvas.setPointerCapture(event.pointerId);
    updateDrawingPreview();
  });
  drawingCanvas.addEventListener("pointermove", (event) => {
    if (!isDrawing) return;
    const bounds = drawingCanvas.getBoundingClientRect();
    const point = { x: clamp((event.clientX - bounds.left) * 600 / bounds.width, 0, 600), y: clamp((event.clientY - bounds.top) * 300 / bounds.height, 0, 300) };
    const previous = drawingPoints[drawingPoints.length - 1];
    if (Math.hypot(point.x - previous.x, point.y - previous.y) >= 2.5) {
      drawingPoints.push(point);
      updateDrawingPreview();
    }
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((eventName) => drawingCanvas.addEventListener(eventName, () => { isDrawing = false; }));
  elements.airportSearch.addEventListener("input", () => {
    manualCoordinates = false;
    elements.coordinateFields.hidden = true;
    $("#custom-location-button").textContent = "Use custom coordinates instead";
    $("#custom-location-button").setAttribute("aria-expanded", "false");
    renderAirports(elements.airportSearch.value);
  });
  elements.location.addEventListener("change", () => {
    manualCoordinates = false;
    buildRoute();
  });
  $("#custom-location-button").addEventListener("click", () => {
    manualCoordinates = !manualCoordinates;
    elements.coordinateFields.hidden = !manualCoordinates;
    elements.airportSearch.disabled = manualCoordinates;
    elements.location.disabled = manualCoordinates;
    const button = $("#custom-location-button");
    button.textContent = manualCoordinates ? "Choose an airport instead" : "Use custom coordinates instead";
    button.setAttribute("aria-expanded", String(manualCoordinates));
    if (manualCoordinates) {
      elements.latitude.value = center.lat.toFixed(4);
      elements.longitude.value = center.lon.toFixed(4);
      elements.airportStatus.textContent = "Enter the departure point latitude and longitude.";
    } else {
      elements.airportSearch.value = "";
      renderAirports();
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
  renderAirports();
  renderSavedShapes();
  buildRoute();
})();
