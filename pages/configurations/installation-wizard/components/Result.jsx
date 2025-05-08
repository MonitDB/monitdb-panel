import { Button, Result, Space } from 'antd'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { useEventSource } from '~/contexts/events'

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
const ResultStep = ({ handlePreviusStep }) => {
  const { result } = useEventSource()

  const router = useRouter()

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
          {<ResultMessage>{resultMessage()}</ResultMessage>}
        </ResultContainer>
      </StepContainer>
      <div className="flex justify-end mt-10">
        <Space>
          <Button type="default" onClick={handlePreviusStep}>
            Previous
          </Button>

          <Button type="primary" onClick={() => router.push('/dashboard')}>
            Finish
          </Button>
        </Space>
      </div>
    </>
  )
}

export default ResultStep
