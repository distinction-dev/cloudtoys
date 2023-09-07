

const module = require('@aws-sdk/client-cloudwatch-logs')

import _client from './client'

const _services: any = {}

Object.keys(module)
  .filter((e) => e.match(/^(\$|__)?\w+Command$/))
  .forEach((key) => {
    _services[key] = (args: any) => _client.send(new module[key](args))
  })

export default _services
