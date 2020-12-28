import { TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { MomentMap } from './moment-map.model';

describe('MomentMap', () => {
  let map: MomentMap<any, any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    map = new MomentMap();
  });

  it('#has should call super.has', () => {
    const hasSpy = spyOn(Map.prototype, 'has');
    map.has('some key');
    expect(hasSpy).toHaveBeenCalled();
  });

  it('#has should return false if there is no key', () => {
    const result = map.has(moment());
    expect(result).toBeFalse();
  });

  it('#has should return true if there is a key', () => {
    const key = moment();
    map.set(key, 'some value');
    const result = map.has(key);
    expect(result).toBeTruthy();
  });

  it('#get should call super.get', () => {
    const getSpy = spyOn(Map.prototype, 'get');
    map.get('some key');
    expect(getSpy).toHaveBeenCalled();
  });

  it('#get should return undefined if there is no key', () => {
    const result = map.get(moment());
    expect(result).toBeUndefined();
  });

  it('#get should return moment if there is a key', () => {
    const key = moment();
    map.set(key, 'some value');
    const result = map.get(key);
    expect(result).toBe('some value');
  });

  it('#delete should call super.delete', () => {
    const deleteSpy = spyOn(Map.prototype, 'delete');
    map.delete('some key');
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('#delete should return false if there is no key', () => {
    const result = map.delete(moment());
    expect(result).toBeFalse();
  });

  it('#delete should return true if object was deleted', () => {
    const key = moment();
    map.set(key, 'some value');
    const result = map.delete(key);
    expect(result).toBeTruthy();
  });
});
