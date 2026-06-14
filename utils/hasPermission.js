export const FeatureFunction = {
  DASHBOARD: 1000,
  DASHBOARD_FILTER: 1001,
  INSTANCES: 1002,
  STATUS_CPU: 1003,
  STATUS_MEMORY: 1004,
  STATUS_SERVICE: 1005,
  DISK_SPACE: 1006,
  LAST_ALERTS: 1007,
  SCROLL_BAR: 1008,
  SERVER_INFORMATION: 1100,
  REFRESH_FREQUENCY: 1101,
  CPU: 1102,
  MEMORY: 1103,
  WAITS: 1104,
  SQL_SERVER_METRICS_BATCH_REQUESTS: 1105,
  SQL_SERVER_METRICS_SQLCOMPILATIONS_BATCH_REQUESTS: 1106,
  SQL_SERVER_METRICS_PAGE_SPLITS_BATCH_REQUESTS: 1107,
  SQL_SERVER_METRICS_SQLCOMPILATIONS_SEC: 1108,
  SQL_SERVER_METRICS_PAGE_SPLITS_SEC: 1109,
  SQL_SERVER_METRICS_FULL_SCANS_SEC: 1110,
  SQL_SERVER_METRICS_USER_CONNECTIONS: 1111,
  LATCHES_AND_LOCKS_AVG_LATCH_WAIT: 1112,
  LATCHES_AND_LOCKS_LOCKS_TIMEOUTS_SEC: 1113,
  LATCHES_AND_LOCKS_LOCKS_WAITS_SEC: 1114,
  SQL_PROPERTIES: 1115,
  PERMISSIONS: 1116,
  OS_PROPERTIES: 1117,
  TEMPDB_USAGE_SUMMARY: 1118,
  TEMPDB_SESSION: 1119,
  TEMPDB_LOGIN: 1120,
  TEMPDB_PROGRAM: 1121,
  TEMPDB_DATABASE: 1122,
  BLOCKING_PROCESS_TOP_10_BY_TIME: 1123,
  SQL_USER_PROCESSES_TOP_10_BY_CPU: 1124,
  ERROR_LOG: 1125,
  DATABASES: 1126,
  QUERY_WINDOWS_FOR_QUERY_EXECUTION: 1200,
  WHO_IS_ACTIVE: 1300,
  WHO_IS_ACTIVE_ON_SELECT: 1301,
  WHO2_ON_SELECT: 1302,
  SP_BLITZ: 1400,
  SP_BLITZ_ANALYSIS: 1401,
  SP_BLITZ_BACKUP: 1402,
  SP_BLITZ_FIRST: 1403,
  SP_BLITZ_INDEX: 1404,
  SP_BLITZ_LOCK: 1405,
  SP_BLITZ_QUERY_STORE: 1406,
  SP_BLITZ_WHO: 1407,
  SP_BLITZ_CACHE: 1408,

  ALERTS: 2000,
  MONITORED_SERVERS: 2001,
  SEARCH_SERVER: 2002,
  ACTIONS_SHORTCUT: 2100,
  ALERTS_FILTER_BY_TYPE: 2101,
  ALERTS_LISTING: 2102,
  ALERT_ON_CLICK: 2103,
  ALERTS_CUSTOMIZATION: 2104,
  THRESHOLD_PARAMETERIZATION: 2105,

  ANALYSIS: 3000,
  DATE_AND_INDICATORS_FILTERS: 3001,
  EXPORT: 3002,

  FILTROS_POR_SERVIDOR: 4001,
  SQL_SERVER_AVAILABILITY_TIME: 4002,
  REPORT_DISK_SPACE: 4003,
  DATA_FILES_TOP_5: 4004,
  LOG_FILES_TOP_5: 4005,
  DATABASE_GROWTH_TOP_10: 4006,
  TABLE_GROWTH_TOP_10: 4007,
  DATABASE_FILES_WRITES: 4008,
  DATABASE_FILES_READS: 4009,
  DATABASE_FILE_GROWTH_TOP_10: 4010,
  BACKUPS_EXECUTED_TOP_10: 4011,
  JOBS_RUNNING_TOP_10: 4012,
  JOBS_CHANGED_TOP_10: 4013,
  FAILED_JOBS_TOP_10: 4014,
  SLOW_JOBS_TOP_10: 4015,
  SLOW_QUERIES_TOP_10: 4016,
  SLOW_QUERIES_LAST_10_DAYS: 4017,
  COUNTERS: 4018,
  OPEN_CONNECTIONS: 4019,
  INDEX_FRAGMENTATION_TOP_10: 4020,
  WAITS_STATS_TOP_10: 4021,
  ALERT_WITHOUT_CLEAR: 4022,
  ALERTS_LAST_DAY: 4023,
  LOGIN_FAILED_TOP_10: 4024,
  ERROR_LOG_SQL_TOP_100: 4025,
  DATABASES_WITHOUT_BACKUP: 4026,

  STATES: 5000,
  DASHBOARD_OF_VERSIONS: 5100,
  SERVER_VERSION_INFORMATION: 5101,
  DISK_INFORMATION: 5200,
  BACKUPS: 5300,
  ADDITIONAL_INFORMATION: 5301,
  JOBS: 5400,
  LICENSING_INFORMATION: 5500,

  CONFIGURATION: 6000,
  MANAGE_MONITORED_SERVERS: 6100,
  INSTANCE_DISCOVERY: 6101,
  HOSTS_AND_VMWARE: 6102,

  VESTIGIO: 6103,
  EXTENDED_EVENTS: 6104,
  GROUPS: 6105,
  AUTHENTICATION_SETTINGS: 6200,
  USER_MANAGEMENT: 6201,
  BASIC_MONITOR_CONNECTIONS: 6202,
  DISPLAY_SETTINGS: 6203,
  AUTHENTICATION_TOKENS: 6300,
  DOWNLOAD_POWERSHELL_MODULE: 6301,
  SEE_POWERSHELL_SCRIPT_EXAMPLES: 6302,
  ALERT_SETTINGS: 6400,
  NOTIFICATION_SETTINGS: 6401,
  CUSTOM_METRICS: 6402,
  ALERT_SUPPRESSION: 6403,
  DATA_CONFIGURATION: 6500,
  LICENSING: 6600,
  ABOUT: 6700,
  SETUP_INTEGRATIONS: 6800,
  MANAGE_INTEGRATIONS: 6801,
  SSH_TERMINAL: 6901,
  REMOTE_DESKTOP: 6902,
  INTEGRATION: 7000,
  READ_INTEGRATIONS: 7002,
}

