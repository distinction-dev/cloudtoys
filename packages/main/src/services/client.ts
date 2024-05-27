const { fromIni } = require('@aws-sdk/credential-providers');
const { CloudWatchLogsClient } = require('@aws-sdk/client-cloudwatch-logs');
const { S3Client } = require('@aws-sdk/client-s3');

let clients: { [key: string]: any } = {};

export function initAWSClients({
  region,
  profile,
}: {
  region: string;
  profile?: string;
}) {
  try {
    clients['cloudWatchLogs'] = new CloudWatchLogsClient({
      credentials: fromIni({
        profile,
      }),
      region,
    });
    
    clients['s3'] = new S3Client({
      credentials: fromIni({
        profile,
      }),
      region,
    });
    
    return clients;
  } catch (e) {
    console.error('Could not initialize clients', e);
    return false;
  }
}

export const getAWSClient = (service: string) => clients[service];



// const { fromIni } = require('@aws-sdk/credential-providers');

// const { CloudWatchLogsClient } = require('@aws-sdk/client-cloudwatch-logs');

// let cloudWatchLogsClient: typeof CloudWatchLogsClient = null;

// export function initAWSClient({
//   region,
//   profile,
// }: {
//   region: string;
//   profile?: string;
// }) {
//   try {
//     cloudWatchLogsClient = new CloudWatchLogsClient({
//       credentials: fromIni({
//         profile,
//         // filepath: '~/.aws/credentials',
//         // configFilepath: '~/.aws/config',
//       }),
//       region,
//     });
//     return cloudWatchLogsClient;
//   } catch (e) {
//     console.error('Could not initialize client', e);
//     return false;
//   }
// }

// export const getAWSClient = () => cloudWatchLogsClient;
