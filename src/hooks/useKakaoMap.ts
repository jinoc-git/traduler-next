import { useState } from 'react';

import type {
  ControlPosition,
  LatLng,
  MakeMapArgs,
  MakePolylineArgs,
} from '@/types/aboutKakaoMap';

declare global {
  interface Window {
    kakao: any;
  }
}

const useKakaoMap = () => {
  const [map, setMap] = useState<any>(null);

  const makeLatLng = ({ lat, lng }: LatLng) => {
    return new window.kakao.maps.LatLng(lat, lng);
  };

  const makeZoom = (map: any, zoom: ControlPosition) => {
    const zoomControl = new window.kakao.maps.ZoomControl();
    map.addControl(zoomControl, window.kakao.maps.ControlPosition[zoom]);
  };

  const makeMapType = (map: any, mapType: ControlPosition) => {
    const mapTypeControl = new window.kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, window.kakao.maps.ControlPosition[mapType]);
  };

  const makeMap = (args: MakeMapArgs) => {
    const { containerId, center, level, zoom, mapType } = args;

    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById(containerId);
      const mapOption = {
        center: makeLatLng(center),
        level,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      if (zoom) makeZoom(map, zoom);
      if (mapType) makeMapType(map, mapType);

      setMap(map);
    });
  };

  const makeMarker = ({ lat, lng }: LatLng) => {
    if (map === null) throw new Error('kakao map is null');

    const position = makeLatLng({ lat, lng });
    const marker = new window.kakao.maps.Marker({ position });
    marker.setMap(map);
  };

  const makePolyline = (args: MakePolylineArgs) => {
    return new window.kakao.maps.Polyline(args);
  };

  const makeBounds = () => {
    return new window.kakao.maps.LatLngBounds();
  };

  return { map, makeMap, makeLatLng, makeMarker, makePolyline, makeBounds };
};

export default useKakaoMap;
