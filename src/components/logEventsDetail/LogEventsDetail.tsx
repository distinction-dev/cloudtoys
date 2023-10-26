import * as React from 'react'
import Accordion from '../../infrastructure/common/accordion/Accordion'
import { BiSolidRightArrow, BiSolidDownArrow } from 'react-icons/bi'
import { ImSpinner2 } from 'react-icons/im'
import { TfiReload } from 'react-icons/tfi'
import _ from 'lodash'

// let count = 0
const logEventFilterPatternRegex = /[^a-zA-Z_0-9]/
type logEventType = {
  timestamp?: string
  message?: string
}

type logEventsArrayType = {
  nextToken?: string
  events?: logEventType[]
}
const LogEventsDetail = ({ logGroupName, logStreamName }: { logGroupName: string; logStreamName: string }) => {
  const [logEvents, setLogEvents] = React.useState<logEventsArrayType>({})
  const [logEventLoading, setLogEventLoading] = React.useState(false)
  // const [loading, setLoading] = React.useState(false)
  const [loadMore, setLoadMore] = React.useState(false)
  const fetchLogsEvent = React.useCallback(
    (logStreamName: string, logGroupName: string, nextToken?: string, filterPattern?: string) => {
      nextToken ? setLoadMore(true) : setLogEventLoading(true)
      const limit = filterPattern ? 200 : 10
      try {
        window.electronApi
          .invoke('FilterLogEventsCommand', {
            limit: limit,
            ...(filterPattern && { filterPattern: filterPattern.replace(logEventFilterPatternRegex, ' ') }),
            logGroupName: logGroupName,
            logStreamNames: [logStreamName],
            ...(nextToken && { nextToken: nextToken }),
          })
          .then((res: { events: []; nextToken: string }) => {
            if (nextToken) {
              setLogEvents((prevState) => {
                return {
                  ...res,
                  events: [...(prevState?.events ? prevState.events : []), ...(res?.events ? res.events : [])],
                  nextToken: res?.nextToken && res.events?.length >= limit ? res?.nextToken : undefined,
                }
              })
              setLoadMore(false)
              setLogEventLoading(false)
            } else {
              res &&
                setLogEvents({
                  ...res,
                  nextToken: res?.nextToken && res.events?.length >= limit ? res?.nextToken : undefined,
                })
              setLogEventLoading(false)
            }
          })
          .catch(() => {
            setLogEventLoading(false)
          })
      } catch {
        setLogEventLoading(false)
        setLoadMore(false)
      }
    },
    [],
  )

  const handleOnchange = React.useCallback(
    (event: { target: { value: string } }) => {
      const searchInput = event?.target?.value
      _.debounce(fetchLogsEvent, 600)(logStreamName, logGroupName, '', searchInput ?? '')
    },
    [fetchLogsEvent, logGroupName, logStreamName],
  )

  React.useEffect(() => {
    fetchLogsEvent(logStreamName, logGroupName)
  }, [fetchLogsEvent, logGroupName, logStreamName])
  return (
    <div
      className="m-1 rounded overflow-y-auto overflow-x-hidden max-h-96 pr-1 relative"
      style={{ minHeight: '10rem' }}
    >
      <>
        <div className="flex flex-col justify-start items-start sticky top-0 w-full z-50">
          <div className="flex justify-between bg-gray-300 w-full">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleOnchange}
              className="w-full font-mono focus:outline-none bg-white shadow-sm shadow-black/10 hover:bg-white/70 font-semibold py-1 m-1 mx-2 px-3  hover:border-transparent rounded-2xl"
            />
            <button
              className="appearance-none bg-transparent border-none focus:outline-none p-2 rounded-xl hover:bg-slate-500 
                hover:text-white font-bold active:text-white/80 transition-transform transform hover:scale-105 ease-out duration-500"
              onClick={() => fetchLogsEvent(logStreamName, logGroupName)}
            >
              <TfiReload className={`w-4 h-4 `} />
            </button>
          </div>
          <div className="flex justify-between w-full bg-gray-300 z-10 shadow-md">
            <div className="text-sm text-center p-1 w-1/4 font-bold">Time</div>
            <div className="text-center p-1 w-3/4 font-bold">Message</div>
          </div>
        </div>
        {logEventLoading ? (
          <div className="w-full flex justify-center items-center py-3">
            &nbsp;
            <span className="text-secondary-500 ">
              <ImSpinner2 className={'animate-spin w-5 h-5'} />
            </span>
            &nbsp;Loading ...
          </div>
        ) : (
          <>
            {logEvents?.events?.length ? (
              <>
                {logEvents?.events?.map((event, index) => {
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
                            navigator.clipboard.writeText(event?.message as string)
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </Accordion>
                  )
                })}

                {!loadMore && !logEventLoading && logEvents?.nextToken && (
                  <div
                    role="button"
                    tabIndex={-1}
                    onClick={() => fetchLogsEvent(logStreamName, logGroupName, logEvents?.nextToken)}
                    className="text-blue-500 text-sm hover:text-blue-600 text-center font-mono hover:bg-black/5 rounded"
                  >
                    Load More...
                  </div>
                )}
                {loadMore && (
                  <div className="text-sm hover:text-blue-600 flex justify-center items-center font-mono hover:bg-black/5 rounded text-secondary-500">
                    <ImSpinner2 className={'animate-spin w-5 h-5'} />
                  </div>
                )}
              </>
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