export const TypeGrant = {
  DENY: 0,
  READ: 1,
  EXECUTE: 2,
  WRITE: 3,
  DELETE: 4,
  OWNER: 5,
}

export const Feature = {
  DASHBOARD: 1,
  ALERTS: 2,
  ANALYSIS: 3,
  REPORTS: 4,
  STATES: 5,
  CONFIGURATION: 6,
  INTEGRATION: 7,
}

export function hasFeature(user, feature) {
  const grants = user?.grants
  if (!grants) return false

  const validGrants = grants?.filter((grant) => Number(grant.typeGrant) > 0)

  return validGrants?.some((grant) => grant.idFeature === feature) || false
}

export function hasPermission(user, featureFunction, typeGrant) {
  const grants = user?.grants
  if (!grants) return false

  const grant = grants?.find(
    (grant) => grant.idFeatureFunction === featureFunction
  )

  return Number(grant?.typeGrant ?? 0) >= Number(typeGrant)
}

export function hasPermissions(user, featureFunctions, typeGrant) {
  const grants = user?.grants
  if (!grants) return false

  return featureFunctions.every((featureFunction) => {
    const grant = grants.find(
      (grant) => grant.idFeatureFunction === featureFunction
    )
    return Number(grant?.typeGrant ?? 0) >= Number(typeGrant)
  })
}

export function hasSomePermissions(user, featureFunctions, typeGrant) {
  const grants = user?.grants
  if (!grants) return false

  // eslint-disable-next-line sonarjs/no-identical-functions
  return featureFunctions.some((featureFunction) => {
    const grant = grants.find(
      (grant) => grant.idFeatureFunction === featureFunction
    )
    return Number(grant?.typeGrant ?? 0) >= Number(typeGrant)
  })
}

export function existsSomePermissions(user, featureFunctions) {
  const grants = user?.grants
  if (!grants) return false

  return featureFunctions.some((featureFunction) => {
    const grant = grants.find(
      (grant) => grant.idFeatureFunction === featureFunction
    )
    return Number(grant?.typeGrant ?? 0) > 0
  })
}
