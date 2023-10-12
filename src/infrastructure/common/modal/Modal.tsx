import React from 'react'
import { ImSpinner2 } from 'react-icons/im'

const Modal = ({
  closeModel,
  onConfirm,
  title,
  subTitle,
  isLoading,
}: {
  closeModel: any
  onConfirm: any
  title: string
  subTitle?: string
  isLoading?: boolean
}) => {
  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-center"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          onClick={closeModel}
          className="fixed inset-0 transition-opacity bg-gray-700 bg-opacity-60"
          aria-hidden="true"
        ></div>

        <div className="inline-block w-full max-w-md p-5 my-10 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl xl:max-w-xl">
          <div className="flex items-center justify-between space-x-4">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          </div>

          {subTitle && <h2 className="mt-4 font-extrabold text-gray-800">{subTitle}</h2>}
          <p className="mt-2 text-md text-gray-800">
            If you continue, you will permanently delete this record. Are you sure you want to continue?
          </p>

          <div className="flex justify-end mt-6">
            <button
              onClick={closeModel}
              type="button"
              className="mr-2 px-2 py-2 text-sm border-none focus:outline-none hover:border-none tracking-wide text-white capitalize transition-colors duration-200 transform bg-gray-500 hover:bg-gray-600 rounded-md shadow-md"
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              type="button"
              className="relative mr-2 px-2 py-2 text-sm border-none focus:outline-none hover:border-none tracking-wide text-white capitalize transition-colors duration-200 transform bg-red-500 hover-bg-red-600 rounded-md shadow-md hover:bg-red-600 active:bg-red-700"
            >
              Delete
              {isLoading && (
                <span className="text-white absolute top-0 left-0 w-full h-full flex justify-center items-center ">
                  <ImSpinner2 className={'animate-spin w-5 h-5'} />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
