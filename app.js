(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const SVG_NS = "http://www.w3.org/2000/svg";
  const elements = {
    location: $("#location"), latitude: $("#latitude"), longitude: $("#longitude"), coordinateFields: $("#coordinate-fields"),
    airportSearch: $("#airport-search"), airportStatus: $("#airport-status"),
    radius: $("#radius"), radiusValue: $("#radius-value"), waypoints: $("#waypoints"), waypointsValue: $("#waypoints-value"),
    altitude: $("#altitude"), speed: $("#speed"), routeLayer: $("#route-layer"), centerLayer: $("#center-layer"),
    table: $("#waypoint-table"), toast: $("#toast"), generateModal: $("#generate-modal"),
    modalClose: $("#generate-modal-close"), modalCopyButton: $("#modal-copy-button"), modalDownloadButton: $("#modal-download-button"),
    modalSimBriefButton: $("#modal-simbrief-button"), flightPlanJson: $("#flight-plan-json")
  };
  const savedShapesKey = "vectorthing.saved-shapes.v1";
  const discordClientId = "1561402874733527040";
  const discordRedirectUri = "https://vectorthing.github.io/";
  const discordSessionKey = "vectorthing.discord-session.v1";
  const discordStateKey = "vectorthing.discord-state.v1";
  const shapeNames = { heart: "Heart", star: "Star", infinity: "Infinity", circle: "Circle", diamond: "Diamond", square: "Square", triangle: "Triangle", pentagon: "Pentagon", hexagon: "Hexagon", octagon: "Octagon", rectangle: "Rectangle" };
  const featuredAirports = [
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
  let airports = featuredAirports;
  let globalAirportsLoaded = false;
  let activeShape = "heart";
  let savedShapes = loadSavedShapes();
  let drawingPoints = [];
  let isDrawing = false;
  let drawingMode = "freehand";
  let drawingClosed = false;
  let route = [];
  let center = { lat: 37.6213, lon: -122.379, name: "San Francisco International" };
  let manualCoordinates = false;
  let toastTimer;
  let discordUser = null;

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
    const previous = elements.location.value;
    const source = needle ? airports : featuredAirports;
    const selectedAirport = airports.find(([icao]) => icao === previous);
    const candidates = selectedAirport && !source.some(([icao]) => icao === previous) ? [selectedAirport, ...source] : source;
    const matches = candidates.filter((airport) => airport.join(" ").toLocaleLowerCase().includes(needle));
    const visibleMatches = matches.slice(0, 100);
    elements.location.replaceChildren();
    visibleMatches.forEach((airport) => {
      const option = document.createElement("option");
      option.value = airport[0];
      const codes = [airport[1], airport[0]].filter(Boolean).join(" / ");
      option.textContent = `${airport[3]} · ${airport[2]}${codes ? ` (${codes})` : ""}`;
      elements.location.append(option);
    });
    if (visibleMatches.length) {
      elements.location.value = visibleMatches.some(([icao]) => icao === previous) ? previous : visibleMatches[0][0];
      elements.location.disabled = false;
      if (needle) {
        const count = matches.length > visibleMatches.length ? `Showing first ${visibleMatches.length} of ${matches.length}` : `${matches.length} matching`;
        elements.airportStatus.textContent = `${count} airport${matches.length === 1 ? "" : "s"} · search by name, city, country or code.`;
      } else {
        elements.airportStatus.textContent = globalAirportsLoaded
          ? `${airports.length.toLocaleString()} worldwide airports loaded · search by name, city, country or code.`
          : `${featuredAirports.length} popular airports · worldwide directory loads when available.`;
      }
      if (!visibleMatches.some(([icao]) => icao === previous)) buildRoute();
    } else {
      elements.location.disabled = true;
      elements.airportStatus.textContent = globalAirportsLoaded
        ? "No matching airports. Try another name or code, or enter coordinates instead."
        : "No popular-airport matches yet. The worldwide directory is loading; try again shortly.";
    }
  }

  function parseAirportCsv(csvText) {
    const lines = csvText.split(/\r?\n/);
    if (!lines.length) return [];
    const parseRow = (line) => line.match(/("(?:[^"]|"")*"|[^,]*)(,|$)/g)?.map((field) => {
      const value = field.replace(/,$/, "");
      return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1).replace(/""/g, '"') : value;
    }) || [];
    const headers = parseRow(lines[0]);
    const column = Object.fromEntries(headers.map((header, index) => [header, index]));
    const get = (row, name) => row[column[name]] || "";
    const supportedTypes = new Set(["large_airport", "medium_airport", "small_airport", "heliport", "seaplane_base", "balloonport"]);
    const unique = new Map();

    for (const line of lines.slice(1)) {
      if (!line) continue;
      const row = parseRow(line);
      if (!supportedTypes.has(get(row, "type"))) continue;
      const latitude = Number(get(row, "latitude_deg"));
      const longitude = Number(get(row, "longitude_deg"));
      const ident = get(row, "gps_code") || get(row, "ident");
      const name = get(row, "name");
      if (!ident || !name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;
      unique.set(get(row, "ident") || ident, [
        ident.toUpperCase(), get(row, "iata_code").toUpperCase(), name,
        get(row, "municipality") || get(row, "iso_region") || "Unknown location",
        get(row, "iso_country") || "Unknown country", latitude, longitude
      ]);
    }
    return [...unique.values()].sort((a, b) => a[2].localeCompare(b[2]));
  }

  async function loadGlobalAirports() {
    try {
      const response = await fetch("https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv", { cache: "force-cache" });
      if (!response.ok) throw new Error("Airport directory unavailable");
      const parsedAirports = parseAirportCsv(await response.text());
      if (!parsedAirports.length) throw new Error("Airport directory was empty");
      airports = parsedAirports;
      globalAirportsLoaded = true;
      renderAirports(elements.airportSearch.value);
    } catch {
      globalAirportsLoaded = false;
      renderAirports(elements.airportSearch.value);
      elements.airportStatus.textContent = `${featuredAirports.length} popular airports available. Worldwide directory could not load; check your connection.`;
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
    if (["triangle", "pentagon", "hexagon", "octagon", "rectangle"].includes(shape)) {
      const sides = shape === "triangle" ? 3 : shape === "pentagon" ? 5 : shape === "hexagon" ? 6 : shape === "octagon" ? 8 : 4;
      const phase = ((t / (Math.PI * 2)) % 1 + 1) % 1;
      const segment = phase * sides;
      const index = Math.floor(segment);
      const fraction = segment - index;
      const vertex = (vertexIndex) => {
        if (shape === "rectangle") {
          const corners = [{ x: -1, y: 0.62 }, { x: 1, y: 0.62 }, { x: 1, y: -0.62 }, { x: -1, y: -0.62 }];
          return corners[vertexIndex % corners.length];
        }
        const angle = -Math.PI / 2 + vertexIndex * Math.PI * 2 / sides;
        return { x: Math.cos(angle), y: Math.sin(angle) };
      };
      const from = vertex(index);
      const to = vertex(index + 1);
      return { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction };
    }
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
    return route.map((waypoint, index) => ({
      ident: `VT${String(index + 1).padStart(3, "0")}`,
      type: "WPT",
      lat: Number(waypoint.lat.toFixed(5)),
      lon: Number(waypoint.lon.toFixed(5)),
      alt: Math.round(waypoint.altitudeFt),
      spd: Math.round(waypoint.speedKts),
      heading: Number(waypoint.headingDeg.toFixed(2))
    }));
  }

  function buildSimBriefRouteText() {
    return route.map((waypoint, index) => {
      const legLabel = index === 0 ? "START" : `WPT${String(index + 1).padStart(2, "0")}`;
      return `${legLabel},${waypoint.lat.toFixed(5)},${waypoint.lon.toFixed(5)},${Math.round(waypoint.altitudeFt)}`;
    }).join("\n");
  }

  function buildSimBriefShareLink() {
    const routeText = buildSimBriefRouteText();
    const baseUrl = "https://www.simbrief.com/system/dispatch.php";
    const params = new URLSearchParams({
      source: "VectorThing",
      route: routeText,
      shape: activeShape,
      airport: center.name
    });
    return `${baseUrl}?${params.toString()}`;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.append(temporary);
    temporary.focus();
    temporary.select();
    document.execCommand("copy");
    temporary.remove();
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2600);
  }

  function showStudio() {
    document.body.classList.add("app-active");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  const themePreferenceKey = "vectorthing.theme.v1";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function applyThemePreference(preference, announce = false) {
    const theme = preference === "system" ? (systemTheme.matches ? "dark" : "light") : preference;
    document.body.dataset.theme = theme;
    try {
      localStorage.setItem(themePreferenceKey, preference);
    } catch {
      // The selected theme still applies for this page session if storage is unavailable.
    }
    $$(".theme-option").forEach((button) => {
      const selected = button.dataset.themeChoice === preference;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    const status = $("#theme-status");
    if (status) status.textContent = announce ? `${preference[0].toUpperCase()}${preference.slice(1)} theme applied.` : "";
  }

  function initializeTheme() {
    let preference = "system";
    try {
      const savedPreference = localStorage.getItem(themePreferenceKey);
      if (["light", "dark", "system"].includes(savedPreference)) preference = savedPreference;
    } catch {
      // Use the system preference when browser storage is unavailable.
    }
    applyThemePreference(preference);
    systemTheme.addEventListener("change", () => {
      if (document.body.dataset.theme && getThemePreference() === "system") applyThemePreference("system");
    });
  }

  function getThemePreference() {
    try {
      return localStorage.getItem(themePreferenceKey) || "system";
    } catch {
      return "system";
    }
  }

  function navigateStudioPage(target, link) {
    const settingsPage = $("#settings");
    const builder = $(".builder-grid");
    const settingsSelected = target === "settings";
    settingsPage.hidden = !settingsSelected;
    builder.hidden = settingsSelected;
    $(".page-heading").hidden = settingsSelected;
    $$(".side-nav .nav-item").forEach((item) => {
      const selected = item === link;
      item.classList.toggle("active", selected);
      if (selected) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    $(".breadcrumb strong").textContent = settingsSelected ? "Settings" : target === "route-details" ? "Flight plan" : "Shape studio";
    if (settingsSelected) {
      history.replaceState(null, "", "#settings");
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (target === "route-details") {
      history.replaceState(null, "", "#route-details");
      $("#route-details").scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      history.replaceState(null, "", "#builder");
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  function openLoginModal(message = "") {
    const modal = $("#login-modal");
    $("#login-status").textContent = message;
    modal.removeAttribute("hidden");
    requestAnimationFrame(() => $("#discord-login-button").focus());
  }

  function closeLoginModal() {
    $("#login-modal").setAttribute("hidden", "hidden");
    if (!document.body.classList.contains("app-active")) showStudio();
  }

  function updateDiscordAccount(user) {
    discordUser = user;
    const account = $("#discord-account");
    const name = user.global_name || user.username || "Discord member";
    $("#discord-username").textContent = name;
    const avatar = $("#discord-avatar");
    avatar.replaceChildren();
    if (user.avatar) {
      const image = document.createElement("img");
      image.src = `https://cdn.discordapp.com/avatars/${encodeURIComponent(user.id)}/${encodeURIComponent(user.avatar)}.png?size=64`;
      image.alt = "";
      avatar.append(image);
    } else {
      avatar.textContent = name.slice(0, 1).toUpperCase();
    }
    account.hidden = false;
  }

  function clearDiscordSession() {
    discordUser = null;
    sessionStorage.removeItem(discordSessionKey);
    sessionStorage.removeItem(discordStateKey);
    $("#discord-account").hidden = true;
  }

  async function fetchDiscordUser(accessToken) {
    const response = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error("Discord could not verify your sign-in. Please try again.");
    return response.json();
  }

  async function initializeDiscordAuth() {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const returnedToken = params.get("access_token");
    const returnedState = params.get("state");
    if (params.has("error")) {
      history.replaceState(null, "", `${location.pathname}${location.search}`);
      openLoginModal("Discord sign-in was cancelled. You can try again whenever you are ready.");
      return;
    }
    if (returnedToken) {
      history.replaceState(null, "", `${location.pathname}${location.search}`);
      const expectedState = sessionStorage.getItem(discordStateKey);
      sessionStorage.removeItem(discordStateKey);
      if (!expectedState || returnedState !== expectedState || params.get("iss") !== "https://discord.com") {
        clearDiscordSession();
        openLoginModal("We couldn't verify this Discord sign-in. Please start again.");
        return;
      }
      const expiresAt = Date.now() + Number(params.get("expires_in") || 0) * 1000;
      try {
        const user = await fetchDiscordUser(returnedToken);
        sessionStorage.setItem(discordSessionKey, JSON.stringify({ accessToken: returnedToken, expiresAt, user }));
        updateDiscordAccount(user);
        showStudio();
      } catch (error) {
        clearDiscordSession();
        openLoginModal(error.message || "Unable to finish Discord sign-in. Please try again.");
      }
      return;
    }

    try {
      const saved = JSON.parse(sessionStorage.getItem(discordSessionKey) || "null");
      if (!saved || !saved.accessToken || saved.expiresAt <= Date.now()) {
        clearDiscordSession();
        return;
      }
      const user = await fetchDiscordUser(saved.accessToken);
      saved.user = user;
      sessionStorage.setItem(discordSessionKey, JSON.stringify(saved));
      updateDiscordAccount(user);
    } catch {
      clearDiscordSession();
    }
  }

  function beginDiscordLogin() {
    const randomState = Array.from(crypto.getRandomValues(new Uint8Array(24)), (value) => value.toString(16).padStart(2, "0")).join("");
    sessionStorage.setItem(discordStateKey, randomState);
    const params = new URLSearchParams({
      client_id: discordClientId,
      response_type: "token",
      redirect_uri: discordRedirectUri,
      scope: "identify",
      state: randomState
    });
    window.location.assign(`https://discord.com/oauth2/authorize?${params.toString()}`);
  }

  function openGenerateModal() {
    buildRoute();
    elements.flightPlanJson.value = JSON.stringify(buildFlightPlan(), null, 2);
    elements.generateModal.removeAttribute("hidden");
    elements.generateModal.style.display = "grid";
  }

  function closeGenerateModal() {
    elements.generateModal.setAttribute("hidden", "hidden");
    elements.generateModal.style.display = "none";
  }

  window.openGenerateModal = openGenerateModal;
  window.closeGenerateModal = closeGenerateModal;
  window.copyModalPlan = async () => {
    await copyPlan();
    closeGenerateModal();
  };
  window.downloadModalPlan = () => {
    downloadPlan();
    closeGenerateModal();
  };
  window.copySimBriefLink = async () => {
    await copySimBriefShareLink();
    closeGenerateModal();
  };

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
      await copyText(data);
      showToast("GeoFS flight-plan JSON copied to clipboard.");
    } catch {
      elements.flightPlanJson.value = data;
      showToast("Clipboard blocked — use the JSON text box in the export dialog to paste manually.");
    }
  }

  async function copySimBriefShareLink() {
    const link = buildSimBriefShareLink();
    try {
      await copyText(link);
      showToast("SimBrief share link copied to clipboard.");
    } catch {
      elements.flightPlanJson.value = `${link}\n\n${JSON.stringify(buildFlightPlan(), null, 2)}`;
      showToast("SimBrief link unavailable to clipboard — use the JSON text box and paste the link manually.");
    }
    window.open(link, "_blank", "noopener,noreferrer");
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
    const previewPoints = drawingClosed && drawingPoints.length ? [...drawingPoints, drawingPoints[0]] : drawingPoints;
    $("#drawing-stroke").setAttribute("points", previewPoints.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "));
    const startMarker = $("#drawing-start");
    if (drawingMode === "straight" && drawingPoints.length) {
      startMarker.setAttribute("cx", drawingPoints[0].x);
      startMarker.setAttribute("cy", drawingPoints[0].y);
      startMarker.setAttribute("r", "5");
    } else {
      startMarker.setAttribute("r", "0");
    }
  }

  function clearDrawing() {
    drawingPoints = [];
    drawingClosed = false;
    isDrawing = false;
    updateDrawingPreview();
  }

  function setDrawingMode(mode) {
    drawingMode = mode;
    clearDrawing();
    const canvas = $("#shape-drawing-canvas");
    canvas.classList.toggle("grid-drawing", mode === "straight");
    $("#drawing-help").textContent = mode === "straight"
      ? "Click to place corners on the grid. Click your first point to close the loop."
      : "Drag inside the canvas. The ends connect to make a flyable loop.";
    $$(".drawing-mode-button").forEach((button) => {
      const selected = button.dataset.drawingMode === mode;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function drawingCanvasPoint(event, snapToGrid = false) {
    const bounds = drawingCanvas.getBoundingClientRect();
    let x = clamp((event.clientX - bounds.left) * 600 / bounds.width, 0, 600);
    let y = clamp((event.clientY - bounds.top) * 300 / bounds.height, 0, 300);
    if (snapToGrid) {
      x = clamp(Math.round(x / 20) * 20, 0, 600);
      y = clamp(Math.round(y / 20) * 20, 0, 300);
    }
    return { x, y };
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
  $$(".drawing-mode-button").forEach((button) => button.addEventListener("click", () => setDrawingMode(button.dataset.drawingMode)));
  drawingCanvas.addEventListener("pointerdown", (event) => {
    if (drawingMode === "straight") {
      if (drawingClosed) return;
      const point = drawingCanvasPoint(event, true);
      const first = drawingPoints[0];
      if (first && drawingPoints.length >= 3 && Math.hypot(point.x - first.x, point.y - first.y) <= 14) {
        drawingClosed = true;
      } else if (!first || Math.hypot(point.x - drawingPoints[drawingPoints.length - 1].x, point.y - drawingPoints[drawingPoints.length - 1].y) >= 10) {
        drawingPoints.push(point);
      }
      updateDrawingPreview();
      return;
    }
    const point = drawingCanvasPoint(event);
    drawingPoints = [point];
    drawingClosed = false;
    isDrawing = true;
    drawingCanvas.setPointerCapture(event.pointerId);
    updateDrawingPreview();
  });
  drawingCanvas.addEventListener("pointermove", (event) => {
    if (!isDrawing) return;
    const point = drawingCanvasPoint(event);
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
    openGenerateModal();
    showToast(`${shapeNames[activeShape]} flight plan ready · choose an export.`);
  });
  $("#start-vectoring-button").addEventListener("click", () => {
    if (discordUser) showStudio();
    else openLoginModal();
  });
  $("#discord-login-button").addEventListener("click", beginDiscordLogin);
  $("#login-modal-close").addEventListener("click", closeLoginModal);
  $("#login-modal").addEventListener("click", (event) => {
    if (event.target === $("#login-modal")) closeLoginModal();
  });
  $("#discord-logout-button").addEventListener("click", () => {
    clearDiscordSession();
    document.body.classList.remove("app-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  elements.generateModal.addEventListener("click", (event) => {
    if (event.target === elements.generateModal) closeGenerateModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && getComputedStyle(elements.generateModal).display !== "none") closeGenerateModal();
    if (event.key === "Escape" && !$("#login-modal").hidden) closeLoginModal();
  });
  $("#download-button").addEventListener("click", downloadPlan);
  $("#copy-button").addEventListener("click", copyPlan);
  $("#recenter-button").addEventListener("click", () => {
    buildRoute();
    showToast("Route preview recentered.");
  });
  $$(".side-nav .nav-item").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    navigateStudioPage(link.dataset.page || (link.getAttribute("href") === "#route-details" ? "route-details" : "builder"), link);
  }));
  $$(".theme-option").forEach((button) => button.addEventListener("click", () => applyThemePreference(button.dataset.themeChoice, true)));
  renderAirports();
  renderSavedShapes();
  buildRoute();
  loadGlobalAirports();
  initializeTheme();
  initializeDiscordAuth();
})();
