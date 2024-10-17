import mapboxgl from 'mapbox-gl';
import '../App.css';

export const addMarker = (mapRef) => {
    mapRef.current.on('load', () => {
        mapRef.current.addSource('places', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {
                            description:
                                '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
                            icon: 'theatre'
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [-77.038659, 38.931567]
                        }
                    },
                    {
                        type: 'Feature',
                        properties: {
                            description:
                                '<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a <a href="http://madmens5finale.eventbrite.com/" target="_blank" title="Opens in a new window">Mad Men Season Five Finale Watch Party</a>, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>',
                            icon: 'theatre'
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [-77.003168, 38.894651]
                        }
                    },
                    {
                        type: 'Feature',
                        properties: {
                            description:
                                '<strong>HELLO FUTURE</strong><p><a href="https://www.hashinals.com/" target="_blank" title="Opens in a new window">Hashinals</a></p>',
                            icon: 'bar'
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [-77.090372, 38.881189]
                        }
                    }
                ]
            },
            cluster: true, // Enable clustering
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        // Add a layer for the clusters
        mapRef.current.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'places',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6', // Color for clusters with 1-9 points
                    10,
                    '#f1f075', // Color for clusters with 10-29 points
                    30,
                    '#f28cb1' // Color for clusters with 30+ points
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    15, // Radius for clusters with 1-9 points
                    10,
                    20, // Radius for clusters with 10-29 points
                    30,
                    25 // Radius for clusters with 30+ points
                ]
            }
        });

        // Add a layer for the cluster count labels
        mapRef.current.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'places',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        // Add a layer for the individual markers
        mapRef.current.addLayer({
            id: 'unclustered-point',
            type: 'symbol',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            layout: {
                'icon-image': ['get', 'icon'],
                'icon-allow-overlap': true
            }
        });

        // When a cluster is clicked, zoom in
        mapRef.current.on('click', 'clusters', (e) => {
            const features = mapRef.current.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            mapRef.current.getSource('places').getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    mapRef.current.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        // Show a popup when an unclustered point is clicked
        mapRef.current.on('click', 'unclustered-point', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(`<div class="custom-popup">${description}</div>`)
                .addTo(mapRef.current);
        });

        mapRef.current.on('mouseenter', 'clusters', () => {
            mapRef.current.getCanvas().style.cursor = 'pointer';
        });
        mapRef.current.on('mouseleave', 'clusters', () => {
            mapRef.current.getCanvas().style.cursor = '';
        });
    });
};
