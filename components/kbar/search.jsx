'use client'
import { KBarAnimator, KBarPortal, KBarPositioner, KBarSearch } from 'kbar'

import KBarActions from './actions'
import RenderResults from './render'

export default function KBarSearchComponent() {
  return (
    <KBarPortal>
      <KBarPositioner
        style={{
          zIndex: 50,
          backdropFilter: 'blur(1px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <KBarAnimator
          style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '600px',
            color: '#111827',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            overflow: 'hidden',
          }}
        >
          <KBarActions />
          <KBarSearch
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              fontSize: '1rem',
              background: '#f9fafb',
              color: '#111827',
              outline: 'none',
            }}
            placeholder="Digite um comando..."
          />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}
