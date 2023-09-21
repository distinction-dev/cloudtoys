import React from 'react'
import { useAuth } from '../../infrastructure/authentication/authContext'

type Props = {}

const sideBarOptions = [
  {
    name: 'Functions',
  },
  // {
  //   name: 'Log Groups',
  // },
]
const Layout = (props: Props) => {
  const { logout } = useAuth()
  const [logs, setLogs] = React.useState({})
  const fetchLogs = () => {
    window.electronApi.invoke('DescribeLogGroupsCommand', {}).then((res) => {
      setLogs({ ...res, rawValue: res?.logGroups })
    })
  }
  const handleOnchange = (event) => {
    const searchInput = event?.target?.value
    if (searchInput) {
      const rawValue = [...logs.rawValue]
      setLogs((prevState: any) => {
        return {
          ...prevState,
          logGroups: rawValue?.filter((item) => item?.logGroupName.toLowerCase().includes(searchInput.toLowerCase())),
        }
      })
    } else {
      setLogs((prevState: any) => {
        return {
          ...prevState,
          logGroups: prevState?.rawValue,
        }
      })
    }
  }
  React.useEffect(() => {
    fetchLogs()
  }, [])
  return (
    <nav className="w-64 bg-slate-900 fixed left-0 top-0 min-h-screen expanded flex flex-col justify-start items-start">
      {/* <div className="logo p-6 text-center">
        <h1 className=" text-2xl font-mono font-bold">CLOUD-TOY</h1>
      </div> */}
      <ul className="flex flex-col items-center mt-8 h-full b-2 border-slate-100 grow">
        {/* {sideBarOptions?.map((item, index) => {
          return (
            <li key={item?.name + '_' + index} className="h-14 w-full">
              <div className="bg-link-hover w-full h-full flex items-center p-5 text-gray-400 text-lg font-bold font-mono relative active">
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
                <span className="link-label">{item?.name}</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </li>
          )
        })} */}

        <li className="w-64 sidebarScroll bg-white/5  overflow-hidden">
          <div className="bg-link-hover flex items-center p-5 text-gray-400 text-lg font-bold font-mono relative active">
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
          <div className="p-4 bg-white/5">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleOnchange}
              className="w-full px-3 py-2 bg-white/10 rounded-full text-gray-400 font-mono focus:outline-none"
            />
          </div>

          {/* List Area with Scroll */}
          <div className="overflow-y-auto h-screen p-1 pb-10 ">
            <ul className="font-mono ">
              {logs?.logGroups?.length ? (
                logs?.logGroups?.map((item, index) => {
                  return (
                    <li
                      className="p-1 hover:bg-white/10 rounded-md whitespace-pre-wrap overflow-hidden "
                      key={`loggroup_${item?.creationTime}_${index}`}
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
        </li>
      </ul>
      {/* <ul className="flex flex-col items-center mt-8 h-full b-2 border-slate-100">
        <li className="h-14 w-full" onClick={logout}>
          <div className="bg-link-hover w-full h-full flex items-center p-5 text-gray-400 text-lg font-bold font-mono relative active">
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
            <span className="link-label">Log Out</span>
          </div>
        </li>
      </ul> */}
    </nav>
  )
}

export default Layout
