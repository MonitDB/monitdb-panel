// Sidebar.js
import { FileTextOutlined } from '@ant-design/icons'
import { Avatar, Button, Layout, List, Space, Typography } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

const { Sider } = Layout

const SidebarAI = ({
  conversations,
  onSelectConversation,
  onNewConversation,
}) => {
  const router = useRouter()
  return (
    <Sider width={300}>
      <Button
        type="primary"
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        icon={<FileTextOutlined />}
        onClick={() => router.push('/monit-ai/new')}
      >
        New Chat
      </Button>

      {/* <List
        header={
          <Typography.Title
            level={5}
            style={{ color: '#ecf0f1', marginBottom: 16 }}
          >
            Conversas
          </Typography.Title>
        }
        emptyText="Nenhuma conversa criada"
        bordered
        dataSource={conversations}
        renderItem={(conversation, index) => (
          <List.Item
            style={{
              background: '#34495e',
              cursor: 'pointer',
              borderRadius: 8,
              marginBottom: 8,
            }}
            onClick={() => onSelectConversation(conversation, index)}
          >
            <Space>
              <Avatar style={{ backgroundColor: '#16a085' }} size="small">
                {conversation.title.charAt(0)}
              </Avatar>
              <Typography.Text style={{ color: '#ecf0f1' }}>
                {conversation.title}
              </Typography.Text>
            </Space>
          </List.Item>
        )}
      /> */}
    </Sider>
  )
}

export default SidebarAI
