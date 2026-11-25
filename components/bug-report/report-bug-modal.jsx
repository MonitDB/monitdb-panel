import { Alert, Button, Form, Input, Modal, Select, Upload } from 'antd'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import { useBugReportStore } from '~/services/state-manager/bug-report-store'

export const BUG_SECTIONS = [
  'Dashboard',
  'Alerts',
  'Analysis',
  'Reports',
  'States',
  'Integrations',
  'Monit AI',
  'Insights',
  'Terminal',
  'Files',
  'Desktop',
  'Configurations',
  'Login / account',
  'Other',
]

// Primeiro segmento do URL -> secção sugerida (o utilizador pode trocar).
const SECTION_BY_PATH = {
  '': 'Dashboard',
  dashboard: 'Dashboard',
  server: 'Dashboard',
  alerts: 'Alerts',
  analysis: 'Analysis',
  reports: 'Reports',
  states: 'States',
  integrations: 'Integrations',
  'monit-ai': 'Monit AI',
  insights: 'Insights',
  terminal: 'Terminal',
  files: 'Files',
  desktop: 'Desktop',
  configurations: 'Configurations',
  'my-account': 'Login / account',
}

const MAX_IMAGES = 3
const MAX_BYTES = 2 * 1024 * 1024
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp'])

const sectionFromPath = (asPath) => {
  const first = String(asPath || '')
    .split(/[#?]/)[0]
    .split('/')
    .find(Boolean)
  return SECTION_BY_PATH[first || ''] || 'Other'
}

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(file)
  })

const ReportBugModal = () => {
  const router = useRouter()
  const { open, closeReport, submit } = useBugReportStore()
  const [form] = Form.useForm()
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState()

  // Ao abrir: secção sugerida pela página atual, formulário limpo.
  useEffect(() => {
    if (!open) return
    form.setFieldsValue({
      section: sectionFromPath(router.asPath),
      title: '',
      description: '',
    })
    setImages([])
    setError('')
    setDone()
  }, [open, form, router.asPath])

  const addFiles = useCallback(async (files) => {
    setError('')
    const accepted = []
    for (const file of files) {
      if (!IMAGE_TYPES.has(file.type)) {
        setError('Only PNG, JPEG, GIF or WebP images.')
        continue
      }
      if (file.size > MAX_BYTES) {
        setError(`"${file.name || 'image'}" is larger than 2 MB.`)
        continue
      }
      accepted.push({
        name: file.name || `screenshot-${Date.now()}.png`,
        type: file.type,
        data: await readAsDataUrl(file),
      })
    }
    setImages((current) => {
      const next = [...current, ...accepted]
      if (next.length > MAX_IMAGES) setError(`At most ${MAX_IMAGES} images.`)
      return next.slice(0, MAX_IMAGES)
    })
  }, [])

  // Colar (Ctrl+V) um print em qualquer ponto do modal.
  useEffect(() => {
    if (!open || done) return
    const onPaste = (pasteEvent) => {
      const files = [...(pasteEvent.clipboardData?.files || [])].filter((f) =>
        f.type.startsWith('image/')
      )
      if (files.length > 0) {
        pasteEvent.preventDefault()
        addFiles(files)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [open, done, addFiles])

  const onSubmit = async (values) => {
    setSending(true)
    setError('')
    try {
      const result = await submit({
        ...values,
        pageUrl: window.location.href,
        images,
      })
      setDone(result)
    } catch (error_) {
      setError(
        error_?.response?.data?.message ||
          error_?.message ||
          'Could not send the report.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <Modal
      open={open}
      title="Report a bug"
      onCancel={closeReport}
      width={640}
      destroyOnClose
      footer={
        done ? (
          <Button type="primary" onClick={closeReport}>
            Close
          </Button>
        ) : (
          <>
            <Button onClick={closeReport}>Cancel</Button>
            <Button
              type="primary"
              loading={sending}
              onClick={() => form.submit()}
            >
              Send report
            </Button>
          </>
        )
      }
    >
      {done ? (
        <Alert
          type="success"
          showIcon
          message={`Thank you! Bug report #${done.id} was sent.`}
          description={
            done.emailStatus === 'failed'
              ? 'The report was saved; the email notification could not be sent, the team will still see it in MonitDB.'
              : 'The MonitDB team was notified by email.'
          }
        />
      ) : (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Section"
            name="section"
            rules={[{ required: true, message: 'Choose the section' }]}
          >
            <Select options={BUG_SECTIONS.map((s) => ({ value: s, label: s }))} />
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Write a short title' }]}
          >
            <Input maxLength={200} placeholder="What went wrong, in one line" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Describe the problem' }]}
          >
            <Input.TextArea
              rows={6}
              maxLength={20_000}
              placeholder="What did you do, what did you expect and what happened instead?"
            />
          </Form.Item>
          <Form.Item
            label="Screenshots"
            extra="Paste with Ctrl+V anywhere in this window, drag here or choose files. Up to 3 images, 2 MB each."
          >
            <Upload.Dragger
              multiple
              accept="image/png,image/jpeg,image/gif,image/webp"
              showUploadList={false}
              disabled={images.length >= MAX_IMAGES}
              beforeUpload={(file, fileList) => {
                if (file === fileList[0]) addFiles(fileList)
                return Upload.LIST_IGNORE
              }}
            >
              <p className="text-sm">
                {images.length >= MAX_IMAGES
                  ? 'Maximum number of images reached'
                  : 'Drop images here or click to choose'}
              </p>
            </Upload.Dragger>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {images.map((img, index) => (
                  <div key={img.name + index} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.data}
                      alt={img.name}
                      className="block h-24 w-auto max-w-[180px] object-cover rounded border border-gray-light"
                    />
                    <Button
                      size="small"
                      danger
                      className="absolute top-1 right-1"
                      onClick={() =>
                        setImages((current) =>
                          current.filter((_, position) => position !== index)
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Form.Item>
          {error && <Alert type="error" showIcon message={error} />}
        </Form>
      )}
    </Modal>
  )
}

export default ReportBugModal
