declare global {
  interface Window {
    ymaps: {
      ready: (callback: () => void) => void;
      Map: new (element: HTMLElement, options: any) => any;
      Placemark: new (coordinates: [number, number], properties?: any, options?: any) => any;
      geocode: (query: string, options?: any) => Promise<any>;
    };
  }
}

export {}; 