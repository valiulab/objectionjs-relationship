import { irregulars } from '../consts/irregular-words.const';

export class StringUtils {
  public static isString(value: any): boolean {
    return value instanceof String || typeof value == 'string';
  }

  public static pluralize(word: string): string {
    if (irregulars[word]) {
      return irregulars[word];
    } else if (
      word[word.length - 1] === 's' ||
      word.endsWith('sh') ||
      word.endsWith('ch') ||
      word[word.length - 1] === 'x' ||
      word[word.length - 1] === 'z'
    ) {
      return word + 'es';
    } else if (word[word.length - 1] === 'y') {
      return word.substring(0, word.length - 1) + 'ies';
    } else {
      return word + 's';
    }
  }

  public static toLowerFirstLetter(string: string): string {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  public static orderAlphabetically(arr: string[]): string[] {
    return arr.sort((a, b) => a.localeCompare(b));
  }
}
