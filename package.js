Package.describe({
  name: 'jh7:server-i18n',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Private i18n for server side only.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/JH7/meteor-server-i18n',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse((api) => {
  Npm.depends({
    'lodash.get': '4.4.2',
  });
  api.versionsFrom('1.0');
  api.use('ecmascript@0.12.4');
  api.mainModule('server-i18n.js', 'server');
});

Package.onTest((api) => {
  Npm.depends({
    'lodash.get': '4.4.2',
    chai: '4.2.0',
  });
  api.use('ecmascript@0.12.4');
  api.use('meteortesting:mocha@1.1.1');
  api.use('practicalmeteor:chai@2.1.0_1');
  api.use('jh7:server-i18n@0.0.1');
  api.mainModule('server-i18n-tests.js', 'server');
});
