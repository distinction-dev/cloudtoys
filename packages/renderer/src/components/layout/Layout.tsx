import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoRefreshCircle } from 'react-icons/io5';
import { ImSpinner2 } from 'react-icons/im';
import LogGroupSkeleton from '../../infrastructure/common/skeletons/LogGroupSkeleton';
import Tooltip from '../../infrastructure/common/tooltip/Tooltip';
import type { LogGroup } from '../../utils/interfaces/LogGroup';
import _ from 'lodash';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

type LogGroupContextType = {
  refreshFun: (region?: string, profile?: string) => void; // Example type for refreshFun
  logGroup: LogGroup;
  setLogGroup: (logGroup: string) => void;
  profile: string;
  region: string;
};

type LogsState = {
  logGroups?: LogGroup[];
  rawValue?: LogGroup[];
  nextToken?: string;
  logGroupNamePattern?: string;
};
export const LogGroupContext = React.createContext<LogGroupContextType>({
  refreshFun: () => null,
  logGroup: {},
  setLogGroup: (logGroup: string) => logGroup,
  profile: '',
  region: '',
});

const REGIONS_ENUMS = [
  'eu-north-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'sa-east-1',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'me-south-1',
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const panelRef = React.useRef(null);
  const [logs, setLogs] = React.useState<LogsState>({});
  const [logGroup, setLogGroup] = React.useState<LogGroup>({});
  const [clients, setClients] = React.useState([]);
  const [region, setRegion] = React.useState(REGIONS_ENUMS[0]);
  const [profile, setProfile] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(false);
  const [logGroupLoading, setLogGroupLoading] = React.useState(false);
  const [buckets, setBuckets] = React.useState('');

  const navigate = useNavigate();
  const handleClick = React.useCallback(
    (logGroup?: LogGroup) => {
      if (logGroup) {
        setLogGroup(logGroup);
        navigate(`/log-group?logGroupName=${logGroup?.logGroupName}`);
      } else {
        navigate('/home');
      }
    },
    [navigate, setLogGroup]
  );

  const fetchClients = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).electronApi
      .invoke('getConfigs')
      .then((res: { credentialsFile: object }) => {
        if (res?.credentialsFile && Object.keys(res?.credentialsFile)?.length) {
          console.log("buckets ====>", res?.credentialsFile);

          setClients(Object.keys(res?.credentialsFile) as never[]);
        }
      });
  };

  const getBucketList = () => {
    (window as any).electronApi.invoke('ListBucketsCommand').then((res: any) => {
      setBuckets(JSON.stringify(res))
      console.log("buckets ====>", res);
    }
    )
  }

  const fetchLogs = React.useCallback(
    (logGroupNamePattern?: string, nextToken?: string) => {
      !nextToken && setShow(false);
      nextToken ? setLoadMore(true) : setLogGroupLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).electronApi
          .invoke('DescribeLogGroupsCommand', {
            showSubscriptionDestinations: true,
            ...(logGroupNamePattern && {
              logGroupNamePattern: logGroupNamePattern,
            }),
            ...(nextToken && { nextToken: nextToken }),
            limit: 50,
          })
          .then((res: { logGroups: LogGroup[] }) => {
            if (nextToken) {
              setLogs({
                ...res,
                ...(logGroupNamePattern && {
                  logGroupNamePattern: logGroupNamePattern,
                }),
                logGroups: [
                  ...(logs.logGroups?.length ? logs.logGroups : []),
                  ...(res.logGroups?.length ? res.logGroups : []),
                ],
                rawValue: [
                  ...(logs.rawValue?.length ? logs.rawValue : []),
                  ...(res.logGroups?.length ? res.logGroups : []),
                ],
              });
              setLoadMore(false);
            } else {
              if (res?.logGroups?.length) {
                handleClick(res?.logGroups[0]);
                setLogs({
                  ...res,
                  rawValue: res?.logGroups,
                  ...(logGroupNamePattern && {
                    logGroupNamePattern: logGroupNamePattern,
                  }),
                });
              } else {
                setLogs({});
                handleClick();
              }
              setTimeout(() => {
                setShow(true);
              }, 0);
            }

            setLoading(false);
            setLogGroupLoading(false);
          })
          .catch(() => {
            navigate('/home?message=Something went wrong with this profile!');
            setLogs({});
            setLoading(false);
            setLogGroupLoading(false);
          });
      } catch (err) {
        setLoading(false);
        setLogGroupLoading(false);
      }
    },
    [handleClick, logs, navigate]
  );
  const initClients = React.useCallback(
    (region?: string, profile?: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).electronApi
        .invoke('initClients', {
          region: region,
          ...(profile && { profile: profile }),
        })
        .then(() => {
          getBucketList()
          fetchLogs();
        });
    },
    [fetchLogs]
  );

  const handleOnchange = (e: { target: { value: string } }) => {
    const searchInput = e?.target?.value;
    _.debounce(fetchLogs, 600)(searchInput ?? '');
  };

  const handleRegionChange = (e: { target: { value: string } }) => {
    setRegion(e?.target?.value);
    initClients(e?.target?.value, profile);
  };
  const handleProfileChange = (e: { target: { value: string } }) => {
    setProfile(e.target.value);
    initClients(region, e.target.value);
  };

  const defaultInit = (region: string, profile?: string) => {
    fetchClients();
    initClients(region, profile || '');
  };
  React.useEffect(() => {
    defaultInit(region);
  }, []);

  const logGroupContextValue = React.useMemo(() => {
    return {
      refreshFun: initClients,
      logGroup,
      setLogGroup,
      profile,
      region,
    };
  }, [initClients, logGroup, profile, region]);

  return (
    <LogGroupContext.Provider
      value={logGroupContextValue as LogGroupContextType}
    >
      <div className="flex flex-col">
        <header className="bg-primary-500 shrink-0 h-10 flex justify-end items-center font-mono ">
          <div className="border-white/75 border-l border-solid p-2">
            <select
              name="region"
              id="region"
              className="block py-0 px-0 w-full bg-transparent rounded-lg text-white focus:border-none focus:outline-none"
              onChange={handleRegionChange}
            >
              {REGIONS_ENUMS.map((item: string) => {
                return (
                  <option
                    className="text-black p-1 rounded hover:text-black"
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="border-l-white/75 border-l border-solid p-2">
            {clients?.length ? (
              <>
                <select
                  name="client"
                  id="client"
                  className="block py-0 px-0 w-full bg-transparent rounded-lg text-white focus:border-none focus:outline-none"
                  onChange={handleProfileChange}
                >
                  {clients?.map((item: string) => {
                    return (
                      <option
                        className="text-black rounded hover:text-black"
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    );
                  })}
                </select>
              </>
            ) : (
              <div>Default</div>
            )}
          </div>
          <button
            className="appearance-none bg-transparent rounded-none border-l-white/75 border-l border-solid p-2  "
            onClick={() => {
              setLoading(true);
              defaultInit(region, profile);
            }}
          >
            <IoRefreshCircle
              className={`w-7 h-7 hover:text-white active:text-white/90 ${
                loading ? 'animate-spin' : ''
              }`}
            />
          </button>
        </header>
        <PanelGroup direction="horizontal">
          <div className="flex flex-row w-full h-[calc(100vh-2.5rem)]">
            <Panel
              ref={panelRef}
              defaultSize={window?.electron?.store?.get('panelsize') || 20}
              onResize={() => {
                if (panelRef.current) {
                  const size = Math.floor(panelRef.current.getSize());
                  window.electron.store.set('panelsize', size);
                }
              }}
              className=" bg-white flex flex-col justify-start items-start "
            >
              <div className="w-full bg-white flex flex-col justify-start items-start overflow-hidden flex-grow">
                <div className="flex p-1 pl-2 justify-start items-center text-lg font-bold font-mono">
                  <span className="text-black/80">Log Groups</span>
                  {loadMore || logGroupLoading ? (
                    <>
                      &nbsp;{' '}
                      <span className="text-secondary-500 ">
                        <ImSpinner2 className={'animate-spin w-5 h-5'} />
                      </span>
                      &nbsp;
                    </>
                  ) : (
                    <span className="text-secondary-400">
                      &nbsp;({logs?.logGroups?.length || 0})&nbsp;
                    </span>
                  )}
                </div>
                <div className="flex p-1 justify-start items-center text-lg w-full font-mono">
                  <input
                    type="text"
                    placeholder="Search..."
                    id="logGroupSearch"
                    onChange={handleOnchange}
                    className="transition-transform transform hover:scale-y-110 ease-out duration-500 w-full p-1 px-2 bg-secondary-100 rounded-full text-black/90 font-mono focus:outline-none"
                  />
                </div>
                <div className="overflow-y-auto overflow-x-hidden flex-grow w-full p-1 shadow-inner font-mono">
                  {/* <div className="font-mono"> */}
                  {!logGroupLoading && logs?.logGroups?.length ? (
                    <>
                      {logs?.logGroups?.map((item: LogGroup, index: number) => {
                        return (
                          <Tooltip
                            key={`loggroup_${item?.creationTime}_${index}`}
                            hideOnHover={
                              logs.logGroups &&
                              logs.logGroups.length - 1 === index
                                ? false
                                : true
                            }
                            message={item?.logGroupName as string}
                          >
                            <div
                              role="button"
                              tabIndex={-1}
                              onClick={() => handleClick(item)}
                              className={`p-1 m-1 w-full hover:bg-black/5 hover:text-primary-400 active:text-primary-500 rounded-md whitespace-nowrap overflow-hidden text-ellipsis
                           ${
                             item?.arn === logGroup?.arn
                               ? 'bg-black/5 text-primary-700'
                               : 'text-secondary-700'
                           } 
                             hover:scale-105 ease-out
                           `}
                              style={{
                                transition:
                                  'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                                transform: show
                                  ? 'translateX(0)'
                                  : `translateX(-${25 * (index + 1)}%)`,
                                opacity: show ? 1 : 0,
                                animation: show
                                  ? 'enterFromLeft 0.3s ease-in-out'
                                  : '',
                                animationDelay: `0.${index + 3}s`,
                              }}
                              key={`loggroup_${item?.creationTime}_${index}`}
                            >
                              <span
                                className={`
                             hover:scale-105 ease-in
                           `}
                              >
                                {item?.logGroupName}
                              </span>
                            </div>
                          </Tooltip>
                        );
                      })}
                      {!loadMore && !logGroupLoading && logs?.nextToken && (
                        <div
                          role="button"
                          tabIndex={-1}
                          onClick={() =>
                            fetchLogs(
                              logs?.logGroupNamePattern ?? '',
                              logs?.nextToken
                            )
                          }
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
                    <div className="w-full text-center">No Data Available!</div>
                  )}
                  {(loadMore || logGroupLoading) &&
                    Array(12)
                      .fill('logGroup')
                      .map((item, index: number) => {
                        return (
                          <div
                            key={item + index}
                            className=" animate-pulse bg-gray-200 h-8 rounded-md m-1 "
                          ></div>
                        );
                      })}
                  {/* </div> */}
                </div>
              </div>
              <div
                style={{ zIndex: 1 }}
                className="bg-secondary-200 p-1 font-mono flex justify-between items-center text-sm text-black/60 font-semibold w-full"
              >
                <span>CloudToys</span>&nbsp;
                <span>version 0.0.1</span>
              </div>
            </Panel>
            <PanelResizeHandle />
            <Panel className=" overflow-y-auto text-gray-700 bg-secondary-100 font-mono p-5">
              {logGroupLoading ? <LogGroupSkeleton /> : children}
            </Panel>
          </div>
        </PanelGroup>
      </div>
    </LogGroupContext.Provider>
  );
};

export default Layout;
