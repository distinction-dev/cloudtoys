import React from 'react'
import Accordion from '../accordion/Accordion'

type Props = {}

const LogGroupSkeleton = (props: Props) => {
  return (
    <div className="flex flex-col justify-start items-start h-full">
      <Accordion
        title="Details"
        bodyClasses=" animate-pulse bg-gray-200 p-4"
        defaultOpen={true}
        rightAdornment={
          <div className="flex items-center">
            <div className="animate-pulse flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
              <div className="bg-gray-200 h-6 w-32 rounded-full"></div>
            </div>
            <div className="animate-pulse flex items-center ml-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
              <div className="bg-gray-200 h-6 w-32 rounded-full"></div>
            </div>
          </div>
        }
      >
        <div className=" h-28 rounded-md m-1 "></div>
      </Accordion>

      <Accordion
        title={`Streams`}
        permanent={true}
        defaultOpen={true}
        className="rounded"
        bodyClasses="p-0 flex justify-center items-center"
        leftAdornment={<div className="animate-pulse bg-gray-200 h-8 w-64 rounded-2xl ml-3"></div>}
      >
        {Array(10)
          .fill('logSreams')
          .map((item, index: number) => {
            return (
              <div key={item + index} className="animate-pulse bg-gray-200 h-8 rounded-md m-1 w-full ">
                &nbsp;
              </div>
            )
          })}
      </Accordion>
    </div>
  )
}

export default LogGroupSkeleton
