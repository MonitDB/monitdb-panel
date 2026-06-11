// import 'ace-builds/src-min-noconflict/ext-language_tools'
// import 'ace-builds/src-min-noconflict/mode-mysql'
// import 'ace-builds/src-noconflict/ace'
// import 'ace-builds/src-noconflict/theme-github'
import '@uiw/react-textarea-code-editor/dist.css'

import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const AceEditor = dynamic(
  () => import('react-ace').then((module_) => module_.default),
  { ssr: false }
)

import { Button, message as antdMessage } from 'antd'

import { GenericTable } from '~/components/table/genericTable'
import { useExecQueryContext } from '~/services/state-manager/execQuery'
import { usePendingQueryStore } from '~/services/state-manager/pending-query-store'

function QueryWindow(properties) {
  const { currentServer } = properties

  const [sqlCode, setSqlCode] = useState(
    `SELECT * FROM Historic.Historic_Parameter;`
  )

  const consumePendingQuery = usePendingQueryStore((s) => s.consumePendingQuery)

  // Quick win — pré-preenche com o SQL enviado pelo chat de IA ("Abrir no Query Window").
  useEffect(() => {
    const pending = consumePendingQuery()
    if (pending) {
      setSqlCode(pending)
      antdMessage.info('SQL carregado do chat de IA. Revise antes de executar.')
    }
  }, [consumePendingQuery])

  const { execQuery, loadingExecuteQuery, queryResult } = useExecQueryContext()

  const fetchData = async () => {
    try {
      await execQuery(sqlCode, currentServer?.id || undefined)
    } catch {
      /* empty */
    }
  }

  return (
    <>
      <br />
      <h3 className="font-bold mb-6">Execute Query</h3>
      <div className="col-span-2 bg-white border border-gray-light p-4 lg:col-span-12">
        <AceEditor
          id="editor"
          aria-label="editor"
          mode="mysql"
          theme="github"
          name="editor"
          fontSize={16}
          minLines={15}
          maxLines={10}
          width="100%"
          showPrintMargin={false}
          showGutter
          placeholder="Write your Query here..."
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
          value={sqlCode}
          onChange={setSqlCode}
          showLineNumbers
        />

        <div className="w-full flex justify-end mt-10 mb-10 ">
          <Button type="primary" style={{ width: '100px' }} onClick={fetchData}>
            Run
          </Button>
          <br />
          <br />
        </div>

        <GenericTable data={queryResult} loading={loadingExecuteQuery} />
      </div>
      <br />
      <br />
    </>
  )
}

export default QueryWindow
