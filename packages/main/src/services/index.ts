const cloudwatchLogsModule = require('@aws-sdk/client-cloudwatch-logs');
const s3Module = require('@aws-sdk/client-s3');

import { initAWSClients, getAWSClient } from './client';

let _clients: { [key: string]: { send: (arg0: unknown) => unknown } };

const _services = {
  initClients(args: { region: string; profile?: string }) {
    _clients = { ...initAWSClients(args) };
  },
};

const addServiceCommands = (module: any, serviceName: string) => {
  Object.keys(module)
    .filter((e) => e.match(/^(\$|__)?\w+Command$/))
    .forEach((key) => {
      _services[key] = (args: unknown) =>
        getAWSClient(serviceName).send(new module[key](args));
    });
};

addServiceCommands(cloudwatchLogsModule, 'cloudWatchLogs');
addServiceCommands(s3Module, 's3');

export default _services;

// const module = require('@aws-sdk/client-cloudwatch-logs');

// import { initAWSClient } from './client';

// let _client: { send: (arg0: unknown) => unknown; };

// const _services = {
//   initClient(args: { region: string; profile?: string | undefined }) {
//     _client = initAWSClient(args);
//   },
// };

// Object.keys(module)
//   .filter((e) => e.match(/^(\$|__)?\w+Command$/))
//   .forEach((key) => {
//     _services[key] = (args: unknown) => _client.send(new module[key](args));
//   });

// export default _services;
