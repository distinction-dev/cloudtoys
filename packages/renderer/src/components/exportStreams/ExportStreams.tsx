/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import Accordion from '../../infrastructure/common/accordion/Accordion'
import { MdOutlineArrowBack, MdCalendarMonth } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { LogGroupContext } from '../layout/Layout'

const ExportStreams = () => {
  const { logGroup } = React.useContext(LogGroupContext)

  const navigate = useNavigate()
  const [startDate, setStartDate] = useState<string | number>(0)
  const [endDate, setEndDate] = useState<string | number>(0)
  const [startHour, setStartHour] = useState<string | number>(0)
  const [startMinute, setStartMinute] = useState<string | number>(0)
  const [endHour, setEndHour] = useState<string | number>(0)
  const [endMinute, setEndMinute] = useState<string | number>(0)

  const handleStartMinuteChange = (e: { target: { value: string | number } }) => {
    setStartMinute(e.target.value)
  }
  const handleEndMinuteChange = (e: { target: { value: string | number } }) => {
    setEndMinute(e.target.value)
    handleStartMinuteChange(e)
  }

  const handleStartDateChange = (e: { target: { value: string | number } }) => {
    setStartDate(e.target.value)
    handleEndMinuteChange({ target: { value: 0 } })
  }

  const handleEndDateChange = (e: { target: { value: string | number } }) => {
    setEndDate(e.target.value)
  }

  const handleStartHourChange = (e: { target: { value: string | number } }) => {
    setStartHour(e.target.value)
  }

  const handleEndHourChange = (e: { target: { value: string | number } }) => {
    setEndHour(e.target.value)
  }

  const dateClases: React.HTMLProps<HTMLElement>['className'] =
    'focus:outline-none border border-solid border-transparent hover:border-secondary-700 bg-black/5 rounded m-0 p-1 mx-1 '
  return (
    <div className="flex flex-col justify-start items-start h-full">
      <Accordion
        title={
          <>
            <button
              className="focus:outline-none bg-transparent border-none p-1 m-0 hover:bg-primary-300 active:bg-primary-400 rounded-md text-primary-500 hover:text-white font-bold"
              onClick={() => navigate(-1)}
            >
              <MdOutlineArrowBack className={'w-10 h-6'} />
            </button>
            <h4 className="whitespace-nowrap font-bold text-lg m-1">
              Export Stream To S3 &nbsp;:&nbsp;{logGroup?.logGroupName}
            </h4>
          </>
        }
        permanent={true}
        defaultOpen={true}
        headerClasses="p-0 m-0"
        className="rounded h-full overflow-hidden"
        bodyClasses="p-2 bg-white"
      >
        <div className="flex flex-col justify-between items-start p-2">
          <div className="flex flex-col justify-start items-start text-secondary-800 w-full my-2">
            <div className="whitespace-nowrap flex justify-start items-center m-1">
              <MdCalendarMonth />
              &nbsp;
              <h6>Select Date Range</h6>
            </div>
            <div className="flex justify-start items-between">
              <div className="flex justify-start items-center">
                <h6>From&nbsp;</h6>
                <input type="date" value={startDate} onChange={handleStartDateChange} className={dateClases} />
                <input
                  type="time"
                  value={`${startHour}:${startMinute}`}
                  onChange={handleStartHourChange}
                  className={dateClases}
                />
              </div>
              <div className="flex justify-start items-center ml-3">
                <h6>To&nbsp;</h6>
                <input type="date" value={endDate} onChange={handleEndDateChange} className={dateClases} />
                <input
                  type="time"
                  value={`${endHour}:${endMinute}`}
                  onChange={handleEndHourChange}
                  className={dateClases}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start text-secondary-800 w-full my-2">
            <h6 className="m-1">Stream Prefix (optional)</h6>
            <input
              type="text"
              className={
                'focus:outline-none border border-solid border-transparent hover:border-secondary-700 bg-black/5 rounded m-0 p-1 w-full'
              }
            />
          </div>
          <div className="flex flex-col justify-start items-start text-secondary-800 w-full my-2">
            <h6 className="m-1">S3 Bucket Name</h6>

            <select
              name="region"
              id="region"
              className="block focus:outline-none
                border border-solid border-transparent hover:border-secondary-700 bg-black/5 rounded m-0 p-1 w-full"
            >
              {['bucket-1', 'bucket-2', 'bucket-3'].map((item: string) => {
                return (
                  <option key={item} value={item}>
                    {item}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="flex justify-start items-start text-secondary-800 w-full my-2">
            {/* <div className="flex items-center"> */}
            <button
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="focus:outline-none bg-transparent hover:bg-slate-500 text-slate-700 font-semibold hover:text-white py-1 m-1 px-3 border border-slate-500 hover:border-transparent rounded flex items-center justify-between active:bg-slate-400"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="focus:outline-none bg-slate-500 hover:bg-transparent text-white font-semibold py-1 m-1 px-3 border border-slate-500 hover:text-slate-500   rounded flex hover:border-slate-500 items-center justify-between active:bg-slate-100"
            >
              Start Export
            </button>
            {/* </div> */}
          </div>
        </div>
        {/* <div>
          <div>
            Selected Date Range: {startDate} {startHour}:{startMinute} - {endDate} {endHour}:{endMinute}
          </div>
        </div> */}
      </Accordion>
    </div>
  )
}

export default ExportStreams
