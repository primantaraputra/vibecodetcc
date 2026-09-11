'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, AlertTriangle, CheckCircle2, RotateCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface Props {
  latitude: number;
  longitude: number;
  accuracy: number;
  address: string;
  onLocationChange: (lat: number, lng: number, address: string, accuracy: number) => void;
}

export default function LocationConfirmMap({
  latitude,
  longitude,
  accuracy,
  address,
  onLocationChange,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const [currentLat, setCurrentLat] = useState(latitude || -6.9175); // Default Bandung
  const [currentLng, setCurrentLng] = useState(longitude || 107.6191);
  const [currentAcc, setCurrentAcc] = useState(accuracy || 15);
  const [currentAddr, setCurrentAddr] = useState(address || '');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Reverse Geocode using Nominatim OpenStreetMap
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'id',
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const display =
          data.display_name ||
          `${data.address?.road || 'Jl. Lokasi Survei'}, ${data.address?.suburb || 'Kelurahan'}, ${
            data.address?.city || 'Bandung'
          }`;
        setCurrentAddr(display);
        onLocationChange(lat, lng, display, currentAcc);
      }
    } catch {
      // Fallback if nominatim has rate limit
      const fallbackAddr = `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setCurrentAddr(fallbackAddr);
      onLocationChange(lat, lng, fallbackAddr, currentAcc);
    }
  };

  // Get Live GPS Location
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung Geolocation API.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);

        setCurrentLat(lat);
        setCurrentLng(lng);
        setCurrentAcc(acc);
        setIsLocating(false);

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 17);
          markerRef.current.setLatLng([lat, lng]);

          if (circleRef.current) {
            circleRef.current.setLatLng([lat, lng]);
            circleRef.current.setRadius(acc);
          }
        }

        reverseGeocode(lat, lng);
      },
      (err) => {
        setIsLocating(false);
        setGpsError(
          `Gagal mengambil GPS (${err.message}). Anda dapat menggeser pin manual pada peta atau mengisi alamat manual.`
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      // Fix Leaflet default icon paths in Next.js
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current).setView([currentLat, currentLng], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Marker (Draggable)
        const marker = L.marker([currentLat, currentLng], {
          draggable: true,
          icon: customIcon,
        }).addTo(map);

        marker.bindPopup('<b>Titik Kunjungan Lapangan</b><br>Geser pin jika kurang presisi.').openPopup();

        // Accuracy Circle
        const circle = L.circle([currentLat, currentLng], {
          radius: currentAcc,
          color: '#0284c7',
          fillColor: '#38bdf8',
          fillOpacity: 0.2,
          weight: 1.5,
        }).addTo(map);

        // Dragend listener
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setCurrentLat(pos.lat);
          setCurrentLng(pos.lng);
          circle.setLatLng(pos);
          reverseGeocode(pos.lat, pos.lng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        circleRef.current = circle;
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="text-xs space-y-0.5">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Geolokasi Lapangan</span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            Lat: {currentLat.toFixed(6)}, Lng: {currentLng.toFixed(6)} • Akurasi: ±{currentAcc}m
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetLiveLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-civic-600 hover:bg-civic-700 rounded-lg shadow-xs transition disabled:opacity-50"
        >
          {isLocating ? (
            <RotateCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{isLocating ? 'Mencari GPS...' : 'Ambil GPS Presisi'}</span>
        </button>
      </div>

      {gpsError && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner h-64 sm:h-72 w-full z-0">
        <div ref={mapContainerRef} className="h-full w-full" />
        <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-slate-600 font-medium shadow-xs">
          💡 Tips: Anda dapat menggeser (drag) pin merah untuk menyempurnakan lokasi presisi rumah warga.
        </div>
      </div>

      {/* Auto-filled / Editable Address */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Alamat Terdeteksi / Hasil Reverse Geocoding
        </label>
        <textarea
          rows={2}
          value={currentAddr}
          onChange={(e) => {
            setCurrentAddr(e.target.value);
            onLocationChange(currentLat, currentLng, e.target.value, currentAcc);
          }}
          placeholder="Alamat akan terisi otomatis saat pin digeser atau GPS didapat..."
          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );
}
