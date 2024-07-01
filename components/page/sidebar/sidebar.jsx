import { Layout, List, Space, Typography } from 'antd'
import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

const { Sider } = Layout
const { Title } = Typography

const PageSidebar = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 1280 })

  return (
    <Sider
      theme="dark"
      width={isDesktop ? 320 : '100%'}
      style={{
        background: 'rgb(22 27 34)',
        color: 'white',
        padding: '8px',
        position: isDesktop ? 'fixed' : 'relative',
        top: isDesktop ? '64px' : '0',
        left: '0',

        height: isDesktop ? 'calc(100vh - 64px)' : 'auto',
        overflowY: isDesktop ? 'auto' : 'visible',
      }}
    >
      <div
        style={{
          padding: '32px',
          color: 'white',
        }}
      >
        {children}
      </div>
    </Sider>
  )
}

export const PageSidebarTitle = ({ children }) => {
  return (
    <Title
      level={3}
      style={{
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
      }}
    >
      <Space>{children}</Space>
    </Title>
  )
}

import styled from 'styled-components'

const StyledList = styled(List)`
  .sidebar-list-item {
    color: white;
    transition: background-color 0.3s;
    padding: 8px;
    padding-left: 20px;
    border-radius: 10px;
    margin-top: 2px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      cursor: pointer;
    }

    &.visited {
      background-color: rgba(255, 255, 255, 0.1); /* Estilo de visitado */
    }
  }
`

export const PageSidebarLinksList = ({ children }) => {
  const [lastClickedIndex, setLastClickedIndex] = useState()

  const handleItemClick = (index) => {
    setLastClickedIndex(index)
  }

  return (
    <StyledList
      itemLayout="vertical"
      dataSource={React.Children.toArray(children)}
      renderItem={(item, index) => (
        <List.Item
          className={`sidebar-list-item ${
            index === lastClickedIndex ? 'visited' : ''
          }`}
          onClick={() => handleItemClick(index)}
        >
          {item}
        </List.Item>
      )}
    />
  )
}

export default PageSidebar
