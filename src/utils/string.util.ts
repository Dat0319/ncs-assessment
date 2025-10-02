import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import lib from 'crypto-js/lib-typedarrays';

export class StringUtil {
  static encrypt(data: string, secretKey: string): string {
    return AES.encrypt(data, secretKey).toString();
  }

  static decrypt(data: string, secretKey: string): string {
    return AES.decrypt(data, secretKey).toString(encUtf8);
  }

  static random(): string {
    return lib.random(128 / 8).toString();
  }

  /**
   * @method randomNumber
   * @param {number} length value param
   */
  static randomNumber(length: number) {
    let number = Math.floor(Math.random() * Math.pow(10, length)) + '';
    while (number.length < length) {
      number = '0' + number;
    }
    return number;
  }

  /**
   * @method camelCase
   * @param {string} name value param
   */
  static camelCase(name: string) {
    return name
      .split(' ')
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
      .join('');
  }

  /**
   * @method titleCase
   * @param {string} name value param
   */
  static titleCase(name: string) {
    return name
      .split(' ')
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * @method snakeCase
   * @param {string} name
   * @returns {string}
   */
  static snakeCase(name: string): string {
    return name
      .split(' ')
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
      .join('_');
  }
}
