import React, { Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import { AiOutlineDelete } from 'react-icons/ai'
import { BsDatabaseDown, BsCalendar4, BsTag } from 'react-icons/bs'
import { GrResources } from 'react-icons/gr'
import { MdStorage, MdOutlineContentCopy } from 'react-icons/md'
import { LuFilter } from 'react-icons/lu'
import Accordion from '../../infrastructure/common/accordion/Accordion'
import { logGroupContext } from '../../infrastructure/contextProviders/logGroupProvider'
const LogEventsDetail = React.lazy(() => import('../logEventsDetail/LogEventsDetail'))
// A custom hook that builds on useLocation to parse
// the query string for you.

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}
const LogGroupDetail = () => {
  const [logStreams, setLogStreams] = React.useState([])
  const { logGroup } = React.useContext(logGroupContext)

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
      <Accordion
        title="Details"
        bodyClasses="bg-white p-4"
        defaultOpen={true}
        rightAdornment={
          <div className="flex items-center">
            <button className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-1 m-1 px-3 border border-red-500 hover:border-transparent rounded-2xl flex items-center justify-between">
              <AiOutlineDelete />
              &nbsp;Delete Log Group
            </button>
            <button className="bg-slate-500 hover:bg-slate-600 text-white font-semibold hover:text-white py-1 m-1 px-3 border border-slate-500 hover:border-transparent rounded-2xl flex items-center justify-between">
              <BsDatabaseDown />
              &nbsp;Export To S3
            </button>
          </div>
        }
      >
        <div className="flex flex-col justify-between items-between">
          <div className="py-1 m-1 whitespace-nowrap overflow-hidden text-ellipsis font-bold flex justify-start items-center relative">
            <GrResources className={'opacity-80'} />
            &nbsp;ARN : {logGroup?.arn ?? ''}
            <button
              className="bg-transparent border-none absolute right-0 p-1 m-2 hover:bg-secondary-200 active:bg-secondary-300 rounded-md"
              onClick={() => {
                navigator.clipboard.writeText(logGroup?.arn)
              }}
            >
              <MdOutlineContentCopy className={'w-4 h-4'} />
            </button>
          </div>
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col justify-center items-between">
              <div className="flex justify-start items-center m-1">
                <BsCalendar4 className={'opacity-80'} />
                &nbsp;Created ON : {logGroup?.creationTime ? new Date(logGroup?.creationTime).toDateString() : '-'}
              </div>
              <div className="flex justify-start items-center m-1">
                <LuFilter className={'opacity-80'} />
                &nbsp;Metric Filters : {logGroup?.metricFilterCount || 0}
              </div>
            </div>
            <div className="flex flex-col justify-center items-between">
              <div className="flex justify-start items-center m-1">
                <BsCalendar4 className={'opacity-80'} />
                &nbsp;Expired : -
              </div>
              <div className="flex justify-start items-center m-1">
                <LuFilter className={'opacity-80'} />
                &nbsp;Subscription Filters : {logGroup?.subscriptionFilterCount || 0}
              </div>
            </div>
            <div className="flex flex-col justify-center items-between">
              <div className="flex justify-start items-center m-1">
                <MdStorage className={'opacity-80'} />
                &nbsp;Storage : {logGroup?.storedBytes ? formatBytes(logGroup?.storedBytes, 2) : 0}
              </div>
            </div>
          </div>
          <div className="flex justify-start items-center p-1 m-1">
            <BsTag className={'opacity-80'} />
            &nbsp;Tags : -
          </div>
        </div>
      </Accordion>

      <Accordion
        title={`Streams(${logStreams?.logStreams?.length ?? 0})`}
        permanent={true}
        defaultOpen={true}
        className="rounded"
        bodyClasses="p-0 flex justify-center items-center"
        leftAdornment={
          <input
            type="text"
            placeholder="Search..."
            className="w-full font-mono focus:outline-none bg-white shadow-sm shadow-black/10 hover:bg-white/70 font-semibold py-1 m-1 mx-2 px-3  hover:border-transparent rounded-2xl"
          />
        }
      >
        <>
          {logStreams?.logStreams?.length ? (
            logStreams?.logStreams?.map((logStream, index) => {
              return (
                <Accordion
                  key={logStream?.arn + '_' + index}
                  title={<h6 className="font-mono text-base">{logStream?.logStreamName}</h6>}
                  className={`m-1 p-1`}
                  headerClasses="bg-black/10 rounded-b-none text-base"
                  bodyClasses="bg-black/5 rounded-t-none"
                >
                  <Suspense fallback={<div>loading...</div>}>
                    <LogEventsDetail
                      logStreamName={logStream?.logStreamName}
                      logGroupName={query.get('logGroupName') as string}
                    />
                  </Suspense>
                </Accordion>
              )
            })
          ) : (
            <div className="w-full flex justify-center items-center">
              <h4>No Stream Available!</h4>
            </div>
          )}
        </>
      </Accordion>
      {/* <div className="flex m-1 shadow-lg bg-black/5 p-2 rounded-lg w-full">
        <h3 className="text-xl font-bold whitespace-nowrap">Log Group :&nbsp;</h3>
        <h3 className="text-xl font-bold">
          <Link to={`/log-group?logGroupName=${query.get('logGroupName')}`}>{query.get('logGroupName')}</Link>
        </h3>
      </div>
      <div className="shadow-lg bg-black/5 px-1 rounded-lg flex-1 w-full flex flex-col justify-center items-center ">
      
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
      </div> */}
    </div>
  )
}

export default LogGroupDetail
