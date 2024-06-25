import { Button, Result, Space } from 'antd'
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
/**
 * Componente para exibir o passo de resultado.
 *
 * @param {Object} props - Props do componente.
 * @param {EventSource | undefined} props.eventSource - Objeto EventSource ou undefined.
 * @param {Function} props.handlePreviusStep - Função para voltar para o passo anterior.
 */
const ResultStep = ({ eventSource, handlePreviusStep }) => {
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
    if (eventSource) {
      // eslint-disable-next-line unicorn/prevent-abbreviations
      eventSource.addEventListener('result', (e) => {
        handleResult(JSON.parse(e.data))
      })
    }
  }, [eventSource])

  const resultMessage = () => {
    if (result) {
      switch (result.status) {
        case 'success':
          return (
            <>
              <Result
                status={'success'}
                title={'The server was successfully installed'}
                subTitle={result.message}
              />
            </>
          )
        case 'error':
          return (
            <>
              <Result
                status={'error'}
                title={'There are some errors at installation of the server'}
                subTitle={result.message}
              />
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
          {/* <h2>Result Step</h2> */}
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
