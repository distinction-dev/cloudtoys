const { version } = require('./package.json');

if (process.env.VITE_APP_VERSION === undefined) {
  process.env.VITE_APP_VERSION = version;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'app.cloudtoys.www',
  productName: 'CloudToys',
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  extraResources: ['buildResources/icons/**'],
  files: ['packages/**/dist/**'],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
    homepage: 'https://github.com/distinction-dev/cloudtoys',
    description: 'CloudToys',
  },
  mac: {
    icon: 'assets/icons/CloudToys.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'buildResources/entitlements.mac.inherit.plist',
    entitlementsInherit: 'buildResources/entitlements.mac.inherit.plist',
    category: 'public.app-category.utilities',
    target: ['dmg'],
    publish: 'github',
  },
  linux: {
    icon: 'assets/icons/linuxIcons',
    category: 'Utility',
    target: ['deb', 'AppImage'],
    publish: 'github',
    desktop: {
      Icon: 'CloudToys',
      MimeType: 'x-scheme-handler/CloudToys;',
    },
  },
  win: {
    icon: 'assets/icons/CloudToys.ico',
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
      {
        target: 'portable',
        arch: ['x64'],
      },
    ],
    publish: 'github',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: false,
    differentialPackage: false,
  },
  portable: {
    artifactName: '${productName}Portable.${ext}',
  },
  dmg: {
    sign: false,
  },
  afterSign: 'scripts/notarize.js',
};

module.exports = config;
