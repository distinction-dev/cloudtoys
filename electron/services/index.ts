

const module = require('@aws-sdk/client-cloudwatch-logs')

import {initAWSClient, getAWSClient} from './client'

let _client: { send: (arg0: any) => any; }

const _services: any = {
  initClient(args: { region: string; profile?: string | undefined }) {
    _client = initAWSClient(args)
  },
}

Object.keys(module)
  .filter((e) => e.match(/^(\$|__)?\w+Command$/))
  .forEach((key) => {
    _services[key] = (args: any) => _client.send(new module[key](args))
  })

export default _services
