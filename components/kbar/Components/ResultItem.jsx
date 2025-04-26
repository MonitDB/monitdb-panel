import { RightCircleOutlined } from '@ant-design/icons'
import React from 'react'

const ResultItem = React.forwardRef(function ResultItem({ action }, reference) {
  return (
    <div
      ref={reference}
      className={`px-3 py-2 leading-none rounded text-violet11 flex items-center justify-between hover:bg-gray hover:cursor-pointer `}
    >
      <header className="flex items-center gap-3">
        {action.icon}
        <div className="flex flex-col items-start">
          <h1 className="text-lg">{action.name}</h1>
          {action.subtitle && (
            <p className="text-sm text-violet9">{action.subtitle}</p>
          )}
        </div>
      </header>

      <div className="flex items-center gap-2">
        {action.shortcut?.length > 0 && (
          <div
            aria-hidden
            className="hidden md:flex"
            style={{ display: 'grid', gridAutoFlow: 'column', gap: '4px' }}
          >
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                style={{
                  padding: '4px 6px',
                  background: 'rgba(0 0 0 / .1)',
                  borderRadius: '4px',
                  fontSize: 14,
                }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        )}
        {/* 👇 Se a ação tiver filhos, indicamos com um chevron */}
        {action.children?.length > 0 && (
          <RightCircleOutlined className="w-4 h-4 text-violet9" />
        )}
      </div>
    </div>
  )
})

export default ResultItem
