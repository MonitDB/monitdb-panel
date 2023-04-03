function backupOrder(backups) {
  const data = {}

  if (Object.keys(backups).length === 0) return

  for (let key in backups) {
    data[key] = backups[key].sort((a, b) => {
      if (
        new Date(a.backup_start_date).getTime() >
        new Date(b.backup_start_date).getTime()
      ) {
        return -1
      }
      if (
        new Date(a.backup_start_date).getTime() <
        new Date(b.backup_start_date).getTime()
      ) {
        return 1
      }
      return 0
    })
  }

  return data
}

export const separeteBackups = (backups) => {
  const data = {}

  for (let backup of backups) {
    if (!data[backup.backup_type]) {
      data[backup.backup_type] = [backup]
    } else {
      data[backup.backup_type].push(backup)
    }
  }

  return backupOrder(data)
}
