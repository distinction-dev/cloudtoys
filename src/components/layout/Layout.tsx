import React from 'react'
import { useNavigate } from 'react-router-dom'
import Settings from '../settings/Settings'
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs] = React.useState({})
  const [selectedLogGroup, setSelectedLogGroup] = React.useState({})
  const [openSettings, setOpenSettings] = React.useState(false)
  const navigate = useNavigate()
  const handleClick = React.useCallback(
    (logGroup: any) => {
      setSelectedLogGroup(logGroup)
      navigate(`/log-group?logGroupName=${logGroup?.logGroupName}`)
    },
    [navigate],
  )
  const fetchLogs = (logGroupNamePattern?: string) => {
    window.electronApi
      .invoke('DescribeLogGroupsCommand', {
        showSubscriptionDestinations: true,
        ...(logGroupNamePattern && { logGroupNamePattern: logGroupNamePattern }),
      })
      .then((res) => {
        logGroupNamePattern && console.log('logGroupNamePattern res==========>', res)

        res?.logGroups?.length && handleClick(res?.logGroups[0])
        setLogs({ ...res, rawValue: res?.logGroups })
      })
  }
  const handleOnchange = (event) => {
    const searchInput = event?.target?.value
    if (searchInput) {
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
      <div className="flex flex-row h-full relative">
        <nav className="w-64 bg-slate-900 expanded flex flex-col justify-start items-start h-full">
          {/* <ul className="flex flex-col items-center mt-8 h-full b-2 border-slate-100"> */}
          {/* <div className="w-64 sidebarScroll h-full bg-white/5  overflow-hidden"> */}
          <div className="bg-link-hover w-64 flex items-center h-16  p-5 text-gray-400 text-lg font-bold font-mono relative active">
            <svg
              className="mr-4"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.1 2.29999C2.65818 2.29999 2.3 2.65816 2.3 3.09999V9.89999C2.3 10.3418 2.65818 10.7 3.1 10.7H9.9C10.3418 10.7 10.7 10.3418 10.7 9.89999V3.09999C10.7 2.65816 10.3418 2.29999 9.9 2.29999H3.1ZM3.1 13.3C2.65818 13.3 2.3 13.6582 2.3 14.1V20.9C2.3 21.3418 2.65818 21.7 3.1 21.7H9.9C10.3418 21.7 10.7 21.3418 10.7 20.9V14.1C10.7 13.6582 10.3418 13.3 9.9 13.3H3.1ZM13.3 3.09999C13.3 2.65816 13.6582 2.29999 14.1 2.29999H20.9C21.3418 2.29999 21.7 2.65816 21.7 3.09999V9.89999C21.7 10.3418 21.3418 10.7 20.9 10.7H14.1C13.6582 10.7 13.3 10.3418 13.3 9.89999V3.09999ZM14.1 13.3C13.6582 13.3 13.3 13.6582 13.3 14.1V20.9C13.3 21.3418 13.6582 21.7 14.1 21.7H20.9C21.3418 21.7 21.7 21.3418 21.7 20.9V14.1C21.7 13.6582 21.3418 13.3 20.9 13.3H14.1ZM14.75 14.75H20.25V20.25H14.75V14.75ZM20.25 3.74998H14.75V9.24998H20.25V3.74998ZM3.75 3.74998H9.25V9.24998H3.75V3.74998ZM9.25 14.75H3.75V20.25H9.25V14.75Z"
                fill="#BFC5D2"
              />
              <mask
                id="mask0_2:22098"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="2"
                y="2"
                width="20"
                height="20"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.1 2.29999C2.65818 2.29999 2.3 2.65816 2.3 3.09999V9.89999C2.3 10.3418 2.65818 10.7 3.1 10.7H9.9C10.3418 10.7 10.7 10.3418 10.7 9.89999V3.09999C10.7 2.65816 10.3418 2.29999 9.9 2.29999H3.1ZM3.1 13.3C2.65818 13.3 2.3 13.6582 2.3 14.1V20.9C2.3 21.3418 2.65818 21.7 3.1 21.7H9.9C10.3418 21.7 10.7 21.3418 10.7 20.9V14.1C10.7 13.6582 10.3418 13.3 9.9 13.3H3.1ZM13.3 3.09999C13.3 2.65816 13.6582 2.29999 14.1 2.29999H20.9C21.3418 2.29999 21.7 2.65816 21.7 3.09999V9.89999C21.7 10.3418 21.3418 10.7 20.9 10.7H14.1C13.6582 10.7 13.3 10.3418 13.3 9.89999V3.09999ZM14.1 13.3C13.6582 13.3 13.3 13.6582 13.3 14.1V20.9C13.3 21.3418 13.6582 21.7 14.1 21.7H20.9C21.3418 21.7 21.7 21.3418 21.7 20.9V14.1C21.7 13.6582 21.3418 13.3 20.9 13.3H14.1ZM14.75 14.75H20.25V20.25H14.75V14.75ZM20.25 3.74998H14.75V9.24998H20.25V3.74998ZM3.75 3.74998H9.25V9.24998H3.75V3.74998ZM9.25 14.75H3.75V20.25H9.25V14.75Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_2:22098)"></g>
            </svg>
            <span className="link-label">Log Groups</span>
          </div>
          <div className="p-4 w-64 bg-white/5">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleOnchange}
              className="w-full px-3 py-2 bg-white/10 rounded-full text-gray-400 font-mono focus:outline-none"
            />
          </div>

          {/* List Area with Scroll */}
          <div className="overflow-y-auto h-auto w-64 p-1">
            <ul className="font-mono ">
              {logs?.logGroups?.length ? (
                logs?.logGroups?.map((item, index) => {
                  return (
                    <li
                      className={`p-1 m-1 hover:bg-white/10 rounded-md whitespace-pre-wrap overflow-hidden
                      ${item?.arn === selectedLogGroup?.arn ? 'bg-white/20' : ''} `}
                      key={`loggroup_${item?.creationTime}_${index}`}
                      onClick={() => handleClick(item)}
                    >
                      <p className="border-l border-white/30 border-solid pl-1 "> {item?.logGroupName}</p>
                    </li>
                  )
                })
              ) : (
                <li className="w-full text-center">No Data Available!</li>
              )}
            </ul>
          </div>
        </nav>
        <div className="flex flex-col h-full w-full">
          <header className="bg-slate-900 shrink-0 h-16 flex justify-end items-center p-5 font-mono ">
            <div
              className="hover:opacity-70 active:opacity-80"
              onClick={() => {
                setOpenSettings(true)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 48 48">
                <linearGradient
                  id="L4rKfs~Qrm~k0Pk8MRsoza_s5NUIabJrb4C_gr1"
                  x1="32.012"
                  x2="15.881"
                  y1="32.012"
                  y2="15.881"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#fff"></stop>
                  <stop offset=".242" stopColor="#f2f2f2"></stop>
                  <stop offset="1" stopColor="#ccc"></stop>
                </linearGradient>
                <circle cx="24" cy="24" r="11.5" fill="url(#L4rKfs~Qrm~k0Pk8MRsoza_s5NUIabJrb4C_gr1)"></circle>
                <linearGradient
                  id="L4rKfs~Qrm~k0Pk8MRsozb_s5NUIabJrb4C_gr2"
                  x1="17.45"
                  x2="28.94"
                  y1="17.45"
                  y2="28.94"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#0d61a9"></stop>
                  <stop offset=".363" stopColor="#0e5fa4"></stop>
                  <stop offset=".78" stopColor="#135796"></stop>
                  <stop offset="1" stopColor="#16528c"></stop>
                </linearGradient>
                <circle cx="24" cy="24" r="7" fill="url(#L4rKfs~Qrm~k0Pk8MRsozb_s5NUIabJrb4C_gr2)"></circle>
                <linearGradient
                  id="L4rKfs~Qrm~k0Pk8MRsozc_s5NUIabJrb4C_gr3"
                  x1="5.326"
                  x2="38.082"
                  y1="5.344"
                  y2="38.099"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#889097"></stop>
                  <stop offset=".331" stopColor="#848c94"></stop>
                  <stop offset=".669" stopColor="#78828b"></stop>
                  <stop offset="1" stopColor="#64717c"></stop>
                </linearGradient>
                <path
                  fill="url(#L4rKfs~Qrm~k0Pk8MRsozc_s5NUIabJrb4C_gr3)"
                  d="M43.407,19.243c-2.389-0.029-4.702-1.274-5.983-3.493c-1.233-2.136-1.208-4.649-0.162-6.693 c-2.125-1.887-4.642-3.339-7.43-4.188C28.577,6.756,26.435,8,24,8s-4.577-1.244-5.831-3.131c-2.788,0.849-5.305,2.301-7.43,4.188 c1.046,2.044,1.071,4.557-0.162,6.693c-1.281,2.219-3.594,3.464-5.983,3.493C4.22,20.77,4,22.358,4,24 c0,1.284,0.133,2.535,0.364,3.752c2.469-0.051,4.891,1.208,6.213,3.498c1.368,2.37,1.187,5.204-0.22,7.345 c2.082,1.947,4.573,3.456,7.34,4.375C18.827,40.624,21.221,39,24,39s5.173,1.624,6.303,3.971c2.767-0.919,5.258-2.428,7.34-4.375 c-1.407-2.141-1.588-4.975-0.22-7.345c1.322-2.29,3.743-3.549,6.213-3.498C43.867,26.535,44,25.284,44,24 C44,22.358,43.78,20.77,43.407,19.243z M24,34.5c-5.799,0-10.5-4.701-10.5-10.5c0-5.799,4.701-10.5,10.5-10.5S34.5,18.201,34.5,24 C34.5,29.799,29.799,34.5,24,34.5z"
                ></path>
              </svg>
            </div>
          </header>
          <main className="w-full overflow-y-auto  h-[calc(100vh-4rem)] text-gray-700 font-mono p-5">{children}</main>
        </div>
        {openSettings && <Settings handleClose={() => setOpenSettings(false)} />}
      </div>
    </>
  )
}

export default Layout
