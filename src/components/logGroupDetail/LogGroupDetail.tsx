import * as React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}
const LogGroupDetail = () => {
  const [logStreams, setLogStreams] = React.useState([])
  const navigate = useNavigate()

  const query = useQuery()
  const fetchLogs = React.useCallback((logGroupName: string) => {
    window.electronApi
      .invoke('DescribeLogStreamsCommand', {
        logGroupName: logGroupName,
        // {
        descending: true,
        limit: 50,
        orderBy: 'LastEventTime',
        filterExpiredLogStreams: true,
        // logGroupName: '/aws/lambda/ProvisionConcurrenyDemo',
        // }
      })
      .then((res) => {
        res && setLogStreams(res)
        console.log('log stream============>', res)
      })
  }, [])
  React.useEffect(() => {
    fetchLogs(query.get('logGroupName') as string)
  }, [fetchLogs, query])
  return (
    <div className="flex flex-col justify-start items-start h-full">
      <div className="flex m-1 shadow-lg bg-black/5 p-2 rounded-lg w-full">
        <h3 className="text-xl font-bold whitespace-nowrap">Log Group :&nbsp;</h3>
        <h3 className="text-xl font-bold">
          <Link to={`/log-group?logGroupName=${query.get('logGroupName')}`}>{query.get('logGroupName')}</Link>
        </h3>
      </div>

      <div className="m-1 w-full">
        <h2 className="text-xl font-bold">Log Streams </h2>
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
                  Log stream
                </th>
                <th style={{ borderRadius: '0px 5px 5px 0' }} className="bg-gray-400">
                  Last event time
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {logStreams?.logStreams?.length ? (
                logStreams?.logStreams?.map((logStream, index) => {
                  return (
                    <tr key={logStream?.arn + '_' + index} className="hover:bg-black/10 rounded-lg p-1">
                      <Link
                        to={`/log-events?logGroupName=${query.get(
                          'logGroupName',
                        )}&logStreamName=${logStream?.logStreamName}}`}
                      >
                        {logStream?.logStreamName}
                      </Link>
                      <td className="p-1">
                        {logStream?.creationTime && new Date(logStream?.creationTime).toLocaleString()}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr className="w-full flex justify-center items-center">
                  <td rowSpan="2">
                    <h4>No Stream Available!</h4>
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

export default LogGroupDetail
