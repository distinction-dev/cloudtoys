import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCalendar4, BsTag } from 'react-icons/bs';
import { TfiReload } from 'react-icons/tfi';
import { GrResources } from 'react-icons/gr';
import { MdStorage, MdOutlineContentCopy } from 'react-icons/md';
import { LuFilter } from 'react-icons/lu';
import Accordion from '../../infrastructure/common/accordion/Accordion';
import { ImSpinner2 } from 'react-icons/im';
import Modal from '../../infrastructure/common/modal/Modal';
import { LogGroupContext } from '../layout/Layout';
import type { LogStream } from '../../utils/interfaces/LogStream';
import _ from 'lodash';
type LogsStreamState = {
  logStreams?: LogStream[];
  rawValue?: LogStream[];
};
const LogEventsDetail = React.lazy(
  () => import('../logEventsDetail/LogEventsDetail')
);
// A custom hook that builds on useLocation to parse
// the query string for you.

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}
const LogGroupDetail = () => {
  const [logStreams, setLogStreams] = React.useState<LogsStreamState>({});
  const [logStreamLoading, setLogStreamLoading] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const { logGroup, refreshFun, region, profile } =
    React.useContext(LogGroupContext);
  // const navigate = useNavigate()
  // const handleExportClick = React.useCallback(
  //   (e: React.MouseEvent<HTMLButtonElement>) => {
  //     e.stopPropagation()
  //     navigate(`/export-streams`)
  //   },
  //   [navigate],
  // )
  const query = useQuery();
  const fetchLogStreams = React.useCallback(
    (logGroupName: string, logStreamNamePrefix?: string) => {
      setLogStreamLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).electronApi
          .invoke('DescribeLogStreamsCommand', {
            logGroupName: logGroupName,
            // {
            descending: true,
            limit: 50,

            filterExpiredLogStreams: true,
            ...(logStreamNamePrefix
              ? { logStreamNamePrefix: logStreamNamePrefix }
              : { orderBy: 'LastEventTime' }),
            // logGroupName: '/aws/lambda/ProvisionConcurrenyDemo',
            // }
          })
          .then((res: LogsStreamState) => {
            res && setLogStreams(res);
            setLogStreamLoading(false);
          });
      } catch {
        setLogStreamLoading(false);
      }
    },
    []
  );

  const deleteLogGroup = React.useCallback(
    (logGroupName: string) => {
      setDeleteLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).electronApi
          .invoke('DeleteLogGroupCommand', {
            logGroupName: logGroupName,
          })
          .then(() => {
            refreshFun(region, profile);
            setConfirmDelete(false);
            setDeleteLoading(false);
          });
      } catch {
        setDeleteLoading(false);
      }
    },
    [profile, refreshFun, region]
  );

  const handleOnchange = (event: { target: { value: string } }) => {
    const searchInput = event?.target?.value;
    _.debounce(fetchLogStreams, 600)(
      query.get('logGroupName') as string,
      searchInput ?? ''
    );
  };
  React.useEffect(() => {
    fetchLogStreams(query.get('logGroupName') as string);
  }, [fetchLogStreams, query]);
  return (
    <>
      <div className="flex flex-col justify-start items-start h-full">
        <Accordion
          title="Details"
          bodyClasses="bg-white p-4"
          defaultOpen={true}
          rightAdornment={
            <div className="flex items-center flex-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                className="hover:text-white transition-transform transform hover:scale-105 ease-out duration-400 focus:outline-none bg-transparent hover:bg-red-500 text-red-700 font-semibold  py-1 m-1 px-3 border border-red-500 hover:border-transparent rounded-2xl flex items-center justify-between  whitespace-nowrap overflow-hidden text-ellipsis "
              >
                <AiOutlineDelete />
                &nbsp;Delete Log Group
              </button>
              {/* <button
                onClick={handleExportClick}
                className="transition-transform transform hover:scale-105 ease-out duration-500 focus:outline-none bg-slate-500 hover:bg-slate-600 text-white font-semibold hover:text-white py-1 m-1 px-3 border border-slate-500 hover:border-transparent rounded-2xl flex items-center justify-between  whitespace-nowrap overflow-hidden text-ellipsis "
              >
                <BsDatabaseDown />
                &nbsp;Export To S3
              </button> */}
            </div>
          }
        >
          <div className="flex flex-col justify-between items-between overflow-hidden text-ellipsis ">
            <div className="py-1 m-1 whitespace-nowrap overflow-hidden text-ellipsis font-bold flex justify-start items-center relative">
              <GrResources className={'opacity-80'} />
              &nbsp;ARN : {logGroup?.arn ?? ''}
              <button
                className="focus:outline-none bg-white border-none absolute right-0 p-1 m-0 hover:bg-secondary-200 active:bg-secondary-300 rounded-md"
                onClick={() => {
                  navigator.clipboard.writeText(logGroup?.arn as string);
                }}
              >
                <MdOutlineContentCopy className={'w-4 h-4'} />
              </button>
            </div>
            <div className="flex justify-between items-start w-full flex-wrap">
              <div className="flex flex-col justify-center items-between">
                <div className="flex justify-start items-center m-1 whitespace-nowrap">
                  <BsCalendar4 className={'opacity-80'} />
                  &nbsp;Created ON :{' '}
                  {logGroup?.creationTime
                    ? new Date(logGroup?.creationTime).toDateString()
                    : '-'}
                </div>
                <div className="flex justify-start items-center m-1  whitespace-nowrap">
                  <LuFilter className={'opacity-80'} />
                  &nbsp;Metric Filters : {logGroup?.metricFilterCount || 0}
                </div>
              </div>
              <div className="flex flex-col justify-center items-between">
                <div className="flex justify-start items-center m-1  whitespace-nowrap">
                  <BsCalendar4 className={'opacity-80'} />
                  &nbsp;Expired : -
                </div>
                <div className="flex justify-start items-center m-1  whitespace-nowrap">
                  <LuFilter className={'opacity-80'} />
                  &nbsp;Subscription Filters :{' '}
                  {logGroup?.subscriptionFilterCount || 0}
                </div>
              </div>
              <div className="flex flex-col justify-center items-between">
                <div className="flex justify-start items-center m-1  whitespace-nowrap">
                  <MdStorage className={'opacity-80'} />
                  &nbsp;Storage :{' '}
                  {logGroup?.storedBytes
                    ? formatBytes(logGroup?.storedBytes, 2)
                    : 0}
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center p-1 m-1  whitespace-nowrap">
              <BsTag className={'opacity-80'} />
              &nbsp;Tags : -
            </div>
          </div>
        </Accordion>

        <Accordion
          title={
            <div
              className="flex justify-start items-center "
              style={{ minWidth: '8rem' }}
            >
              Streams
              {logStreamLoading ? (
                <>
                  &nbsp;{' '}
                  <span className="text-secondary-500 ">
                    <ImSpinner2 className={'animate-spin w-5 h-5'} />
                  </span>
                  &nbsp;
                </>
              ) : (
                <span className="text-secondary-400">
                  &nbsp;({logStreams?.logStreams?.length || 0})&nbsp;
                </span>
              )}
            </div>
          }
          permanent={true}
          defaultOpen={true}
          className="rounded h-full overflow-hidden"
          bodyClasses="overflow-y-auto overflow-x-hidden pr-2"
          rightAdornment={
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Search..."
                onChange={handleOnchange}
                className="w-full font-mono focus:outline-none bg-white shadow-sm shadow-black/10 hover:bg-white/70 font-semibold py-1 m-1 mx-2 px-3  hover:border-transparent rounded-2xl"
              />
              <button
                className="appearance-none bg-transparent border-none focus:outline-none p-2 rounded-xl hover:bg-slate-500 
                hover:text-white font-bold active:text-white/80 transition-transform transform hover:scale-105 ease-out duration-500"
                onClick={() => {
                  fetchLogStreams(query.get('logGroupName') as string);
                }}
              >
                <TfiReload className={`w-4 h-4 `} />
              </button>
            </div>
          }
        >
          <>
            {logStreamLoading ? (
              Array(7)
                .fill('logSream')
                .map((item, index: number) => {
                  return (
                    <div
                      key={item + index}
                      className=" animate-pulse bg-gray-200 h-8 rounded-md m-1 "
                    ></div>
                  );
                })
            ) : (
              <>
                {logStreams?.logStreams?.length ? (
                  logStreams?.logStreams?.map((logStream, index: number) => {
                    return (
                      <Accordion
                        key={logStream?.arn + '_' + index}
                        title={
                          <h6 className="font-mono text-base">
                            {logStream?.logStreamName}
                          </h6>
                        }
                        className={`m-1 p-1 rounded`}
                        headerClasses="bg-black/10 rounded-b-none text-base "
                        bodyClasses="bg-black/5 rounded-t-none"
                      >
                        <Suspense>
                          <LogEventsDetail
                            logStreamName={logStream?.logStreamName as string}
                            logGroupName={query.get('logGroupName') as string}
                          />
                        </Suspense>
                      </Accordion>
                    );
                  })
                ) : (
                  <div className="w-full flex justify-center items-center">
                    <h4>No Stream Available!</h4>
                  </div>
                )}
              </>
            )}
          </>
        </Accordion>
      </div>
      {confirmDelete && (
        <Modal
          closeModel={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteLogGroup(logGroup?.logGroupName as string);
          }}
          isLoading={deleteLoading}
          title={`Are you sure you want to delete the log-stream ?`}
          subTitle={`Log-Group : ${logGroup.logGroupName}`}
        />
      )}
    </>
  );
};

export default LogGroupDetail;
