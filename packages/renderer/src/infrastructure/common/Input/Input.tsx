import React from 'react';

type Props = {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  id?: string;
};

const Input: React.FC<Props> = ({
  label,
  placeholder,
  name,
  type,
  id,
}: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="font-medium text-sm" htmlFor="pwd">
          {label}
        </label>
      </div>
      <input
        className="text-gray-500 border-gray-300 focus:ring-0 focus:border-gray-400 text-sm rounded-lg py-2.5 px-4 w-full"
        type={type || 'text'}
        name={name}
        id={id}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
