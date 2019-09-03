import { TrackingStatus } from './TrackingStatus';

export interface Tracking {
  carrier: string;
  trackingCode: string;
  status: TrackingStatus;
}
