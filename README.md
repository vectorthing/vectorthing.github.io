# VectorThing

VectorThing is a browser-based air-art planner for GeoFS. Choose a built-in shape or draw and save your own, set the center and flight settings, preview the route, then export or copy a GeoFS flight-plan JSON file.


## Draw and save shapes

We've just added our newest feature! Draw and Save! Just select **Draw your own**, drag a closed path on the canvas, optionally name it, and choose **Save shape**. Saved shapes are kept in this browser's local storage on this device; clearing site data removes them.

## Choose a departure airport

Search the airport field by airport name, city, ICAO code, or IATA code, then select the matching airport from the list. The built-in directory includes major airports around the world. Use **Use custom coordinates instead** for an airport or departure point that is not listed.

## GeoFS flight plans

Use **Download GeoFS JSON** or **Copy GeoFS JSON** in the Waypoints section. GeoFS expects a raw array of waypoint objects, not a `version`/`route` wrapper: each waypoint includes `ident`, `type`, `lat`, `lon`, `alt`, `spd`, and optional `heading` fields. In GeoFS, open **NAV → Flight Plan → Import** and select the downloaded file (or paste the copied JSON array if using the import text field). Waypoints are sampled along the route in order; the last waypoint closes the shape back toward its start. Verify the import and route in GeoFS, and check airspace and local rules before flying.
