/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Row, Select, Space } from 'antd'
import { useEffect, useState } from 'react'

import TerminalWindow from '~/components/terminal'
import { getAvailableVersions, installNewServer } from '~/services/servers'

import StepContainer from './StepContainer'

const SetUpNewServerStep = ({
  handleNextStep,
  handlePreviusStep,
  form,
  step,
  socket,
  socketID,
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
    socket?.on('message', handleSocketMessage)
    socket?.on('disconnect', () => {
      setTerminalOutput((previousOutput) => [...previousOutput, 'Disconnected'])

      setInstallResult()
    })
  }, [socket])

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

  useEffect(() => {}, [form, socketID])

  const handleInstall = async () => {
    setInstalling(true)
    setInstallResult()
    try {
      const { data } = await installNewServer(
        form.getFieldsValue(),
        version,
        socketID
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
