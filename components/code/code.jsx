import Prism from 'prismjs'
import React, { useEffect, useRef } from 'react'

export default function Code({ code, language }) {
  const referenceCode = useRef()

  useEffect(() => {
    Prism.highlightElement(referenceCode.current)
  }, [code])

  return (
    <div className="w-full">
      <pre>
        <code
          ref={referenceCode}
          className={`language-${language} !py-2`}
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </pre>
    </div>
  )
}
