import * as React from 'react'
import Accordion from '../../infrastructure/common/accordion/Accordion'
import { BiSolidRightArrow, BiSolidDownArrow } from 'react-icons/bi'
// A custom hook that builds on useLocation to parse
// the query string for you.
// function useQuery() {
//   const { search } = useLocation()
//   return React.useMemo(() => new URLSearchParams(search), [search])
// }
let count = 0
const LogEventsDetail = ({ logGroupName, logStreamName }: { logGroupName: string; logStreamName: string }) => {
  const [logStreams, setLogStreams] = React.useState([])
  const fetchLogsEvent = React.useCallback((logStreamName: string, logGroupName: string, nextToken?: string) => {
    count = count + 1
    window.electronApi
      .invoke(
        'GetLogEventsCommand',
        // {
        //   logGroupName: '/aws/lambda/ProvisionConcurrenyDemo',
        //   logStreamName: '2023/07/07/[$LATEST]c360b6c4afe54571ac6ced1c67b48c18',
        //   nextToken: 'b/37679317443761298858821888299956802137454328305390977024/s',
        //   limit: 200,
        //   startFromHead: false,
        // },
        {
          limit: 200,
          logGroupName: logGroupName,
          logStreamName: logStreamName,
          ...(nextToken && { nextToken: nextToken }),
          startFromHead: true,
        },
      )
      .then((res) => {
        console.log('count res=========>', nextToken || 'llll', count, res)
        if (!res?.events?.length && count < 2 && res?.nextBackwardToken) {
          console.log('iiiires=========>', res)
          fetchLogsEvent(logStreamName, logGroupName, res?.nextBackwardToken)
        } else {
          res && setLogStreams(res)
        }
      })
  }, [])

  React.useEffect(() => {
    fetchLogsEvent(logStreamName, logGroupName)
  }, [fetchLogsEvent, logGroupName, logStreamName])
  return (
    <div className="m-1 rounded">
      <div className="flex justify-between items-center">
        <div className="text-sm text-center p-1 w-1/4 font-bold">Time</div>
        <div className="text-center p-1 w-3/4 font-bold">Message</div>
      </div>

      {logStreams?.events?.length ? (
        logStreams?.events?.map((event, index) => {
          return (
            <Accordion
              openIcon={<BiSolidDownArrow className={'w-3 h-3'} />}
              closeIcon={<BiSolidRightArrow className={'w-3 h-3'} />}
              className={`border-2 rounded ${index % 2 === 0 ? 'bg-white/60' : 'bg-black/5'}`}
              key={event?.timestamp + '_' + index}
              leftAdornment={
                <div className="whitespace-nowrap text-sm">
                  {event?.timestamp && new Date(event?.timestamp).toLocaleString()}
                </div>
              }
              rightAdornment={
                <div className="overflow-hidden px-9 w-full text-ellipsis  whitespace-nowrap text-sm">
                  {event?.message?.trim()}
                </div>
              }
            >
              <div className="w-full overflow-auto p-4 font-light text-sm font-mono relative">
                <pre className="whitespace-pre-wrap">{event?.message}</pre>
                <button
                  className="absolute right-0 bottom-0 bg-transparent hover:bg-slate-500 text-slate-400 font-semibold hover:text-white py-1 m-1 px-3 border border-slate-400 hover:border-transparent rounded flex items-center justify-between"
                  onClick={() => {
                    navigator.clipboard.writeText(event?.message)
                  }}
                >
                  Copy
                </button>
              </div>
            </Accordion>
          )
        })
      ) : (
        <div className="w-full flex justify-center items-center">
          <h4>No Events Available!</h4>
        </div>
      )}
    </div>
  )
}

export default LogEventsDetail

// {/* <div className="flex m-1 shadow-lg bg-black/5 p-2 rounded-lg w-full">
//   <h3 className="text-xl font-bold whitespace-nowrap">Log Event :&nbsp;</h3>
//   <h3 className="text-xl font-bold">
//     <Link to={`/log-group?logGroupName=${query.get('logGroupName')}`}>{query.get('logGroupName')}</Link>
//     &nbsp;/&nbsp;
//     <Link
//       to={`/log-events?logGroupName=${query.get('logGroupName')}&logStreamName=${query.get('logStreamName')}}`}
//     >
//       {query.get('logStreamName')}
//     </Link>
//     {/* {query.get('logGroupName') + ' / ' + query.get('logStreamName')} */}
//   </h3>
// </div> */}
