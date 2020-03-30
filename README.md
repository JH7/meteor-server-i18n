[![Build Status](https://travis-ci.com/JH7/meteor-server-i18n.svg?branch=master)](https://travis-ci.com/JH7/meteor-server-i18n)
## Motivation
Ever needed to keep translations only available for the server side of Meteor? Me for sure. That's the reason why this small package exists.

## Installation
Easy peasy as always :smirk:
```
meteor add jh7:server-i18n
```

## Usage
First, initialize the package with your translation.json. You can put this file in `private/i18n/translations.json` or wherever you want.
```json
"de": {
  "test": {
    ...
  },
  "hello": "Hallo %s!",
  "items": "%s, dein Artikel: %s"
},
"en": {
  "test": {
    ...
  },
  "hello": "Hello %s!",
  "items": "%s, your item: %s"
}
```
```javascript
import { ServerI18n } from 'meteor/jh7:server-i18n';

ServerI18n.init(Assets.getText('i18n/translations.json')); // Make sure to overload init with a string!
```

You can start translating now
```javascript
ServerI18n.__('hello', 'en', 'Foo') // => "Hello Foo!"
ServerI18n.__('items', 'de', ['Peter', 'Ticket']) // => "Peter, dein Artikel: Ticket"
```

Using [SSR](https://github.com/meteorhacks/meteor-ssr) or similar packages? Gotcha:
```javascript
SSR.render('yourTemplate', {
  _: ServerI18n.ssrTranslation('en'),
});
```
using the helper in `yourTemplate`:
```handlebars
{{_ 'items' 'Eve' 'Ticket'}} => Eve, your item: Ticket
```
For the case that a language is not specified, you can specify a fallback language which will be used instead:
```javascript
ServerI18n.setDefaultLang('en');
```
To retrieve all initialized languages:
```javascript
ServerI18n.getLanguages();
```
## Contributing
Want to contribute? No problem. Just create a pull request :smile:
## License
MIT