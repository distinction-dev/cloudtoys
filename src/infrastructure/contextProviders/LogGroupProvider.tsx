import React from 'react'

type Props = {
  children: React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export const logGroupContext = React.createContext<any>(null)

const LogGroupProvider = ({ children }: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [logGroup, setLogGroup] = React.useState(null)
  return (
    <logGroupContext.Provider value={{ logGroup: logGroup, setLogGroup: setLogGroup }}>
      {children}
    </logGroupContext.Provider>
  )
}

export default LogGroupProvider
