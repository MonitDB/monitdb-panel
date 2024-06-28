/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Row, Select, Space } from 'antd'
import { useEffect, useState } from 'react'

import TerminalWindow from '~/components/terminal'
import { getAvailableVersions, installNewServer } from '~/services/servers'

import StepContainer from './StepContainer'

/**
 * Componente para configurar um novo passo de servidor.
 *
 * @param {Object} props - Props do componente.
 * @param {Function} props.handleNextStep - Função para avançar para o próximo passo.
 * @param {Function} props.handlePreviusStep - Função para voltar para o passo anterior.
 * @param {Object} props.form - Objeto contendo os dados do formulário.
 * @param {number} props.step - Número do passo atual.
 * @param {EventSource | undefined} props.eventSource - Objeto EventSource ou undefined.
 * @param {number} props.connectionId - ID da conexão.
 */

const SetUpNewServerStep = ({
  handleNextStep,
  handlePreviusStep,
  form,
  step,
  eventSource,
  connectionId,
}) => {
  const [terminalOutput, setTerminalOutput] = useState([])

  const [availableVersions, setAvailableVersions] = useState([])
  const [version, setVersion] = useState()
  const [installing, setInstalling] = useState(false)
  const [installResult, setInstallResult] = useState()

  const handleSocketMessage = (event) => {
    setTerminalOutput((previousOutput) => [...previousOutput, event])
  }

  useEffect(() => {
    eventSource.onmessage((event) => {
      handleSocketMessage(event.data)
    })

    eventSource?.addEventListener('error', () => {
      if (eventSource?.current?.readyState == EventSource.CLOSED) {
        setTerminalOutput((previousOutput) => [
          ...previousOutput,
          'Disconnected',
        ])
        setInstallResult()
      }
    })

    return () => {
      eventSource?.removeEventListener('message')
      eventSource?.removeEventListener('error')
    }
  }, [])

  useEffect(async () => {
    try {
      if (step === 2) {
        const availableVersionsResult = await getAvailableVersions()
        setAvailableVersions(availableVersionsResult.data)
      }
    } catch {
      /* empty */
    }
  }, [step])

  const handleInstall = async () => {
    setInstalling(true)
    setInstallResult()
    try {
      const { data } = await installNewServer(
        form.getFieldsValue(),
        version,
        connectionId
      )
      setInstallResult(data)
      setInstalling(false)
    } catch {
      setInstalling(false)
      return
    }
  }

  return (
    <>
      <StepContainer>
        <Row justify={'end'} gutter={12}>
          <Col sm={12}>
            <Select
              style={{ width: '100%' }}
              loading={!availableVersions}
              options={availableVersions?.map((availableVersion) => ({
                value: availableVersion.idVersion,
                label: availableVersion.versionName,
              }))}
              onChange={(value) => {
                setVersion(value)
              }}
            />
          </Col>
          <Col sm={5}>
            <Button disabled={!version || installing} onClick={handleInstall}>
              RUN
            </Button>
          </Col>
        </Row>
        <Row>
          <div
            className="mt-10"
            style={{ width: '100%', marginBotton: '10px' }}
          >
            <TerminalWindow
              height={'400px'}
              width={'100%'}
              buttons={[
                {
                  onClick: () => {
                    setTerminalOutput([])
                  },
                  tooltip: 'Clear terminal',
                },
              ]}
            >
              {terminalOutput.map((value, index) => (
                <p key={index}>{value}</p>
              ))}
            </TerminalWindow>
          </div>
        </Row>
      </StepContainer>
      <div className="flex justify-end mt-10">
        <Space>
          <Button type="default" onClick={() => handlePreviusStep()}>
            Previous
          </Button>

          <Button
            type="primary"
            disabled={!installResult}
            onClick={() => handleNextStep()}
          >
            Next
          </Button>
        </Space>
      </div>
    </>
  )
}

export default SetUpNewServerStep
