const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/MapView.jsx', 'utf8');

// Add recenterTrigger to MapView props
code = code.replace(/activeFuelLabel,\s*selectedStationId,/, 'activeFuelLabel,\n  selectedStationId,\n  recenterTrigger,');

// Add a new FlyToUser component inside MapView
const flyToCode = `
function FlyToUser({ center, trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0 && center) {
      map.flyTo(center, 15, { animate: true, duration: 1 });
    }
  }, [trigger, map]); // Only run when trigger changes
  return null;
}
`;

// Insert it right before MapUpdater
code = code.replace(/function MapUpdater/, flyToCode + '\nfunction MapUpdater');

// Render it inside MapContainer
code = code.replace(/<MapUpdater /, '<FlyToUser center={[userLocation.lat, userLocation.lng]} trigger={recenterTrigger} />\n        <MapUpdater ');

fs.writeFileSync('frontend/src/components/MapView.jsx', code, 'utf8');
