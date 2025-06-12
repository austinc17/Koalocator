// HeatLayer.js
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import { useMap } from 'react-leaflet';

function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 12,
      blur: 15,
      maxZoom: 15,
      gradient: {
        0.2: 'blue',
        0.4: 'lime',
        0.6: 'orange',
        0.8: 'red'
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default HeatLayer;
