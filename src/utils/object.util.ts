import { DynamicObject } from '../common/interfaces';

export default class ObjectUtil {
  static swap(obj: DynamicObject) {
    const reverse = {};
    for (const key of Object.keys(obj)) {
      reverse[obj[key]] = key;
    }
    return reverse;
  }

  static pick(obj: DynamicObject, fields: string[]) {
    const data = {};
    for (let i = 0, len = fields.length; i < len; i++) {
      obj[fields[i]] && (data[fields[i]] = obj[fields[i]]);
    }
    return data;
  }

  static omit(obj: DynamicObject, fields: string[]) {
    for (let i = 0, len = fields.length; i < len; i++) {
      delete obj[fields[i]];
    }
    return obj;
  }
}
