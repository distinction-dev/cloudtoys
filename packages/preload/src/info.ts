import { version } from '../../../buildResources/meta.json';

export const versions = process.versions;
export const info = {
  name: 'CloudToys',
  versions: {
    app: version,
    ...versions,
  },
};
