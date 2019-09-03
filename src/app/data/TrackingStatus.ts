import { StatusLabel } from './StatusLabel';
import { Tracking } from './Tracking';

export enum TrackingStatus {
  TRANSIT = 'in_transit',
  DELIVERED = 'delivered'
}

// tslint:disable-next-line:no-namespace
export namespace TrackingStatus {
  export function getLabelFrom(tracking: Tracking): StatusLabel {
    if (isNotDefined(tracking)) {
      return new StatusLabel('Untracked', 'undefined');
    }
    switch (tracking.status) {
      case TrackingStatus.DELIVERED:
        return new StatusLabel('Delivered', 'ok');
      case TrackingStatus.TRANSIT:
        return new StatusLabel('In Transit', 'info');
      default:
        return new StatusLabel('Untracked', 'undefined');
    }
  }

  function isNotDefined(tracking: Tracking) {
    return tracking === undefined || tracking === null;
  }

}

