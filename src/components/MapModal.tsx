// src/components/MapModal.tsx
import { useEffect, useRef } from 'react';
import type { CityData } from '../data/cityData';
import './MapModal.css';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityData: CityData;
  lang: 'ko' | 'en';
}

export function MapModal({ isOpen, onClose, cityData, lang }: MapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Leaflet이 로드될 때까지 대기
    const initMap = () => {
      if (!window.L || !mapContainerRef.current) {
        // Leaflet이 아직 로드되지 않았으면 재시도
        setTimeout(initMap, 100);
        return;
      }

      const L = window.L;

      // 기존 지도가 있으면 제거
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // 지도 초기화
      const map = L.map(mapContainerRef.current).setView([cityData.lat, cityData.lng], 10);

      // OpenStreetMap 타일 레이어 추가
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // 도시 마커 추가
      const cityName = lang === 'ko' ? cityData.nameKo : cityData.nameEn;
      const countryName = lang === 'ko' ? (cityData.countryKo || cityData.country) : cityData.country;
      const markerLabel = `${cityName}, ${countryName}`;

      L.marker([cityData.lat, cityData.lng])
        .addTo(map)
        .bindPopup(markerLabel)
        .openPopup();

      mapRef.current = map;
    };

    initMap();

    // 클린업
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen, cityData, lang]);

  if (!isOpen) return null;

  const cityName = lang === 'ko' ? cityData.nameKo : cityData.nameEn;
  const countryName = lang === 'ko' ? (cityData.countryKo || cityData.country) : cityData.country;

  return (
    <div className="mapModal" onClick={onClose}>
      <div className="mapModal__content" onClick={(e) => e.stopPropagation()}>
        <div className="mapModal__header">
          <div className="mapModal__title">
            <span className="mapModal__cityName">{cityName}</span>
            {countryName && (
              <span className="mapModal__countryName">{countryName}</span>
            )}
          </div>
          <button
            type="button"
            className="mapModal__closeButton"
            onClick={onClose}
            aria-label={lang === 'ko' ? '닫기' : 'Close'}
          >
            ✕
          </button>
        </div>
        <div className="mapModal__map" ref={mapContainerRef} />
      </div>
    </div>
  );
}

