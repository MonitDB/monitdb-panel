import NextImage from 'next/image'
import React, { useEffect, useState } from 'react'

const Image = ({
  src,
  url,
  size = '',
  sizes = {},
  alt = '',
  width,
  height,
  loading = 'lazy',
  layout = 'raw',
  ...properties
}) => {
  const [customSource, setCustomSource] = useState('')

  useEffect(() => {
    setCustomSource(sizes[size] || src || url)
  }, [setCustomSource, src, url, size, sizes])

  if ((!src && !url) || !customSource) {
    return ''
  }

  return (
    <NextImage
      src={customSource}
      alt={alt}
      width={width}
      height={height}
      layout={layout}
      loading={loading}
      {...properties}
    />
  )
}

export default Image
