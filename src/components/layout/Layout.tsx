import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoRefreshCircle } from 'react-icons/io5'
import { ImSpinner2 } from 'react-icons/im'
import { debounce } from '../../infrastructure/utils/debounce'
import LogGroupSkeleton from '../../infrastructure/common/skeletons/LogGroupSkeleton'
import Tooltip from '../../infrastructure/common/tooltip/Tooltip'

export const LogGroupContext = React.createContext(null)

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
]

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs] = React.useState({})
  const [logGroup, setLogGroup] = React.useState(null)
  const [clients, setClients] = React.useState([])
  const [region, setRegion] = React.useState(REGIONS_ENUMS[0])
  const [profile, setProfile] = React.useState('')
  const [show, setShow] = React.useState(false)

  const [loading, setLoading] = React.useState(false)
  const [logGroupLoading, setLogGroupLoading] = React.useState(false)

  const navigate = useNavigate()
  const handleClick = React.useCallback(
    (logGroup?: unknown) => {
      if (logGroup) {
        setLogGroup(logGroup)
        navigate(`/log-group?logGroupName=${logGroup?.logGroupName}`)
      } else {
        navigate(`/home`)
      }
    },
    [navigate, setLogGroup],
  )

  const fetchClients = () => {
    window.electronApi.invoke('getConfigs').then((res) => {
      if (res?.credentialsFile && Object.keys(res?.credentialsFile)?.length) {
        setClients(Object.keys(res?.credentialsFile))
      }
    })
  }

  const fetchLogs = React.useCallback(
    (logGroupNamePattern?: string) => {
      console.log('resresresres ccccc')
      setShow(false)
      setLogGroupLoading(true)
      try {
        window.electronApi
          .invoke('DescribeLogGroupsCommand', {
            showSubscriptionDestinations: true,
            ...(logGroupNamePattern && { logGroupNamePattern: logGroupNamePattern }),
          })
          .then((res) => {
            console.log('resresresres', res)
            if (res?.logGroups?.length) {
              handleClick(res?.logGroups[0])
              setLogs({ ...res, rawValue: res?.logGroups })
              setTimeout(() => {
                setShow(true)
              }, 0)
            } else {
              setLogs()
              handleClick()
            }
            setLoading(false)
            setLogGroupLoading(false)
          })
          .catch((err) => {
            navigate(`/home?message=Something went wrong with this profile!`)
            setLogs()
            setLoading(false)
            setLogGroupLoading(false)
          })
      } catch (err) {
        setLoading(false)
        setLogGroupLoading(false)
      }
    },
    [handleClick, navigate],
  )
  const fetchLogsDebounce = React.useCallback(
    (logGroupNamePattern?: string) => {
      console.log('resresresres ccccc')
      setShow(false)
      setLogGroupLoading(true)
      try {
        window.electronApi
          .invoke('DescribeLogGroupsCommand', {
            showSubscriptionDestinations: true,
            ...(logGroupNamePattern && { logGroupNamePattern: logGroupNamePattern }),
          })
          .then((res) => {
            console.log('resresresres', res)
            if (res?.logGroups?.length) {
              handleClick(res?.logGroups[0])
              setLogs({ ...res, rawValue: res?.logGroups })
              setTimeout(() => {
                setShow(true)
              }, 0)
            } else {
              setLogs()
              handleClick()
            }
            setLoading(false)
            setLogGroupLoading(false)
          })
          .catch((err) => {
            navigate(`/home?message=Something went wrong with this profile!`)
            setLogs()
            setLoading(false)
            setLogGroupLoading(false)
          })
      } catch (err) {
        setLoading(false)
        setLogGroupLoading(false)
      }
    },
    [handleClick, navigate],
  )
  const initClients = React.useCallback(
    (region?: string, profile?: string) => {
      window.electronApi.invoke('initClient', { region: region, ...(profile && { profile: profile }) }).then((res) => {
        fetchLogs()
      })
    },
    [fetchLogs],
  )

  const handleOnchange = (event) => {
    const searchInput = event?.target?.value
    if (searchInput) {
      debounce(fetchLogsDebounce, 300)(searchInput)
    } else {
      fetchLogs()
    }
  }

  const handleRegionChange = (e) => {
    setRegion(e.target.value)
    initClients(e.target.value, profile)
  }
  const handleProfileChange = (e) => {
    setProfile(e.target.value)
    initClients(region, e.target.value)
  }

  const defaultInit = (region: string, profile?: string) => {
    fetchClients()
    initClients(region, profile || '')
  }
  React.useEffect(() => {
    defaultInit(region)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logGroupContextValue = React.useMemo(() => {
    return {
      refreshFun: initClients,
      logGroup,
      setLogGroup,
      profile,
      region,
    }
  }, [initClients, logGroup, profile, region])
  return (
    <LogGroupContext.Provider value={logGroupContextValue}>
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
                  <option className="text-black p-1 rounded hover:text-black" key={item} value={item}>
                    {item}
                  </option>
                )
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
                      <option className="text-black rounded hover:text-black" key={item} value={item}>
                        {item}
                      </option>
                    )
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
              setLoading(true)
              defaultInit(region, profile)
            }}
          >
            <IoRefreshCircle
              className={`w-7 h-7 hover:text-white active:text-white/90 ${loading ? 'animate-spin' : ''}`}
            />
          </button>
        </header>
        <div className="flex flex-row w-full  h-[calc(100vh-2.5rem)]">
          <nav className="w-64 bg-white expanded flex flex-col justify-start items-start">
            <div className="w-64 bg-white flex flex-col justify-start items-start overflow-hidden flex-grow">
              <div className="flex p-1 pl-2 justify-start items-center text-lg font-bold font-mono">
                <span className="text-black/80">Log Groups</span>
                {logGroupLoading ? (
                  <>
                    &nbsp;{' '}
                    <span className="text-secondary-500 ">
                      <ImSpinner2 className={'animate-spin w-5 h-5'} />
                    </span>
                    &nbsp;
                  </>
                ) : (
                  <span className="text-secondary-400">&nbsp;({logs?.logGroups?.length || 0})&nbsp;</span>
                )}
              </div>
              <div className="flex p-1 justify-start items-center text-lg w-full font-mono">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleOnchange}
                  className="transition-transform transform hover:scale-y-110 ease-out duration-500 w-full p-1 px-2 bg-secondary-100 rounded-full text-black/90 font-mono focus:outline-none"
                />
              </div>
              <div className="overflow-y-auto flex-grow w-full p-1 shadow-inner ">
                <ul className="font-mono">
                  {logGroupLoading &&
                    Array(12)
                      .fill('logGroup')
                      .map((item, index: number) => {
                        return <div key={item + index} className=" animate-pulse bg-gray-200 h-8 rounded-md m-1 "></div>
                      })}
                  {!logGroupLoading && logs?.logGroups?.length ? (
                    logs?.logGroups?.map((item: LogGroup, index: number) => {
                      return (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <Tooltip key={`loggroup_${item?.creationTime}_${index}`} message={item?.logGroupName}>
                          <li
                            role="button"
                            className={`p-1 m-1 w-full hover:bg-black/5 hover:text-primary-400 active:text-primary-500 rounded-md whitespace-nowrap overflow-hidden text-ellipsis
                           ${item?.arn === logGroup?.arn ? 'bg-black/5 text-primary-700' : 'text-secondary-700'} 
                             hover:scale-105 ease-out
                           `}
                            style={{
                              transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                              transform: show ? 'translateX(0)' : `translateX(-${25 * (index + 1)}%)`,
                              opacity: show ? 1 : 0,
                              animation: show ? 'enterFromLeft 0.3s ease-in-out' : '',
                              animationDelay: `0.${index + 3}s`,
                            }}
                            key={`loggroup_${item?.creationTime}_${index}`}
                            onClick={() => handleClick(item)}
                          >
                            {item?.logGroupName}
                          </li>
                        </Tooltip>
                      )
                    })
                  ) : (
                    <li className="w-full text-center">No Data Available!</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="bg-secondary-200 p-1 font-mono flex justify-between items-center text-sm text-black/60 font-semibold w-full">
              <span>CloudToys</span>&nbsp;
              <span>version 0.0.1</span>
            </div>
          </nav>

          <main className="w-full overflow-y-auto text-gray-700 bg-secondary-100 font-mono p-5">
            {logGroupLoading ? <LogGroupSkeleton /> : children}
          </main>
        </div>
      </div>
    </LogGroupContext.Provider>
  )
}

export default Layout
