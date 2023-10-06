import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}
const LogEventsDetail = () => {
  const [logStreams, setLogStreams] = React.useState([])
  const query = useQuery()
  let count = 0
  const fetchLogsEvent = React.useCallback(
    (logStreamName: string, logGroupName: string, nextToken?: string) => {
      console.log('tttttttttt=========>', logStreamName, logGroupName)
      count = count + 1
      window.electronApi
        .invoke(
          'GetLogEventsCommand',
          {
            logGroupName: '/aws/lambda/ProvisionConcurrenyDemo',
            logStreamName: '2023/07/07/[$LATEST]c360b6c4afe54571ac6ced1c67b48c18',
            nextToken: 'b/37679317443761298858821888299956802137454328305390977024/s',
            limit: 200,
            startFromHead: false,
          },
          // {
          //   limit: 200,
          //   logGroupName: logGroupName,
          //   logStreamName: logStreamName,
          //   ...(nextToken && { nextToken: nextToken }),
          //   startFromHead: false,
          // },
        )
        .then((res) => {
          console.log('res=========>', res)
          if (!res?.events?.length && count < 2 && res?.nextBackwardToken) {
            console.log('iiiires=========>', res)
            fetchLogsEvent(logStreamName, logGroupName, res?.nextBackwardToken)
          } else {
            res && setLogStreams(res)
          }
        })
    },
    [count],
  )

  React.useEffect(() => {
    fetchLogsEvent(query.get('logStreamName'), query.get('logGroupName') as string)
  }, [fetchLogsEvent, query])
  return (
    <div className="flex flex-col justify-start items-start h-full">
      <div className="flex m-1 shadow-lg bg-black/5 p-2 rounded-lg w-full">
        <h3 className="text-xl font-bold whitespace-nowrap">Log Event :&nbsp;</h3>
        <h3 className="text-xl font-bold">
          <Link to={`/log-group?logGroupName=${query.get('logGroupName')}`}>{query.get('logGroupName')}</Link>
          &nbsp;/&nbsp;
          <Link
            to={`/log-events?logGroupName=${query.get('logGroupName')}&logStreamName=${query.get('logStreamName')}}`}
          >
            {query.get('logStreamName')}
          </Link>
          {/* {query.get('logGroupName') + ' / ' + query.get('logStreamName')} */}
        </h3>
      </div>

      <div className="m-1 w-full">
        <h2 className="text-xl font-bold">Log Events </h2>
      </div>
      <div className="shadow-lg bg-black/5 px-1 rounded-lg flex-1 w-full flex flex-col justify-center items-center ">
        <input
          type="text"
          placeholder="Search..."
          //   onChange={handleOnchange}
          className="w-full m-1 p-2 bg-black/5 rounded-lg text-slate-800 font-mono focus:outline-none"
        />
        <div className="bg-black/5 flex-1 w-full rounded-lg m-1 p-1">
          <table className="table-fixed w-full rounded-lg">
            <thead>
              <tr>
                <th style={{ borderRadius: '5px 0 0 5px' }} className="bg-gray-400">
                  Time
                </th>
                <th style={{ borderRadius: '0px 5px 5px 0' }} className="bg-gray-400">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {logStreams?.events?.length ? (
                logStreams?.events?.map((event, index) => {
                  return (
                    <tr
                      key={event?.timestamp + '_' + index}
                      className="hover:bg-black/10 rounded-lg border-b border-solid border-slate-400"
                    >
                      <td>{event?.timestamp && new Date(event?.timestamp).toLocaleString()}</td>
                      <td>{event?.message}</td>
                    </tr>
                  )
                })
              ) : (
                <tr className="w-full flex justify-center items-center">
                  <td>
                    <h4>No Events Available!</h4>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LogEventsDetail
