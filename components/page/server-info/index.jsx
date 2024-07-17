import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Col,
  Modal,
  Row,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'

import RdpButton from '~/components/rdpButton'
import SshButon from '~/components/sshButton'
import DatabaseIcons from '~/helpers/database-icons'
import { useUser } from '~/hooks/index'
import { getServerMetrics } from '~/services/servers'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

import { InstanceProperties } from '../dashboard/history-info/components/server-host-metrics/server-metrics/server-properties'

const { Title, Text } = Typography

export const ServerInfo = ({ currentServer }) => {
  const [serverMetrics, setServerMetrics] = useState()
  const { userState } = useUser()

  useEffect(() => {
    if (currentServer.id) {
      const fetch = async () => {
        try {
          const { data } = await getServerMetrics({ id: currentServer.id })
          setServerMetrics(data)
        } catch {
          setServerMetrics()
        }
      }

      fetch()
    }
  }, [currentServer.id])

  const memoryMB = serverMetrics?.osProperties?.['Memory MB']
  const logicProcessors = serverMetrics?.osProperties?.['Logic Processors']
  const osVersion = serverMetrics?.osProperties?.['OS_Version']
  const osRelease = serverMetrics?.osProperties?.['OS_Release']

  const serverInfo = serverMetrics ? (
    <>
      <Row gutter={16}>
        <Col sm={24}>
          <Text>
            OS Version: {osVersion} - Release: {osRelease}
          </Text>
          <br />
          <Text>
            Memory: {memoryMB ? `${Math.round(memoryMB / 1024)} GB` : 'N/A'}
          </Text>
          <br />
          <Text>CPUs: {logicProcessors ? logicProcessors : 'N/A'}</Text>
          <br />
        </Col>
      </Row>
    </>
  ) : (
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  )

  return (
    <>
      <Row align="middle" gutter={[16, 16]}>
        <Col>
          <Avatar
            size={128}
            style={{
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DatabaseIcons
              name={currentServer.type.typeServerName}
              className="w-24 h-24"
            />
          </Avatar>
        </Col>
        <Col>
          <Title level={4}>
            {currentServer.serverName}{' '}
            {hasPermission(
              userState,
              FeatureFunction.SQL_PROPERTIES,
              TypeGrant.READ
            ) && (
              <Tooltip title={'Instance Properties'}>
                <Button
                  icon={<ExclamationCircleOutlined />}
                  style={{ transform: 'translateY(-1px)' }}
                  type="outlined"
                  onClick={() => {
                    Modal.info({
                      title: 'Instance Properties',
                      width: '80vw',
                      content: (
                        <>
                          <InstanceProperties />
                        </>
                      ),
                    })
                  }}
                />
              </Tooltip>
            )}
            <Space>
              {serverMetrics?.osProperties?.['host_platform'] === 'Windows' && (
                <RdpButton
                  serverName={currentServer.serverName}
                  address={currentServer.serverHost}
                />
              )}
              {serverMetrics?.osProperties?.['host_platform'] === 'Linux' && (
                <SshButon
                  serverName={currentServer.serverName}
                  address={currentServer.serverHost}
                />
              )}
            </Space>
          </Title>
          {serverInfo}
        </Col>
      </Row>
    </>
  )
}
