const module = require('@aws-sdk/client-cloudwatch-logs');

import { initAWSClient } from './client';

let _client: { send: (arg0: unknown) => unknown; };

const _services = {
  initClient(args: { region: string; profile?: string | undefined }) {
    _client = initAWSClient(args);
  },
};

Object.keys(module)
  .filter((e) => e.match(/^(\$|__)?\w+Command$/))
  .forEach((key) => {
    _services[key] = (args: unknown) => _client.send(new module[key](args));
  });

export default _services;
