import React from 'react';

type Props = { handleClose: () => void };

const Settings: React.FC<Props> = ({ handleClose }: Props) => {
  return (
    // <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
    <>
      <div className="bg-black/10 w-full h-full flex justify-center items-center absolute z-10 inset-0 top-0 left-0">
        <div className="bg-white/50 rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
          <div className="md:flex items-center">
            <div className="mt-4  text-left text-gray-800 font-mono w-60">
              <h3 className="font-bold text-xl">Settings</h3>
              <div className="mt-4  text-left text-gray-800 font-mono p-2">
                <p className="font-bold">Region : eu-west-1</p>
              </div>
            </div>
          </div>
          <div className="text-center md:text-right mt-4 md:flex md:justify-end">
            <button
              className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-slate-700 rounded-lg font-semibold text-sm mt-4
            md:mt-0 md:order-1"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
