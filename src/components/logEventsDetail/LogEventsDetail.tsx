import * as React from 'react'
import Accordion from '../../infrastructure/common/accordion/Accordion'
import { BiSolidRightArrow, BiSolidDownArrow } from 'react-icons/bi'
import { ImSpinner2 } from 'react-icons/im'

let count = 0
const LogEventsDetail = ({ logGroupName, logStreamName }: { logGroupName: string; logStreamName: string }) => {
  const [logEvents, setLogEvents] = React.useState([])
  const [logEventLoading, setLogEventLoading] = React.useState(false)

  const fetchLogsEvent = React.useCallback((logStreamName: string, logGroupName: string, nextToken?: string) => {
    count = count + 1
    setLogEventLoading(true)
    try {
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
          if (!res?.events?.length && count < 2 && res?.nextBackwardToken) {
            fetchLogsEvent(logStreamName, logGroupName, res?.nextBackwardToken)
          } else {
            res && setLogEvents(res)
          }
          setLogEventLoading(false)
        })
    } catch {
      setLogEventLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchLogsEvent(logStreamName, logGroupName)
  }, [fetchLogsEvent, logGroupName, logStreamName])
  return (
    <div className="m-1 rounded overflow-y-auto overflow-x-hidden h-80 pr-1 relative">
      <>
        {logEventLoading ? (
          <div className="w-full flex justify-center items-center">
            &nbsp;
            <span className="text-secondary-500 ">
              <ImSpinner2 className={'animate-spin w-5 h-5'} />
            </span>
            &nbsp;Loading ...
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center sticky top-0 bg-gray-300 z-10 shadow-md">
              <div className="text-sm text-center p-1 w-1/4 font-bold">Time</div>
              <div className="text-center p-1 w-3/4 font-bold">Message</div>
            </div>
            {logEvents?.events?.length ? (
              logEvents?.events?.map((event, index) => {
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
          </>
        )}
      </>
    </div>
  )
}

export default LogEventsDetail
