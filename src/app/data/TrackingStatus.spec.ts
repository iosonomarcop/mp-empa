import { TrackingStatus } from './TrackingStatus';
import { Tracking } from './Tracking';
import { StatusLabel } from './StatusLabel';

describe('TrackingStatus', () => {
  it('should return label for delivered status', () => {
    const label = TrackingStatus.getLabelFrom({status: TrackingStatus.DELIVERED} as Tracking);

    const delivered = new StatusLabel('Delivered', 'ok');

    expect(label).toEqual(delivered);
  });

  it('should return label for in_transit status', () => {
    const label = TrackingStatus.getLabelFrom({status: TrackingStatus.TRANSIT} as Tracking);

    const transit = new StatusLabel('In Transit', 'info');

    expect(label).toEqual(transit);
  });

  it('should return label for undefined status', () => {
    const label = TrackingStatus.getLabelFrom({status: undefined} as Tracking);

    const undefinedStatus = new StatusLabel('Untracked', 'undefined');

    expect(label).toEqual(undefinedStatus);
  });

  it('should return label for undefined tracking', () => {
    const label = TrackingStatus.getLabelFrom(undefined);

    const undefinedTracking = new StatusLabel('Untracked', 'undefined');

    expect(label).toEqual(undefinedTracking);
  });
});
