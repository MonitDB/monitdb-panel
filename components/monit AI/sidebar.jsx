// Sidebar.js
import { FileTextOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

const { Sider } = Layout

const SidebarAI = () => {
  const router = useRouter()
  return (
    <Sider width={300} className="bg-gray-dark">
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
    </Sider>
  )
}

export default SidebarAI
