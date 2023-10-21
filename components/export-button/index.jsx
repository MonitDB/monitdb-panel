import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { saveAs } from 'file-saver'
import React from 'react'
import * as XLSX from 'xlsx'

const ExportButton = ({ data, fileName }) => {
  const handleExportClick = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)

    XLSX.utils.book_append_sheet(wb, ws, 'Planilha1')

    const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })

    // Use a função saveAs para salvar o arquivo no navegador
    saveAs(
      new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      `${fileName ?? 'MONIT_DB_FILE'}_${Date.now()}.xlsx`
    )
  }

  return (
    <button
      type="button"
      className="btn btn--small"
      onClick={handleExportClick}
    >
      <FontAwesomeIcon icon={faFileExport} className="mr-2" />
      Export
    </button>
  )
}

export default ExportButton
