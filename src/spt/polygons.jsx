// ./spt/polygons.jsx
import { polygons } from "./poly";

export const addPolygonLayer = (mapRef) => {
  // Add the polygon sources and layers once the map has loaded
  mapRef.current.on('load', () => {
    polygons.forEach((polygon) => {
      // Add the geojson source with polygon coordinates
      mapRef.current.addSource(`${polygon.id}-source`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            link: polygon.clickUrl // Link to open on click
          },
          geometry: {
            type: 'Polygon',
            coordinates: polygon.coordinates
          }
        }
      });

      // Load the image for the polygon overlay
      mapRef.current.loadImage(polygon.imageUrl, (error, image) => {
        if (error) throw error;
        // Add the image to the map (this loads it only once)
        mapRef.current.addImage(`${polygon.id}-pattern`, image);

        // Add a layer using the polygon source
        mapRef.current.addLayer({
          id: `${polygon.id}-pattern-layer`,
          type: 'fill',
          source: `${polygon.id}-source`,
          paint: {
            'fill-color': 'rgba(255, 255, 255, 0)', // Transparent fill to show the image
            'fill-opacity': 0 // Ensure the fill is transparent if using image overlay
          }
        });

        // Add a layer to display the image overlay
        mapRef.current.addLayer({
          id: `${polygon.id}-image-layer`,
          type: 'raster', // Use raster type for image
          source: {
            type: 'image',
            url: polygon.imageUrl, // Image URL
            coordinates: polygon.imageOverlayCoordinates // Coordinates to define where to place the image
          }
        });

        // Add a click event listener for the polygon layer
        mapRef.current.on('click', `${polygon.id}-pattern-layer`, (e) => {
          const properties = e.features[0].properties;
          if (properties.link) {
            window.open(properties.link, '_blank'); // Open the link in a new tab
          }
        });

        // Change the cursor to a pointer when hovering over the polygon
        mapRef.current.on('mouseenter', `${polygon.id}-pattern-layer`, () => {
          mapRef.current.getCanvas().style.cursor = 'pointer';
        });

        // Change the cursor back to default when not hovering over the polygon
        mapRef.current.on('mouseleave', `${polygon.id}-pattern-layer`, () => {
          mapRef.current.getCanvas().style.cursor = '';
        });
      });
    });
  });
};
