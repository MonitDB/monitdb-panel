/* eslint-disable sonarjs/cognitive-complexity */
import { Descriptions, Typography } from 'antd'

const { Title } = Typography

const ServerDetails = ({ currentServer }) => {
  const { serverDetail } = currentServer ?? {}

  return (
    <>
      <Title level={5}>Server</Title>

      <Descriptions size="small" column={2} bordered>
        <Descriptions.Item label="Name">
          {currentServer?.serverName || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Host">
          {currentServer?.serverHost || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {currentServer?.serverDescription || 'N/A'}
        </Descriptions.Item>

        {serverDetail && (
          <>
            <Descriptions.Item label="Detail Name">
              {serverDetail.serverDetailName || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Detail Description">
              {serverDetail.serverDetailDescription || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Detail Host">
              {serverDetail.serverDetailHost || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Detail Admin">
              {serverDetail.serverDetailAdmin || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Contact">
              {serverDetail.serverDetailContacto || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Operating System">
              {serverDetail.serverDetailSO || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Creation Date">
              {serverDetail.serverDetailDateCreate
                ? new Date(serverDetail.serverDetailDateCreate).toLocaleString()
                : 'N/A'}
            </Descriptions.Item>
          </>
        )}
      </Descriptions>

      {/* IP Addresses Section */}
      {serverDetail?.serverIp && serverDetail.serverIp.length > 0 ? (
        <div style={{ marginTop: '20px' }}>
          <Title level={5}>IP Addresses</Title>
          {serverDetail.serverIp.map((ip) => (
            <Descriptions
              key={ip.idServerIP}
              bordered
              size="small"
              style={{ marginBottom: '10px' }}
            >
              <Descriptions.Item label="IP Address">
                {ip.serverIPHost || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {ip.serverIPDescription || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          ))}
        </div>
      ) : (
        <></>
      )}

      {/* Services Section */}
      {serverDetail?.serverService && serverDetail.serverService.length > 0 ? (
        <div style={{ marginTop: '20px' }}>
          <Title level={5}>Services</Title>
          {serverDetail.serverService.map((service, index) => (
            <Descriptions
              label={`Service ${index + 1}`}
              key={service.idServerService}
              bordered
              size="small"
            >
              <Descriptions.Item label={'Name'}>
                {service.serverServiceName || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label={'Host'}>
                {service.serverServiceHost || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label={'Description'}>
                {service.serverServiceDescription || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label={'User'}>
                {service.serverServiceUser || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label={'Port'}>
                {service.serverServicePort || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default ServerDetails
