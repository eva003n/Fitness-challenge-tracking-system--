import React from 'react'

const TextArea = ({...props}) => {
  return (
    <textarea {...props} className='dark:bg-slate-800  border-none outline-none dark:text-gray-400 bg-gray-200  dark:disabled:bg-gray-800 disabled:bg-slate-100 rounded-md p-2'></textarea>
  )
}

export default TextArea