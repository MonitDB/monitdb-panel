/* eslint-disable no-extra-semi */
/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable sonarjs/no-empty-collection */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prevent-abbreviations */
import {
  ApiOutlined,
  PauseOutlined,
  RobotOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Input,
  Layout,
  List,
  message as antdMessage,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import { useChatStore } from '~/services/state-manager/chat-store'
import { usePendingQueryStore } from '~/services/state-manager/pending-query-store'
import { APIV2,apiV2 } from '~/utils/client-api'
import { apiLocalLLM } from '~/utils/client-api-local-llm'
import { getUserToken } from '~/utils/cookies'

import { Markdown } from '../md'

const { Content } = Layout

// Lê o stream SSE (data: {...}\n\n) e despacha por tipo de evento.
async function consumeSSEStream(response, { onDelta, onStatus, onDone }) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let reading = true
  while (reading) {
    const { value, done } = await reader.read()
    if (done) {
      reading = false
      break
    }
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop()
    for (const part of parts) {
      const line = part.trim()
      if (!line.startsWith('data:')) continue
      const ev = JSON.parse(line.slice(5).trim())
      switch (ev.type) {
        case 'delta':
          onDelta(ev.text)
          break
        case 'status':
          onStatus(ev.text)
          break
        case 'done':
          onDone(ev)
          break
        case 'error':
          throw new Error(ev.message)
        default:
          break
      }
    }
  }
}

