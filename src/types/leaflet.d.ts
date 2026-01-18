// src/types/leaflet.d.ts
// Leaflet CDN 전역 타입 선언

declare namespace L {
  export interface MapOptions {
    center?: [number, number];
    zoom?: number;
    layers?: Layer[];
    [key: string]: any;
  }

  export interface TileLayerOptions {
    attribution?: string;
    maxZoom?: number;
    minZoom?: number;
    [key: string]: any;
  }

  export interface Layer {
    addTo(map: Map): Layer;
  }

  export interface Marker extends Layer {
    bindPopup(content: string): Marker;
    openPopup(): Marker;
  }

  export class Map {
    constructor(element: HTMLElement | string, options?: MapOptions);
    setView(center: [number, number], zoom: number): Map;
    remove(): void;
  }

  export class TileLayer implements Layer {
    constructor(urlTemplate: string, options?: TileLayerOptions);
    addTo(map: Map): TileLayer;
  }

  export class Marker implements Layer {
    constructor(latlng: [number, number], options?: any);
    addTo(map: Map): Marker;
    bindPopup(content: string): Marker;
    openPopup(): Marker;
  }

  export function map(element: HTMLElement | string, options?: MapOptions): Map;
  export function tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer;
  export function marker(latlng: [number, number], options?: any): Marker;
}

declare global {
  interface Window {
    L: typeof L;
  }
}

