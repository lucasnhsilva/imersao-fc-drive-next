import { DirectionsResponseData } from "@googlemaps/google-maps-services-js";

export type DirectionsData = DirectionsResponseData & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any;
};

export type RouteModel = {
  id: string;
  name: string;
  source: { name: string; location: { lat: number; lng: number } };
  destination: { name: string; location: { lat: number; lng: number } };
  distance: number;
  duration: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  directions: DirectionsResponseData & { request: any };
  created_at: Date;
  updated_at: Date;
};
