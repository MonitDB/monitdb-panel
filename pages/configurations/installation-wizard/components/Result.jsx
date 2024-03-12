/* eslint-disable no-console */
import { Button, Result, Space } from 'antd'
import { useEffect, useState } from 'react'

const ResultStep = ({ socket, handlePreviusStep, handleNextStep }) => {
  const [result, setResult] = useState({ show: false, status: '', message: '' })
  useEffect(() => {
    socket?.on('result', (result) => {
      try {
        setResult(result)
      } catch (error) {
        console.log(error)
      }
    })
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
      <div className="flex justify-end mt-10">
        <Space>
          <Button type="default" onClick={() => handlePreviusStep()}>
            Previous
          </Button>

          <Button type="primary" onClick={() => handleNextStep()}>
            Next
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default ResultStep
