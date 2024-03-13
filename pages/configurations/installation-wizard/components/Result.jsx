import { Button, Space } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import StepContainer from './StepContainer'

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ResultMessage = styled.div`
  text-align: center;
  margin-top: 20px;
`

const ResultStep = ({ socket, handlePreviusStep }) => {
  const [result, setResult] = useState({ status: '', message: '' })

  const router = useRouter()
  const handleResult = (result) => {
    try {
      setResult(result)
    } catch {
      // console.log(error)
    }
  }
  useEffect(() => {
    if (socket) {
      socket.on('result', handleResult)
    }

    return () => {
      if (socket) {
        socket.off('result', handleResult)
      }
    }
  }, [socket])

  const resultMessage = () => {
    if (result) {
      switch (result.status) {
        case 'success':
          return (
            <>
              <h1>The server was successfully installed</h1>
              <p>{result.message}</p>
            </>
          )
        case 'error':
          return (
            <>
              <h1>There are some errors at installation of the server</h1>
              <p>{result.message}</p>
              <p>Please, try again</p>
            </>
          )
        default:
          return (
            <>
              <h1>The server returned an info</h1>
              <p>{result.message}</p>
            </>
          )
      }
    }
  }

  return (
    <>
      <StepContainer>
        <ResultContainer>
          <h2>Result Step</h2>
          {<ResultMessage>{resultMessage()}</ResultMessage>}
        </ResultContainer>
      </StepContainer>
      <div className="flex justify-end mt-10">
        <Space>
          <Button type="default" onClick={handlePreviusStep}>
            Previous
          </Button>

          <Button type="primary" onClick={() => router.push('/configurations')}>
            Finish
          </Button>
        </Space>
      </div>
    </>
  )
}

export default ResultStep
