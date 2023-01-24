import classNames from 'classnames'
import React from 'react'

import Image from '../image'

function BlockMessage({ className, type, message }) {
  return (
    <div className={classNames('w-full min-h-96', className)}>
      <div
        className={classNames(
          'border-l-[10px] shadow bg-gray-default py-4 px-3 rounded-[4px]',
          {
            'border-blue': type === 'information',
            'border-red': type === 'error',
          }
        )}
      >
        <div className="flex items-start">
          <span
            className={classNames(
              'font-bold rounded-full text-[10px] min-h-[18px] min-w-[18px] h-[18px] w-[18px] flex items-center justify-center mr-2',
              {
                'bg-blue text-white': type === 'information',
                'text-red': type === 'error',
              }
            )}
          >
            {type === 'information' && 'i'}
            {type === 'error' && (
              <Image
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAElBMVEX////MAADMAADMAADMAADMAABQ1zaeAAAABXRSTlMAMGDv8B7MKA8AAABZSURBVBjTY2AgDwiBCEUIm9FUgYGBKVgAzBEODWJgUA01BHNUQ0MVmEJBIkAAYoAEGGBSMAmwFFwCLBXEgI2DogzZABSjUSwVgTjHEeJQV5BDQwQwvUAyAADlhhVBRlX6zwAAAABJRU5ErkJggg=="
                width="30"
                height="30"
              />
            )}
          </span>
          {message}
        </div>
      </div>
    </div>
  )
}

export default BlockMessage
