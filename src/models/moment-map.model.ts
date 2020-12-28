import * as moment from 'moment';

export class MomentMap<T1, T2> extends Map {
  has(key: T1): boolean {
    if (!moment.isMoment(key)) {
      return super.has(key);
    }

    const mapKey: moment.Moment = this.getOriginalKey(key);
    return Boolean(mapKey);
  }

  get(key: T1): T2 {
    if (!moment.isMoment(key)) {
      return super.get(key);
    }

    const mapKey: moment.Moment = this.getOriginalKey(key);
    return super.get(mapKey);
  }

  delete(key: T1): boolean {
    if (!moment.isMoment(key)) {
      return super.delete(key);
    }

    const mapKey: moment.Moment = this.getOriginalKey(key);

    if (mapKey) {
      return super.delete(mapKey);
    }

    return false;
  }

  private getOriginalKey(key: moment.Moment): moment.Moment {
    const keys: moment.Moment[] = Array.from(this.keys());
    return keys.find((k) => k.isSame(key, 'date'));
  }
}
