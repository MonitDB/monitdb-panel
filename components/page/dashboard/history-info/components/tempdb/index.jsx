/* eslint-disable sonarjs/no-duplicate-string */
// import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tabs } from 'antd'
import React from 'react'

import Image from '~/components/image'

import { TemporaryDBDatabase } from './components/Database'
import { TemporaryDBLogin } from './components/Login'
import { TemporaryDBProgram } from './components/Program'
import { TemporaryDBSession } from './components/Session'
import { TemporaryDBSummary } from './components/Summary'

const Temppdb = () => {
  return (
    <div id="tempdb">
      <div className="grid grid-cols-[18px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAdCAMAAACZrWzKAAAAM1BMVEUAAAChoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGz8IU4AAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAAI9JREFUKM/FkUsOhDAMQ93Gbd0Pbe5/WhYgJGC2aLzLs6LEMgBYaWO5u7uvUXMEAOTpD20ZkP+Q/oE533QzAKndnNmIU4FFkqTCcBA1w0PWBLmvLp6LpPr6Oo6NNx0GIJabMxQBHBVFJklKPEdo1kceq/M4uUZVJsmkOtbn7QS96pkKAGDq24W67v8aebWFHeQVHSKfjqHNAAAAAElFTkSuQmCC"
          width="18"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">tempdb</h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <div>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Usage Summary',
              children: <TemporaryDBSummary />,
            },
            {
              key: '2',
              label: 'Session',
              children: <TemporaryDBSession />,
            },
            {
              key: '3',
              label: 'Login',
              children: <TemporaryDBLogin />,
            },
            {
              key: '4',
              label: 'Program',
              children: <TemporaryDBProgram />,
            },
            {
              key: '5',
              label: 'Database',
              children: <TemporaryDBDatabase />,
            },
          ]}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}

export default Temppdb
