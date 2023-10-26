import React from 'react'

type Props = {
  message: string
  children: React.ReactNode
}

const Tooltip: React.FC<Props> = ({ message, children }: Props) => {
  return (
    <div className="group relative flex">
      {children}
      <span
        className="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 hover:hidden"
        style={{ zIndex: 99999 }}
      >
        {message}
      </span>
    </div>
  )
}

export default Tooltip
