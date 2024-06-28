/* eslint-disable react/no-children-prop */
/* eslint-disable no-unsafe-optional-chaining */

import { Comment } from '@ant-design/compatible'
import {
  Avatar,
  Button,
  Col,
  List,
  Modal,
  Rate,
  Row,
  Space,
  Table,
  Tooltip,
} from 'antd'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useUser } from '~/hooks/index'
import useAlertContext from '~/services/state-manager/alerts'

import { Textarea } from '../form'
import Loading from '../loading/loading'
import { Markdown } from '../md'

export const AlertHtmlSubTable = ({ serverId, idSeq, id }) => {
  const { userState } = useUser()
  const {
    getAlertHtml,
    getSuggestion,
    getPreviousSuggestions,
    rateSuggestion,
  } = useAlertContext()

  const [html, setHtml] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingAI, setLoadingAI] = useState(false)
  const [modal, setModal] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [htmlIndex, setHtmlIndex] = useState(0)

  const getPrevious = async () => {
    return getPreviousSuggestions(id)
  }

  const getHtml = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getAlertHtml(idSeq, serverId)
      setHtml(response)
    } catch {
      toast.error(
        `Error to get the HTML of ${idSeq} Alert, at Server ${serverId}\nIf problem persists, contact-us!`
      )
    } finally {
      setLoading(false)
    }
  }, [getAlertHtml, idSeq, serverId])

  const getAiSuggestion = async (serverId, alertId, htmlRow) => {
    try {
      setLoadingAI(true)
      const previousSuggestions = await getPrevious()

      if (previousSuggestions.length === 0) {
        await getSuggestion(serverId, alertId, htmlRow)
        const updatedPreviousSuggestions = await getPrevious()
        setSuggestions(updatedPreviousSuggestions)
        return
      }
      setSuggestions(previousSuggestions)
    } catch {
      toast.error(
        `Error to get the AI Suggestion of ${idSeq} Alert, at Server ${serverId}\nIf problem persists, contact-us!`
      )
    } finally {
      setLoadingAI(false)
    }
  }

  const Editor = () => {
    const [comment, setComment] = useState('')
    const [rate, setRate] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const handleSubmit = () => {
      setSubmitting(true)

      rateSuggestion({
        sugestionId: suggestions[suggestionIndex].id,
        rate,
        comment,
      })
        .then(({ data }) => {
          const updatedSuggestions = [...suggestions]

          updatedSuggestions[suggestionIndex].answers = data

          setSuggestions(updatedSuggestions)

          setComment('')
          setRate(0)
          setSubmitting(false)
        })
        .catch(() => {
          setSubmitting(false)
        })
    }

    return (
      <div>
        <Row>
          <Textarea
            rows={4}
            onChange={({ target }) => {
              setComment(target.value)
            }}
            value={comment}
          />

          <Rate value={rate} onChange={setRate} style={{ margin: '10px' }} />
        </Row>
        <Row>
          <Button
            htmlType="submit"
            loading={submitting}
            onClick={handleSubmit} // Chame a função handleSubmit ao clicar no botão
            type="primary"
          >
            Add Comment
          </Button>
        </Row>
      </div>
    )
  }

  const handlePreviousSuggestion = () => {
    setSuggestionIndex((previousIndex) => Math.max(0, previousIndex - 1))
  }

  const handleNextSuggestion = () => {
    setSuggestionIndex((previousIndex) =>
      Math.min(suggestions.length - 1, previousIndex + 1)
    )
  }

  const getNewSuggestion = async () => {
    setLoadingAI(true)
    try {
      await getSuggestion(serverId, idSeq, htmlIndex)
      const updatedPreviousSuggestions = await getPrevious()
      setSuggestions(updatedPreviousSuggestions)
      setSuggestionIndex(0)
    } catch {
      /* empty */
    }
    setLoadingAI(false)
  }

  useEffect(getHtml, [getHtml])

  return (
    <>
      <Table
        dataSource={html}
        loading={loading}
        columns={[
          ...(html && html.length > 0
            ? Object.keys(html[0]).map((element, index) => ({
                dataIndex: element,
                key: index,
                title: element,
                fixed: index === 0 ? 'left' : undefined,
              }))
            : []),
          {
            key: 'suggestion',
            fixed: 'right',
            render: (value, record, index) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <Button
                  type="dashed"
                  size="small"
                  children={<>See how to fix</>}
                  onClick={() => {
                    setModal(true)
                    setHtmlIndex(index)
                    getAiSuggestion(serverId, idSeq, index)
                  }}
                />
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={modal}
        onCancel={() => setModal(false)}
        height={'95vh'}
        width={'90%'}
        title="AI Result"
        closable={true}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div style={{ height: '70vh', overflowY: 'auto' }}>
          {loadingAI && (
            <div
              style={{
                marginTop: 0,
                marginBottom: 0,
                height: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Loading />
            </div>
          )}
          {!loadingAI && (
            <>
              <Row>
                <Col sm={12}>
                  <Row>
                    <Tooltip
                      title={moment(
                        suggestions[suggestionIndex]?.aiQuestionDateCreate
                      ).format('YYYY-MM-DD HH:mm:ss')}
                    >
                      <span>
                        {moment(
                          suggestions[suggestionIndex]?.aiQuestionDateCreate
                        ).format('YYYY-MM-DD')}
                      </span>
                    </Tooltip>
                  </Row>
                </Col>
                <Col sm={12}>
                  <Row justify={'end'}>
                    <Space>
                      <Space>
                        <Button
                          onClick={() => handlePreviousSuggestion()}
                          disabled={suggestionIndex === 0} // Desabilita o botão Previous quando estiver na primeira sugestão
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => handleNextSuggestion()}
                          disabled={suggestionIndex === suggestions.length - 1} // Desabilita o botão Next quando estiver na última sugestão
                        >
                          Next
                        </Button>
                      </Space>

                      <Button onClick={getNewSuggestion} type="primary">
                        New Suggestion
                      </Button>
                    </Space>
                  </Row>
                </Col>
              </Row>
              <br />
              <Markdown
                content={suggestions[suggestionIndex]?.solution}
                children={false}
                className="prose"
              />
              <Row>
                <List
                  dataSource={suggestions[suggestionIndex]?.answers}
                  header={`${suggestions[suggestionIndex]?.answers.length} ${
                    suggestions[suggestionIndex]?.answers.length > 1
                      ? 'replies'
                      : 'reply'
                  }`}
                  itemLayout="horizontal"
                  size="large"
                  style={{ width: '100%' }}
                  renderItem={(properties) => {
                    return (
                      <>
                        <Comment
                          datetime={
                            <Tooltip
                              title={moment(properties.answerDateCreate).format(
                                'YYYY-MM-DD HH:mm:ss'
                              )}
                            >
                              <span>
                                {moment(properties.answerDateCreate).fromNow()}
                              </span>
                            </Tooltip>
                          }
                          actions={[
                            <Rate key={0} value={properties.answerScore} />,
                          ]}
                          author={<a>{properties.user.loginName}</a>}
                          avatar={
                            <Avatar>{properties.user.loginName[0]}</Avatar>
                          }
                          content={<p>{properties.answerDescription}</p>}
                        />
                      </>
                    )
                  }}
                />
              </Row>
              <Comment
                avatar={
                  <Avatar
                    children={userState.loginName[0]}
                    alt={userState.loginName}
                  />
                }
                content={<Editor />}
              />
            </>
          )}
        </div>
      </Modal>
    </>
  )
}
