'use client';

import type { FeatureCollection } from 'geojson';

export type DealerMapPin = {
  name: string;
  postal: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
};

export function DealerMap({
  featureCollection,
  activePostal,
  onSelect
}: {
  featureCollection: FeatureCollection;
  activePostal: string | null;
  onSelect: (pin: DealerMapPin) => void;
}) {
  const pins = toPins(featureCollection);
  const activePin = pins.find((pin) => pin.postal === activePostal);

  return (
    <div
      data-testid="dealer-map"
      className="relative h-72 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
      aria-label="Dealer locations map"
    >
      <svg className="absolute inset-0" viewBox="0 0 100 100" role="presentation">
        <defs>
          <radialGradient id="radius" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>
        {activePin && (
          <circle
            cx={activePin.x}
            cy={activePin.y}
            r={15}
            fill="url(#radius)"
            stroke="#6366f1"
            strokeOpacity={0.2}
          />
        )}
      </svg>
      {pins.map((pin) => {
        const isActive = pin.postal === activePostal;
        return (
          <button
            key={`${pin.name}-${pin.postal}`}
            type="button"
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 px-2 py-1 text-xs font-semibold shadow transition ${
              isActive
                ? 'border-white bg-[var(--primary)] text-white'
                : 'border-white/40 bg-white/80 text-slate-900'
            }`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            aria-pressed={isActive}
              onClick={() => onSelect(pin)}
          >
            {pin.name.split('-')[0].trim()}
          </button>
        );
      })}
    </div>
  );
}

function toPins(collection: FeatureCollection): DealerMapPin[] {
  const coords = collection.features
    .map((feature) => {
      if (feature.geometry?.type !== 'Point') return null;
      const [lng, lat] = feature.geometry.coordinates;
      if (typeof lat !== 'number' || typeof lng !== 'number') return null;
      return {
        name: (feature.properties as Record<string, string>)?.name || feature.id?.toString() || 'Dealer',
        postal: (feature.properties as Record<string, string>)?.postal || '',
        lat,
        lng,
        x: normalize(lng, 73, 78),
        y: 100 - normalize(lat, 18, 29)
      } satisfies DealerMapPin;
    })
    .filter(Boolean) as DealerMapPin[];
  return coords;
}

function normalize(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}
