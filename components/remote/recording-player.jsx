/* eslint-disable unicorn/no-null, unicorn/prefer-add-event-listener, sonarjs/cognitive-complexity */
import { Alert, Button, Modal, Slider, Spin } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

import { useRemoteStore } from '~/services/state-manager/remote-store'
import { loadGuacamole } from '~/utils/guacamole'

const fmt = (ms) => {
  if (!ms || ms < 0) return '0:00'
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// Player embutido de gravações .guac (Guacamole.SessionRecording). Aceita o Blob
// baixado do endpoint de auditoria e reproduz o vídeo da sessão RDP/VNC no browser.
const RecordingPlayer = ({ name, open, onClose }) => {
  const { fetchRecordingBlob } = useRemoteStore()
  const containerReference = useRef(null)
  const recordingReference = useRef(null)
  const seekingReference = useRef(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)

  const cleanup = () => {
    const rec = recordingReference.current
    try { rec?.pause() } catch { /* noop */ }
    try { rec?.disconnect?.() } catch { /* noop */ }
    if (containerReference.current) containerReference.current.innerHTML = ''
    recordingReference.current = null
  }

  useEffect(() => {
    if (!open || !name) return
    let cancelled = false
    setLoading(true); setError(''); setPlaying(false); setDuration(0); setPosition(0)

    ;(async () => {
      try {
        const Guacamole = await loadGuacamole()
        const blob = await fetchRecordingBlob(name)
        if (cancelled) return
        const rec = new Guacamole.SessionRecording(blob)
        recordingReference.current = rec
        const display = rec.getDisplay()
        const box = containerReference.current
        box.innerHTML = ''
        box.append(display.getElement())

        const fit = () => {
          const w = display.getWidth()
          const h = display.getHeight()
          if (!w || !h || !box) return
          display.scale(Math.min(box.clientWidth / w, box.clientHeight / h) || 1)
        }
        display.onresize = () => fit()
        rec.onprogress = (dur) => { setDuration(dur); setLoading(false); fit() }
        rec.onload = () => { setLoading(false); fit() }
        rec.onplay = () => setPlaying(true)
        rec.onpause = () => setPlaying(false)
        rec.onseek = (millis) => { if (!seekingReference.current) setPosition(millis) }
      } catch (error_) {
        if (!cancelled) {
          setError(error_?.message || 'Could not load the recording.')
          setLoading(false)
        }
      }
    })()

    // eslint-disable-next-line consistent-return
    return () => { cancelled = true; cleanup() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, name])

  const toggle = () => {
    const rec = recordingReference.current
    if (!rec) return
    if (rec.isPlaying()) { rec.pause(); return }
    if (rec.getPosition() >= rec.getDuration()) rec.seek(0, () => rec.play())
    else rec.play()
  }

  const onSlide = (v) => { seekingReference.current = true; setPosition(v) }
  const onSlideEnd = (v) => {
    const rec = recordingReference.current
    if (rec) rec.seek(v, () => { seekingReference.current = false })
    else seekingReference.current = false
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      afterClose={cleanup}
      width={920}
      footer={null}
      destroyOnClose
      title={`Session replay — ${name || ''}`}
    >
      {error ? (
        <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} />
      ) : null}

      <div
        style={{ position: 'relative', height: '60vh', background: '#000', borderRadius: 6, overflow: 'hidden' }}
      >
        <div ref={containerReference} style={{ width: '100%', height: '100%' }} />
        {loading && !error ? (
          <Spin
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            tip="Loading recording…"
          />
        ) : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <Button type="primary" onClick={toggle} disabled={loading || !!error}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </Button>
        <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {fmt(position)} / {fmt(duration)}
        </span>
        <Slider
          style={{ flex: 1 }}
          min={0}
          max={duration || 1}
          value={position}
          onChange={onSlide}
          onAfterChange={onSlideEnd}
          tooltip={{ formatter: fmt }}
          disabled={loading || !!error}
        />
      </div>
    </Modal>
  )
}

export default RecordingPlayer
