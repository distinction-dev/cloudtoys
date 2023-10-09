import React from 'react'
import { useNavigate } from 'react-router-dom'
import Settings from '../settings/Settings'
import { logGroupContext } from '../../infrastructure/contextProviders/logGroupProvider'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs]: unknown = React.useState({})
  const { logGroup, setLogGroup } = React.useContext(logGroupContext)
  const [openSettings, setOpenSettings] = React.useState(false)
  const navigate = useNavigate()
  const handleClick = React.useCallback(
    (logGroup: unknown) => {
      setLogGroup(logGroup)
      navigate(`/log-group?logGroupName=${logGroup?.logGroupName}`)
    },
    [navigate, setLogGroup],
  )
  const fetchLogs = (logGroupNamePattern?: string) => {
    window.electronApi
      .invoke('DescribeLogGroupsCommand', {
        showSubscriptionDestinations: true,
        ...(logGroupNamePattern && { logGroupNamePattern: logGroupNamePattern }),
      })
      .then((res) => {
        console.log('logGroupNamePattern res==========>', logGroupNamePattern, res)

        res?.logGroups?.length && handleClick(res?.logGroups[0])
        setLogs({ ...res, rawValue: res?.logGroups })
      })
  }
  const handleOnchange = (event) => {
    const searchInput = event?.target?.value
    if (searchInput?.length > 8) {
      fetchLogs(searchInput)
      // const rawValue = [...logs.rawValue]
      // setLogs((prevState: any) => {
      //   return {
      //     ...prevState,
      //     logGroups: rawValue?.filter((item) => item?.logGroupName.toLowerCase().includes(searchInput.toLowerCase())),
      //   }
      // })
    } else {
      fetchLogs()
      // setLogs((prevState: any) => {
      //   return {
      //     ...prevState,
      //     logGroups: prevState?.rawValue,
      //   }
      // })
    }
  }
  React.useEffect(() => {
    fetchLogs()
  }, [])
  // fixed left-0 top-0
  return (
    <>
      <div className="flex flex-col">
        <header className="bg-primary-500 shrink-0 h-10 flex justify-end items-center font-mono ">
          <div className="p-2">ap-south-1</div>
          <div className="p-2 border-l border-white/75">D-dev</div>
        </header>
        <div className="flex flex-row w-full  h-[calc(100vh-2.5rem)]">
          <nav className="w-64 bg-white expanded flex flex-col justify-start items-start">
            <div className="w-64 bg-white flex flex-col justify-start items-start overflow-hidden flex-grow">
              <div className="flex p-1 pl-2 justify-start items-center text-lg font-bold font-mono">
                <span className="text-black/80">Log Groups</span>
                <span className="text-secondary-400">&nbsp;({logs?.logGroups?.length || 0})&nbsp;</span>
              </div>
              <div className="flex p-1 justify-start items-center text-lg w-full font-mono">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={handleOnchange}
                  className="w-full p-1 px-2 bg-secondary-100 rounded-full text-black/90 font-mono focus:outline-none"
                />
              </div>
              {/* List Area with Scroll */}
              <div className="overflow-y-auto flex-grow w-full p-1">
                <ul className="font-mono">
                  {logs?.logGroups?.length ? (
                    logs?.logGroups?.map((item: LogGroup, index: number) => {
                      return (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <li
                          role="button"
                          className={`p-1 m-1 hover:bg-black/5 hover:text-primary-400 active:text-primary-500 rounded-md whitespace-nowrap overflow-hidden text-ellipsis
                           ${item?.arn === logGroup?.arn ? 'bg-black/5 text-primary-700' : 'text-secondary-700'} `}
                          key={`loggroup_${item?.creationTime}_${index}`}
                          onClick={() => handleClick(item)}
                        >
                          {item?.logGroupName}
                        </li>
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

          <main className="w-full overflow-y-auto text-gray-700 bg-secondary-100 font-mono p-5">{children}</main>
        </div>
        {openSettings && <Settings handleClose={() => setOpenSettings(false)} />}
      </div>
    </>
  )
}

export default Layout