const ChatAI = () => {
  const router = useRouter()
  const { query, pathname } = router

  // const  = JSON.parse(localStorage.getItem('app:usingRemoteLLMs')) ?? false;
  const usingRemoteLLMs = true;

  const [input, setInput] = useState('')
  const [hasHandledURLQuery, setHasHandledURLQuery] = useState(false)
  const [sessionUsage, setSessionUsage] = useState()
  const containerReference = useRef(null)
  const controllerReference = useRef(null)

  // Resumo de uso/custo da sessão (tokens + custo estimado)
  const loadSessionUsage = async (id) => {
    if (!id || id === 'new') return
    try {
      const { data } = await apiV2().get(`ai/usage/${id}`)
      setSessionUsage(data)
    } catch {
      // silencioso: o resumo é informativo
    }
  }

  // eslint-disable-next-line unicorn/consistent-destructuring
  const chatId = router.query['chat-id'] || 'new'
  const isNew = chatId === 'new'

  // O ecra vazio dizia "What can I help with?" e mais nada: a lista de sugestoes
  // estava literalmente vazia. Sao as perguntas que um DBA faz primeiro; clicar
  // escreve a pergunta na caixa e o utilizador envia (ou corrige) — nao dispara
  // nada sozinho.
  // Falta a quarta do desenho da Sara ("Analisar um ficheiro"): o anexo ainda nao
  // existe nesta forma e um cartao a prometer upload seria uma promessa falsa.
  const suggestions = [
    {
      title: 'Slow queries now',
      hint: 'Top consumers by CPU and reads',
      prompt:
        'Which queries are the slowest right now? Show the query text and the wait type.',
    },
    {
      title: 'Who is blocking?',
      hint: 'Blocking chain and root session',
      prompt:
        'Is there any blocking right now? Show the blocking chain and the root session.',
    },
    {
      title: 'Disk and memory',
      hint: 'Free space and memory pressure',
      prompt:
        'How is disk space and memory looking? Point out anything near its threshold.',
    },
  ]

  const {
    renameChat,
    loadPreviousMessages,
    messages,
    setMessages,
    fetchChats,
    chatId: currentChatId,
    loadingMessages,
  } = useChatStore()

  const setPendingQuery = usePendingQueryStore((s) => s.setPendingQuery)

  // Quick win — "Abrir no Query Window": guarda o SQL sugerido e avisa o usuário.
  // O Query Window pré-preenche a partir do store ao ser aberto (qualquer servidor).
  const handleOpenQuery = (sql) => {
    if (!sql) return
    setPendingQuery(sql)
    antdMessage.success(
      'SQL sent to the Query Window. Open a server\u2019s Query Window to review it and run it.'
    )
  }

  // Quick win — exportar a conversa como Markdown (.md).
  const handleExportChat = async () => {
    if (!messages || messages.length === 0) return
    const md = messages
      .filter((m) => ['user', 'assistant'].includes(m.role))
      .map((m) => {
        const who = m.role === 'user' ? '## 🧑 User' : '## 🤖 MonitAI'
        return `${who}\n\n${(m.message || '').trim()}\n`
      })
      .join('\n---\n\n')
    const header = `# MonitDB — Conversa de IA\n\n`
    try {
      const { saveAs } = await import('file-saver')
      const blob = new Blob([header + md], {
        type: 'text/markdown;charset=utf-8',
      })
      saveAs(blob, `monitai-chat-${chatId}.md`)
    } catch {
      antdMessage.error('Could not export the conversation.')
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      if (containerReference.current) {
        containerReference.current.scrollTop =
          containerReference.current.scrollHeight
      }
    }, 100)
  }

  useEffect(() => {
    if (isNew && query.query && !hasHandledURLQuery) {
      const base64ToString = Buffer.from(query.query, 'base64').toString('utf8')
      setInput(base64ToString)
      setHasHandledURLQuery(true)
      handleSend(base64ToString)
    }
  }, [isNew, query.query, hasHandledURLQuery])

  // STREAMING: cria a bolha do assistente e a preenche token a token.
  const streamRemoteCompletion = async (genChatId, text, controller) => {
    const assistantId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...(prev || []).filter((m) => m.role !== 'loading'),
      { id: assistantId, role: 'assistant', message: '', streaming: true },
    ])
    const updateBubble = (patch) =>
      setMessages((prev) =>
        (prev || []).map((m) => (m.id === assistantId ? { ...m, ...patch } : m))
      )

    const token = getUserToken()
    const response = await fetch(`${APIV2}/ai/completions/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.apiKey,
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({ chatId: genChatId, message: text }),
      signal: controller.signal,
    })
    if (!response.ok || !response.body) {
      throw new Error(`HTTP ${response.status}`)
    }

    let acc = ''
    let done
    await consumeSSEStream(response, {
      onDelta: (t) => {
        acc += t
        updateBubble({ message: acc })
      },
      onStatus: (t) => updateBubble({ message: acc || `_${t}_` }),
      onDone: (ev) => {
        done = ev
      },
    })

    updateBubble({
      message: done?.message ?? acc,
      role: done?.role || 'assistant',
      totalTokens: done?.totalTokens,
      cost: done?.cost,
      streaming: false,
    })
    loadSessionUsage(genChatId)
  }

  const handleSend = async (messageToSend) => {
    const inputMessage = String(messageToSend || input || '')

    if (!inputMessage?.trim()) return

    let controller = new AbortController()
    controllerReference.current = controller

    const userMessage = {
      id: Date.now(),
      role: 'user',
      message: inputMessage.trim(),
    }

    const loadingMessage = {
      id: `loading-${Date.now()}`,
      role: 'loading',
      message: '',
    }

    let generatedChatId = chatId
    const initialMessages = isNew
      ? [userMessage, loadingMessage]
      : [...(messages || []), userMessage, loadingMessage]

    setMessages(initialMessages)
    setInput('')

    try {
      if (isNew) {
        router.replace({
          pathname: pathname,
          query: { 'chat-id': Date.now() },
        })
        const { data: createdChat } = await apiV2().post(
          'ai/create-chat',
          {},
          {
            signal: controller.signal,
          }
        )

        generatedChatId = createdChat.id

        renameChat(generatedChatId, inputMessage.trim()).then(fetchChats)
        router.replace({
          pathname: pathname,
          query: { 'chat-id': generatedChatId },
        })
      }

      if (usingRemoteLLMs) {
        await streamRemoteCompletion(generatedChatId, inputMessage.trim(), controller)
      } else {
        const { data } = await apiLocalLLM.post(
          `llm/${process.env.localLLMCollectionName}/chat`,
          {
            prompt: inputMessage.trim(),
            model: 'llama3.1:8b',
          }
        )
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: data.choices[0].message.role,
          message: data.choices[0].message.content,
          totalTokens: data.usage.totalTokens,
        }
        setMessages((prev) =>
          isNew
            ? [userMessage, assistantMessage]
            : [...(prev || []).filter((m) => m.role !== 'loading'), assistantMessage]
        )
      }
    } catch (error) {
      setMessages((prev) => [
        ...(prev || []).filter((m) => m.role !== 'loading'),
        {
          id: `error-${Date.now()}`,
          role: 'error',
          message: error.message + ' ' + (error?.response?.data?.message ?? ''),
        },
      ])
    } finally {
      setInput('')
      scrollToBottom()
    }
  }

  const handleStop = async () => {
    if (controllerReference.current) {
      controllerReference.current.abort()
      controllerReference.current = undefined
    }
  }

  useEffect(() => {
    ;(async () => {
      await loadPreviousMessages()
      scrollToBottom()
    })()
    loadSessionUsage(chatId)
  }, [currentChatId])

  const isLoadingCurrentChatMessages = loadingMessages === chatId

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Content
        style={{
          overflowY: 'hidden',
          display: `${isNew ? 'flex' : 'block'}`,
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {!isNew && sessionUsage && (
          <div
            style={{
              display: 'flex',
              // Auditoria, nao leitura: encostado a direita em vez de centrado
              // a competir com o texto da conversa.
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8,
              padding: '8px 24px',
              fontSize: 12,
              color: '#888',
              borderBottom: '1px solid #f0f0f0',
            }}
            title="Usage for this session. Historical cost is estimated from the total token count."
          >
            <span>{sessionUsage.messageCount} msgs</span>
            <span>·</span>
            <span>
              {Number(sessionUsage.totalTokens || 0).toLocaleString('pt-BR')}{' '}
              tokens
            </span>
            <span>·</span>
            <span>~US$ {Number(sessionUsage.estimatedCost || 0).toFixed(4)}</span>
            {sessionUsage.model && (
              <>
                <span>·</span>
                <span>{sessionUsage.model}</span>
              </>
            )}
            <span>·</span>
            <span
              role="button"
              tabIndex={0}
              onClick={handleExportChat}
              onKeyDown={(e) => e.key === 'Enter' && handleExportChat()}
              style={{ cursor: 'pointer', color: '#5046e5' }}
              title="Export the chat as Markdown"
            >
              Export
            </span>
          </div>
        )}
        {isLoadingCurrentChatMessages && (
          <div
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '70vh',
              padding: '0 15%',
              background: 'rgba(255, 255, 255, 0)',
            }}
          >
            <br />
            <Skeleton />
            <br />
            <Skeleton />
            <br />
            <Skeleton />
          </div>
        )}
        {!isLoadingCurrentChatMessages && (
          <div
            ref={containerReference}
            style={{
              height: `${isNew ? '' : 'calc(100vh - 270px)'}`,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              scrollBehavior: 'smooth',
            }}
          >
            {isNew && (
              <div
                style={{
                  margin: 'auto',
                  width: '100%',
                  maxWidth: 820,
                  padding: '0 8px',
                }}
              >
                <Typography.Title level={3} style={{ marginBottom: 4 }}>
                  What can I help with?
                </Typography.Title>
                <p style={{ margin: '0 0 24px 0', color: '#6b7280' }}>
                  Ask about performance, blocking, disk or memory. Answers are
                  built from the data the collector has for your servers.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gap: 12,
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(220px, 1fr))',
                  }}
                >
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.title}
                      type="button"
                      className="ai-suggestion"
                      onClick={() => setInput(suggestion.prompt)}
                    >
                      <span className="ai-suggestion-title">
                        {suggestion.title}
                      </span>
                      <span className="ai-suggestion-hint">
                        {suggestion.hint}
                      </span>
                    </button>
                  ))}
                </div>
                <style>{`
                  .ai-suggestion {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    text-align: left;
                    padding: 12px 14px;
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: border-color .15s, box-shadow .15s;
                  }
                  .ai-suggestion:hover,
                  .ai-suggestion:focus-visible {
                    border-color: #5046e5;
                    box-shadow: 0 1px 6px rgba(80, 70, 229, .12);
                  }
                  .ai-suggestion-title {
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #24292f;
                  }
                  .ai-suggestion-hint {
                    font-size: 12px;
                    color: #6b7280;
                  }
                `}</style>
              </div>
            )}

            {!isNew && (
              <>
                <List
                  dataSource={messages}
                  style={{
                    height: '100%',
                    overflow: 'auto',
                    // Coluna de leitura: 860px centrados em vez de 15% de cada
                    // lado (que a 1600 dava 1250px de linha e o buraco no meio).
                    // O padding de baixo e o que impede a ultima linha da
                    // resposta de ficar por baixo da caixa de escrever.
                    width: '100%',
                    maxWidth: 860,
                    margin: '0 auto',
                    padding: '16px 8px 120px 8px',
                  }}
                  renderItem={(message) => (
                    <List.Item
                      key={message.id}
                      style={{
                        justifyContent:
                          message.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '100%',
                        margin: 0,
                      }}
                    >
                      <Space align="start">
                        {(message.role === 'assistant' ||
                          message.role === 'loading') && (
                          <Avatar icon={<RobotOutlined />} />
                        )}

                        {message.role === 'error' && (
                          <Avatar icon={<ApiOutlined />} />
                        )}

                        {/* A bolha so faz sentido na pergunta, que e curta e vai
                            encostada a direita. A resposta e um documento com
                            seccoes, SQL e origem do dado: dentro de uma caixa
                            branca sobre fundo branco a moldura nao se via e o
                            padding so lhe roubava largura. */}
                        <div
                          className="message-bubble"
                          style={{
                            position: 'relative',
                            background:
                              message.role === 'user' ? '#5046e5' : 'transparent',
                            borderRadius: message.role === 'user' ? 8 : 0,
                            padding:
                              message.role === 'user' ? '8px 12px' : '2px 0',
                            maxWidth: '100%',
                            margin: '0 0 10px 0',
                            color: message.role === 'user' ? '#fff' : '#000',
                          }}
                        >
                          {message.role === 'assistant' && (
                            <Markdown
                              content={message.message.trim()}
                              className="prose"
                              onOpenQuery={handleOpenQuery}
                            />
                          )}

                          {message.role === 'user' && (
                            <p style={{ color: '#fff', margin: 0 }}>
                              {message.message.trim()}
                            </p>
                          )}

                          {message.role === 'error' && (
                            <p style={{ color: 'red', margin: 0 }}>
                              {message.message.trim()}
                            </p>
                          )}

                          {message.role === 'loading' && (
                            <Skeleton
                              active
                              paragraph={{ rows: 1 }}
                              title={false}
                              style={{ marginLeft: 10, width: 300 }}
                            />
                          )}

                          <div id="toolbar">
                            {/* > 0 e nao apenas o valor: com o Copilot totalTokens
                                vem 0, e `0 && ...` faz o React desenhar o proprio 0
                                solto no fundo da bolha. */}
                            {message.totalTokens > 0 && (
                              <Typography.Text
                                type="secondary"
                                style={{
                                  position: 'absolute',
                                  bottom: -18,
                                  right: 0,
                                  fontSize: 10,
                                  display: 'none',
                                }}
                                className="token-count"
                              >
                                {message.totalTokens} tokens
                              </Typography.Text>
                            )}
                          </div>
                        </div>

                        {message.role === 'user' && (
                          <Avatar icon={<UserOutlined />} />
                        )}
                      </Space>

                      <style>{`
                        .message-bubble:hover .token-count {
                          display: block !important;
                        }
                      `}</style>
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        )}
        <div
          style={{
            width: '100%',
            maxWidth: 820,
            margin: '0 auto',
            padding: '1.2rem 8px 0 8px',
          }}
        >
          <Card hoverable variant="borderless">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <Input.TextArea
                style={{ flex: 1 }}
                variant="borderless"
                placeholder="Write your message..."
                value={input}
                size="large"
                autoSize={{ minRows: 3, maxRows: 5 }}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey && !isLoadingCurrentChatMessages) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              {/* Era role="primary" — role e um atributo de acessibilidade, nao
                  uma prop do antd: o botao de enviar nunca chegou a ser primario
                  e saia cinzento. type="primary" e que lhe da o indigo. */}
              <Button
                style={{ marginLeft: 'auto' }}
                type="primary"
                icon={
                  isLoadingCurrentChatMessages ? (
                    <PauseOutlined />
                  ) : (
                    <SendOutlined />
                  )
                }
                onClick={() =>
                  isLoadingCurrentChatMessages ? handleStop() : handleSend()
                }
              />
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 11,
                color: '#9ca3af',
              }}
            >
              Enter sends · Shift+Enter for a new line
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  )
}

export default ChatAI
