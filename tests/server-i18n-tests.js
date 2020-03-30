// Import and rename a variable exported by private-i18n.js.
import { ServerI18n } from 'meteor/jh7:server-i18n';

import { assert } from 'chai';

describe('server-i18n', () => {
  it('should throw errors if malicious use', () => {
    ServerI18n.init('{}');
    const langs = ServerI18n.getLanguages();
    assert.isArray(langs);
    assert.lengthOf(langs, 0);
    assert.throws(() => { ServerI18n.__('hello', 'de'); }, 'not initialized');
    assert.throws(() => { ServerI18n.__('test.count', 'en', 'foo'); }, 'not initialized');
    assert.throws(() => { ServerI18n.ssrTranslation('de')('hello', 'test'); }, 'not initialized');

    assert.throws(() => { ServerI18n.init('{}}'); }, 'Unexpected token } in JSON at position 2');
  });

  it('should work correctly', () => {
    const testI18n = {
      de: {
        hello: 'Hallo',
        test: {
          article: 'Du hast %s Artikel',
          count: '%s %s %s %s, toll',
        },
      },
      en: {
        hello: 'Hello',
        test: {
          article: 'You have %s articles',
          count: '%s %s %s %s, cool',
        },
      },
    };

    ServerI18n.init(JSON.stringify(testI18n));

    const langs = ServerI18n.getLanguages();
    assert.isArray(langs);
    assert.lengthOf(langs, 2);
    assert.equal(langs[0], 'de');
    assert.equal(langs[1], 'en');

    assert.equal(ServerI18n.__('hello', 'de'), 'Hallo');
    assert.equal(ServerI18n.__('hello', 'en', 'test'), 'Hello');

    assert.equal(ServerI18n.__('test.article', 'de', 'eins'), 'Du hast eins Artikel');
    assert.equal(ServerI18n.__('test.article', 'en', ['two', 'test']), 'You have two articles');

    assert.equal(ServerI18n.__('test.count', 'de', ['1', '2', '3', '4', '5']), '1 2 3 4, toll');
    assert.equal(ServerI18n.__('test.count', 'en', ['1', '2', '3', '4']), '1 2 3 4, cool');

    assert.equal(ServerI18n.__('test.notfound', 'de', ['1', '2', '3', '4', '5']), 'test.notfound');
  });

  it('should default correctly', () => {
    const testI18n = {
      de: {
        hello: 'Hallo',
        test: {
          article: 'Du hast %s Artikel',
          count: '%s %s %s %s, toll',
        },
      },
      en: {
        hello: 'Hello',
        test: {
          article: 'You have %s articles',
          count: '%s %s %s %s, cool',
        },
      },
    };

    ServerI18n.init(JSON.stringify(testI18n));
    ServerI18n.setDefaultLang('en');

    assert.equal(ServerI18n.__('hello', 'sl'), 'Hello');
    assert.equal(ServerI18n.__('hello', 'pl', 'test'), 'Hello');

    assert.equal(ServerI18n.__('test.article', 'afk', 'eins'), 'You have eins articles');
    assert.equal(ServerI18n.__('test.article', 'cn', ['two', 'test']), 'You have two articles');

    assert.equal(ServerI18n.__('test.count', 'cn', ['1', '2', '3', '4', '5']), '1 2 3 4, cool');
    assert.equal(ServerI18n.__('test.count', 'es', ['1', '2', '3', '4']), '1 2 3 4, cool');

    assert.equal(ServerI18n.__('test.notfound', 'tw', ['1', '2', '3', '4', '5']), 'test.notfound');

    ServerI18n.setDefaultLang(false);
    assert.throws(() => { ServerI18n.__('hello', 'cn'); }, 'not initialized');
  });

  it('translates via ssrTranslation', () => {
    const testI18n = {
      de: {
        hello: 'Hallo',
        test: {
          article: 'Du hast %s Artikel',
          count: '%s %s %s %s, toll',
        },
      },
      en: {
        hello: 'Hello',
        test: {
          article: 'You have %s articles',
          count: '%s %s %s %s, cool',
        },
      },
    };

    ServerI18n.init(JSON.stringify(testI18n));

    const ssrDe = ServerI18n.ssrTranslation('de');
    const ssrEn = ServerI18n.ssrTranslation('en');


    assert.equal(ssrDe('hello'), 'Hallo');
    assert.equal(ssrEn('hello', 'test'), 'Hello');

    assert.equal(ssrDe('test.article', 'eins'), 'Du hast eins Artikel');
    assert.equal(ssrEn('test.article', 'two', 'test'), 'You have two articles');

    assert.equal(ssrDe('test.count', '1', '2', '3', '4', '5'), '1 2 3 4, toll');
    assert.equal(ssrEn('test.count', '1', '2', '3', '4'), '1 2 3 4, cool');

    assert.equal(ssrDe('test.notfound', '1', '2', '3', '4', '5'), 'test.notfound');
  });
});
