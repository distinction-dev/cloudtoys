const { fromIni, fromSSO } = require('@aws-sdk/credential-providers')

const { CloudWatchLogsClient } = require('@aws-sdk/client-cloudwatch-logs')

let cloudWatchLogsClient: typeof CloudWatchLogsClient = null

export function initAWSClient({ region, profile }: { region: string; profile?: string }) {
  try {
    cloudWatchLogsClient = new CloudWatchLogsClient({
      credentials: fromIni({
        profile,
        // filepath: '~/.aws/credentials',
        // configFilepath: '~/.aws/config',
      }),
      region,
    })
    return cloudWatchLogsClient
  } catch (e) {
    console.error('Could not initialize client', e)
    return false
  }
}

export const getAWSClient = () => cloudWatchLogsClient
