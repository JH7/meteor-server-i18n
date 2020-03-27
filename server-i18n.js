import get from 'lodash.get';

let i18nJson = {};
let defaultLang = false;


// eslint-disable-next-line
export const ServerI18n = {
  /**
   * Initializes the object with the given translation json (as string)
   * @param {string} i18nText The i18n string.
   * @throws JSONError
   */
  init(i18nText) {
    i18nJson = JSON.parse(i18nText);
  },
  /**
   * Sets a default lang which will be used if the specified lang
   * was not initialized.
   * @param {string} lang The language to default to.
   */
  setDefaultLang(lang) {
    defaultLang = lang;
  },
  /**
   * Translates a given key for a given language. Uses the default
   * lang if the lang given is not initialized and the default lang
   * was set via setDefaultLang.
   * @param {string} key The translation key
   * @param {string} lang The language to translate to
   * @param {string | string[]} sprintf The replacements for '%s'
   * @throws Error if the language is not initalized and
   */
  __(key, lang, sprintf) {
    let langToUse = lang;

    if (!i18nJson || !i18nJson[langToUse]) {
      if (!defaultLang) {
        throw new Error('not initialized');
      } else {
        langToUse = defaultLang;
      }
    }

    let value = get(i18nJson[langToUse], key, key);
    if (sprintf) {
      const workingArr = Array.isArray(sprintf) ? sprintf : [sprintf];

      for (let i = 0; i < workingArr.length; i += 1) {
        value = value.replace('%s', workingArr[i]);
      }
    }

    return value;
  },
  /**
   * Returns a translation function for using with SSR for example.
   * @param {string} lang The language to be used in the translations.
   * @returns {Function} The translation function (key, ...sprintfArgs)
   */
  ssrTranslation(lang) {
    return (key, ...args) => {
      let sprintf = false;
      if (args && args.length > 0) {
        sprintf = args;
      }

      return ServerI18n.__(key, lang, sprintf);
    };
  },
};
