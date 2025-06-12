import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import HeatLayer from './HeatLayer'; 

L.Map.addInitHook(function () {
  this.createPane('labels');
  this.getPane('labels').style.zIndex = 650;
  this.getPane('labels').style.pointerEvents = 'none';
});

function Map() {
  const [speciesData, setSpeciesData] = useState(null);
  const [heatPoints, setHeatPoints] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    fetch('/koaladata.json')
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.features.filter((f) => {
          try {
            const type = f.geometry.type;
            const coords = f.geometry.coordinates;
            if (type === "Polygon" && coords[0]?.[0]) {
              const [lng, lat] = coords[0][0];
              return lat >= -29.5 && lat <= -9 && lng >= 138 && lng <= 155;
            }
            if (type === "MultiPolygon" && coords[0]?.[0]?.[0]) {
              const [lng, lat] = coords[0][0][0];
              return lat >= -29.5 && lat <= -9 && lng >= 138 && lng <= 155;
            }
            return false;
          } catch {
            return false;
          }
        });

        const first500 = {
          ...data,
          features: filtered.slice(0, 500),
        };

        const heatData = first500.features.map((f) => {
          try {
            const coords = f.geometry.coordinates;
            const type = f.geometry.type;
            const props = f.properties;
            let lat, lng;
            if (type === "Polygon") {
              [lng, lat] = coords[0][0];
            } else if (type === "MultiPolygon") {
              [lng, lat] = coords[0][0][0];
            }
            const intensity = props.area_ha ? Math.max(props.area_ha / 100, 1) : 1;
            return [lat, lng, intensity];
          } catch {
            return null;
          }
        }).filter(Boolean);

        setHeatPoints(heatData);
        setSpeciesData(first500);
      })
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <MapContainer
        center={[-21.5, 145]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        {/* Satellite base layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri'
        />

        {/* Optional city/town labels */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
          pane="labels"
          attribution='© CartoDB — OpenStreetMap contributors'
        />

        {/* Heatmap layer */}
        {heatPoints.length > 0 && <HeatLayer points={heatPoints} />}

        {/* Koala habitat zones */}
        {speciesData && (
          <GeoJSON
            data={speciesData}
            style={() => ({
              color: 'transparent',
              weight: 1,
              fillOpacity: 0.1,
            })}
            onEachFeature={(feature, layer) => {
              const props = feature.properties;
              layer.bindPopup(`
                <strong>Koala Habitat Zone</strong><br/>
                Habitat Value: ${props.hsm_value || "Unknown"}<br/>
                Habitat Code: ${props.hsm_code || "N/A"}<br/>
                Cover Type: ${props.mcover || "Unknown"}<br/>
                Scientific Name: <em>${props.sci_name || "Unknown"}</em><br/>
                Area: ${props.area_ha ? props.area_ha.toFixed(2) + " ha" : "Unknown"}
              `);
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;
