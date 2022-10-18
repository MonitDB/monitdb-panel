import React, { Suspense } from 'react'

import Loading from '~/components/loading'
import Db2ServerIcon from '~/icons/sql-db2.svg'
import MariaDbServerIcon from '~/icons/sql-mariadb.svg'
import MongoDbServerIcon from '~/icons/sql-mongodb.svg'
import MySQLServerIcon from '~/icons/sql-mysql.svg'
import OracleServerIcon from '~/icons/sql-oracle.svg'
import PostgresServerIcon from '~/icons/sql-postgres.svg'
import SingleStoreServerIcon from '~/icons/sql-singlestore.svg'
import SqlServerIcon from '~/icons/sql-sql-server.svg'
import { slugify } from '~/utils/global'

export const Icons = {
  db2: Db2ServerIcon,
  mariadb: MariaDbServerIcon,
  mongodb: MongoDbServerIcon,
  mysql: MySQLServerIcon,
  oracle: OracleServerIcon,
  postgres: PostgresServerIcon,
  'single-store': SingleStoreServerIcon,
  'sql-server': SqlServerIcon,
}

const DatabaseIcons = ({ name = '', ...properties }) => {
  const Icon = Icons[slugify(name)]

  if (!name || !Icon) {
    return ''
  }

  return (
    <Suspense fallback={<Loading />}>
      <Icon {...properties} />
    </Suspense>
  )
}

export default DatabaseIcons
