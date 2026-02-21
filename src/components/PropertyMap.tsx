'use client';

import { useRef, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export function PropertyMap({ latitude, longitude, className = '' }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !containerRef.current) return;

    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = token;
      const map = new mapboxgl.default.Map({
        container: containerRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude],
        zoom: 14,
      });
      new mapboxgl.default.Marker().setLngLat([longitude, latitude]).addTo(map);
      return () => map.remove();
    }).catch(() => {
      // Fallback: OpenStreetMap embed si pas Mapbox
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <iframe
            width="100%"
            height="100%"
            style="border:0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}"
          ></iframe>
        `;
      }
    });
  }, [latitude, longitude]);

  return <div ref={containerRef} className={`h-64 w-full rounded-lg ${className}`} />;
}
