# VectorThing

VectorThing is a polished, browser-based air-art planner for GeoFS. Choose a shape, set its center and flight settings, preview the route, and export a detailed waypoint plan as JSON.

## Run locally

This is a static website with no build step or dependencies. Open `index.html` in a browser, or serve this folder with any static web server.

## Publish at the root URL

To get a clean address with no `/VectorThing` path, GitHub Pages needs a user or organization site repository named exactly `vectorthing.github.io`. The configured source repository is currently [github.com/vectorthing/VectorThing](https://github.com/vectorthing/VectorThing), so the root URL will not work until the repository is renamed.

1. On GitHub, open the repository **Settings → General → Repository name** and rename it to `vectorthing.github.io` (the GitHub account name must be `vectorthing`).
2. Update this local checkout's `origin` remote to `https://github.com/vectorthing/vectorthing.github.io.git`.
3. In **Settings → Pages**, select **GitHub Actions** as the deployment source.
4. Push the current project to the renamed repository's `main` branch. The included workflow deploys it automatically.
5. Check **Actions** for a successful **Deploy VectorThing to GitHub Pages** run.

The site address will then be [https://vectorthing.github.io](https://vectorthing.github.io) — no project-name path. Until the repository is renamed and Pages deploys successfully, this address is not live.

## Flight plans

The downloaded `.json` includes the selected shape, center coordinates, route settings, estimated distance and duration, and every waypoint's WGS84 coordinates, heading, altitude, speed, leg distance, and estimated leg time. It uses VectorThing's portable `vectorthing.flight-plan` format; it is not an official GeoFS import file. Adapt or enter the waypoints in your simulator, and check airspace and local rules before flying.
