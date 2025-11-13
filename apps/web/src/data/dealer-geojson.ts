import type { FeatureCollection, Position } from 'geojson';

export const DEALER_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Finspeed Dealer - Sarin Farm',
        postal: '201306'
      },
      geometry: {
        type: 'Point',
        coordinates: [77.477, 28.528] as Position
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Finspeed Dealer - Krystal Height',
        postal: '201306'
      },
      geometry: {
        type: 'Point',
        coordinates: [77.437, 28.601] as Position
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Finspeed Studio - Pune',
        postal: '411045'
      },
      geometry: {
        type: 'Point',
        coordinates: [73.786, 18.559] as Position
      }
    }
  ]
};
