/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Row, Space } from 'antd'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

import TerminalWindow from '~/components/terminal'
import { installNewServer } from '~/services/servers'
import { SOCKET } from '~/utils/client-api'

const SetUpNewServerStep = ({
  handleNextStep,
  handlePreviusStep,
  form,
  step,
}) => {
  const [terminalOutput, setTerminalOutput] = useState([])
  const [socketID, setSocketID] = useState()

  useEffect(() => {
    if (step === 2) {
      const socket = io(SOCKET)

      const handleSocketMessage = (event) => {
        setTerminalOutput((previousOutput) => [...previousOutput, event])
      }

      socket.on('connect', () => {
        setSocketID(socket.id)
      })

      socket.on('message', handleSocketMessage)

      return () => {
        socket.off('message', handleSocketMessage)
        socket.disconnect()
      }
    }
  }, [step])

  useEffect(() => {
    installNewServer(form.getFieldsValue(), socketID)
  }, [form, socketID])

  return (
    <div>
      <h2>Set Up New Server Step</h2>
      <Row>
        <div className="mt-10" style={{ width: '100%', marginBotton: '10px' }}>
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

export default SetUpNewServerStep
