/* eslint-disable no-console */
import { Result } from 'antd'
import { useEffect, useState } from 'react'

const ResultStep = ({ socket }) => {
  const [result, setResult] = useState({ show: false, status: '', message: '' })
  useEffect(() => {
    socket?.on('result', (result) => {
      try {
        setResult(JSON.parse(result))
      } catch (error) {
        console.log(error)
      }
    })

    return () => {
      socket?.disconnect()
    }
  }, [socket])
  return (
    <div style={{ height: '70%', overflowY: 'auto', padding: '25px' }}>
      <h2>Result Step</h2>

      {result.show !== undefined && (
        <Result
          status={result.status ?? 'info'}
          title="There are some problems with your operation."
          icon={<></>}
          extra={[]}
        />
        // />
      )}
    </div>
  )
}

export default ResultStep
