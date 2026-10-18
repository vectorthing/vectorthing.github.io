# VectorThing

VectorThing is a polished, browser-based air-art planner for GeoFS. Choose a shape, set its center and flight settings, preview the route, and export a detailed waypoint plan as JSON.

## Run locally

This is a static website with no build step or dependencies. Open `index.html` in a browser, or serve this folder with any static web server.

## Publish at the root URL

The repository is [github.com/vectorthing/vectorthing.github.io](https://github.com/vectorthing/vectorthing.github.io), which should publish as [https://vectorthing.github.io](https://vectorthing.github.io) without a project-name path. The local `origin` remote already points to the renamed repository, and the Pages workflow is configured in `.github/workflows/pages.yml`.

If the site URL still returns 404 after a successful workflow run, open the repository's **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**, then rerun **Deploy VectorThing to GitHub Pages** from the **Actions** tab. Verify that the deployment URL shown by the workflow is `https://vectorthing.github.io/` (not the old `/VectorThing/` project path). The GitHub Pages settings must be refreshed on GitHub; changing the repository name alone does not update this checkout's remote or guarantee the Pages site configuration is correct.

## Flight plans

The downloaded `.json` includes the selected shape, center coordinates, route settings, estimated distance and duration, and every waypoint's WGS84 coordinates, heading, altitude, speed, leg distance, and estimated leg time. It uses VectorThing's portable `vectorthing.flight-plan` format; it is not an official GeoFS import file. Adapt or enter the waypoints in your simulator, and check airspace and local rules before flying.
