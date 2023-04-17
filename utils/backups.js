function backupOrder(backups) {
  const data = {}

  if (Object.keys(backups).length === 0) return

  for (let database_name in backups) {
    for (let backup_type in backups[database_name]) {
      data[database_name] = {
        ...data[database_name],
        [backup_type]: backups[database_name][backup_type].sort((a, b) => {
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
        }),
      }
    }
  }

  return data
}

export const separeteBackups = (backups) => {
  const data = {}

  for (let backup of backups) {
    if (!data[backup.database_name]) {
      data[backup.database_name] = {
        [backup.backup_type]: [backup],
      }
    } else {
      const databaseBackupType =
        data[backup.database_name][backup.backup_type] ?? []

      data[backup.database_name][backup.backup_type] = [
        ...databaseBackupType,
        backup,
      ]
    }
  }

  return backupOrder(data)
}
