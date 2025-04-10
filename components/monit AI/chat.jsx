/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prevent-abbreviations */
import { RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Input,
  Layout,
  List,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import React, { useEffect, useRef, useState } from 'react'

const { Header, Content, Footer } = Layout

const ChatAI = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isNew] = useState(true)
  const containerReference = useRef(null)

  const suggestions = [
    'Resuma este texto',
    'Explique este código',
    'Crie um plano de estudos',
    'Me ajude com uma ideia de negócio',
    'Gere um e-mail profissional',
  ]

  const loadPreviousMessages = () => {
    if (!hasMore) return
    const oldMessages = Array.from({ length: 5 }).map((_, index) => ({
      type: index % 2 === 0 ? 'user' : 'bot',
      text: `Mensagem antiga ${index + (page - 1) * 5 + 1}`,
    }))
    setMessages((previous) => [...oldMessages, ...previous])
    if (page >= 3) setHasMore(false)
    setPage((previous) => previous + 1)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      if (containerReference.current) {
        containerReference.current.scrollTop =
          containerReference.current.scrollHeight
      }
    }, 100)
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage = { type: 'user', text: input.trim() }
    setMessages((previous) => [...previous, userMessage])
    setInput('')
    setIsLoading(true)
    // setIsNew(false)

    setTimeout(() => {
      const botMessage = {
        type: 'bot',
        text: `Resposta gerada para: "${userMessage.text}"`,
      }
      setMessages((previous) => [...previous, botMessage])
      setIsLoading(false)
      scrollToBottom()
    }, 1500)
  }

  const handleSuggestionClick = (suggestionText) => {
    const userMessage = { type: 'user', text: suggestionText }
    setMessages((previous) => [...previous, userMessage])
    setIsLoading(true)
    // setIsNew(false)

    setTimeout(() => {
      const botMessage = {
        type: 'bot',
        text: `Resposta gerada para: "${suggestionText}"`,
      }
      setMessages((previous) => [...previous, botMessage])
      setIsLoading(false)
      scrollToBottom()
    }, 1500)
  }

  const handleScroll = () => {
    if (containerReference.current.scrollTop === 0 && hasMore) {
      const previousHeight = containerReference.current.scrollHeight
      loadPreviousMessages()
      setTimeout(() => {
        const newHeight = containerReference.current.scrollHeight
        containerReference.current.scrollTop = newHeight - previousHeight
      }, 100)
    }
  }

  useEffect(() => {
    loadPreviousMessages()
    scrollToBottom()
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: '#fff', fontSize: 20 }}>🧠 Monit AI</Header>
      <Content
        style={{
          padding: '24px',
          background: '#f0f2f5',
          overflow: 'hidden',
        }}
      >
        <div
          ref={containerReference}
          onScroll={handleScroll}
          style={{
            height: '65vh',
            overflowY: 'auto',
            paddingRight: 16,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isNew && (
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <Space direction="vertical">
                <div>
                  <Typography.Title level={3}>
                    What can I help with?
                  </Typography.Title>
                </div>

                <Space wrap style={{ justifyContent: 'center' }}>
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      type="default"
                      style={{ borderRadius: 20 }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </Space>
              </Space>
            </div>
          )}

          {!isNew && (
            <>
              {' '}
              <List
                dataSource={messages}
                renderItem={(message) => (
                  <List.Item
                    style={{
                      justifyContent:
                        message.type === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Space align="start">
                      {message.type === 'bot' && (
                        <Avatar icon={<RobotOutlined />} />
                      )}
                      <div
                        style={{
                          background:
                            message.type === 'user' ? '#1890ff' : '#e4e6eb',
                          color: message.type === 'user' ? '#fff' : '#000',
                          borderRadius: 8,
                          padding: '8px 12px',
                          maxWidth: 400,
                        }}
                      >
                        <Typography.Text>{message.text}</Typography.Text>
                      </div>
                      {message.type === 'user' && (
                        <Avatar icon={<UserOutlined />} />
                      )}
                    </Space>
                  </List.Item>
                )}
              />
              {isLoading && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 12,
                  }}
                >
                  <Avatar icon={<RobotOutlined />} />
                  <Skeleton
                    active
                    paragraph={{ rows: 1 }}
                    title={false}
                    style={{ marginLeft: 10, width: 300 }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Content>
      {isNew && (
        <Footer style={{ padding: 12, width: '100%' }}>
          <div style={{ width: '100%', padding: '0 16px' }}>
            <div style={{ display: 'flex', width: '100%' }}>
              <Input
                style={{ flex: 1, marginRight: 8 }}
                placeholder="Write your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={isLoading}
              />
            </div>
          </div>
        </Footer>
      )}
    </Layout>
  )
}

export default ChatAI
