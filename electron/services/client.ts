const { fromIni, fromSSO } = require('@aws-sdk/credential-providers')

const { CloudWatchLogsClient } = require('@aws-sdk/client-cloudwatch-logs')

let cloudWatchLogsClient: typeof CloudWatchLogsClient = null

async function initClient() {
  try {
    cloudWatchLogsClient = new CloudWatchLogsClient({
      credentials: fromIni({
        // profile: '',
        // filepath: '~/.aws/credentials',
        // configFilepath: '~/.aws/config',
      }),
      // credentals: fromSSO({
      //   profile: '',
      // }),
      // clientConfig:{
      //   region: ''
      // },
      region: '',
    })
    // console.log(await cloudWatchLogsClient)
  } catch (e) {
    console.error('Could not initialize client', e)
  }
}

initClient()

export default cloudWatchLogsClient
