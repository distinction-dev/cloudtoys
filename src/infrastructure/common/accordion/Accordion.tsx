import React from 'react'
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'

type Props = {
  children: React.ReactNode
  title?: string | React.ReactNode
  defaultOpen?: boolean
  leftAdornment?: React.ReactNode
  rightAdornment?: React.ReactNode
  permanent?: boolean
  className?: React.HTMLProps<HTMLElement>['className']
  headerClasses?: React.HTMLProps<HTMLElement>['className']
  bodyClasses?: React.HTMLProps<HTMLElement>['className']
  iconClasses?: React.HTMLProps<HTMLElement>['className']
  openIcon?: React.ReactNode
  closeIcon?: React.ReactNode
}

const Accordion = ({
  defaultOpen,
  children,
  title,
  leftAdornment,
  rightAdornment,
  permanent,
  className,
  headerClasses,
  bodyClasses,
  iconClasses,
  openIcon,
  closeIcon,
}: Props) => {
  const [active, setActive] = React.useState(!!defaultOpen)
  const handleSetIndex = (open: boolean) => setActive(open)

  return (
    <div className={`flex flex-col justify-start items-start w-full p-0 font-mono ${className ?? ''}`}>
      {/* Accordion Header */}
      <div
        tabIndex={0}
        role="button"
        onClick={() => !permanent && handleSetIndex(!active)}
        className={`flex justify-start p-2 rounded w-full ${headerClasses ?? ''}`}
      >
        {!permanent && (
          <>
            <div className="flex items-center justify-center">
              {active ? (
                <>{openIcon ? openIcon : <IoIosArrowDown className={iconClasses ?? 'w-6 h-6'} />}</>
              ) : (
                <>{closeIcon ? closeIcon : <IoIosArrowForward className={iconClasses ?? 'w-6 h-6'} />}</>
              )}
            </div>
            &nbsp;
          </>
        )}
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-start items-center">
            {title && (
              <>
                {typeof title === 'string' ? <h4 className="font-bold text-lg whitespace-nowrap">{title}</h4> : title}
              </>
            )}
            {leftAdornment && leftAdornment}
          </div>
          {rightAdornment && rightAdornment}
        </div>
      </div>
      {/* Accordion Body */}
      {active && (
        <div className={`w-full rounded flex flex-col justify-start item-start ${bodyClasses ?? ''}`}>{children}</div>
      )}
    </div>
  )
}

export default Accordion
