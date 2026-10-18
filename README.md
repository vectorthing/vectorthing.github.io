# VectorThing

VectorThing is a browser-based air-art planner for GeoFS. Choose a built-in shape or draw and save your own, set the center and flight settings, preview the route, then export or copy a GeoFS flight-plan JSON file.

## Run locally

This is a static website with no build step or dependencies. Open `index.html` in a browser, or serve this folder with any static web server.

## Publish at the root URL

The repository is [github.com/vectorthing/vectorthing.github.io](https://github.com/vectorthing/vectorthing.github.io), which should publish as [https://vectorthing.github.io](https://vectorthing.github.io) without a project-name path. The local `origin` remote already points to the renamed repository, and the Pages workflow is configured in `.github/workflows/pages.yml`.

If the site URL still returns 404 after a successful workflow run, open the repository's **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**, then rerun **Deploy VectorThing to GitHub Pages** from the **Actions** tab. Verify that the deployment URL shown by the workflow is `https://vectorthing.github.io/` (not the old `/VectorThing/` project path). The GitHub Pages settings must be refreshed on GitHub; changing the repository name alone does not update this checkout's remote or guarantee the Pages site configuration is correct.

## Draw and save shapes

Select **Draw your own**, drag a closed path on the canvas, optionally name it, and choose **Save shape**. Saved shapes are kept in this browser's local storage on this device; clearing site data removes them.

## Choose a departure airport

Search the airport field by airport name, city, ICAO code, or IATA code, then select the matching airport from the list. The built-in directory includes major airports around the world. Use **Use custom coordinates instead** for an airport or departure point that is not listed.

## GeoFS flight plans

Use **Download GeoFS JSON** or **Copy GeoFS JSON** in the Waypoints section. The JSON follows GeoFS's flight-plan structure: a top-level `version: 1` and a `route` array containing waypoint objects with `ident`, `type`, `lat`, `lon`, `alt`, `spd`, and `heading` fields. In GeoFS, open **NAV → Flight Plan → Import** and select the downloaded file (or paste the copied JSON if using the import text field). Waypoints are sampled along the route in order; the last waypoint closes the shape back toward its start. Verify the import and route in GeoFS, and check airspace and local rules before flying.
