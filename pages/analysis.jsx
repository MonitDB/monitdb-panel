import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useMemo } from 'react'

import ExportButton from '~/components/export-button'
import Selector from '~/components/form/selector'
// import Checkbox from '~/components/form/checkbox'
import Link from '~/components/link'
import { PageContent, PageWrapper } from '~/components/page'
// import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'

const AnalysisPage = () => {
  // const {
  //   globalState: { serverEnvironments },
  // } = useGlobal()
  const statusOptions = useMemo(
    () => [
      { value: '15min', label: '15 minutes' },
      { value: '1h', label: '1 hour' },
      { value: '6h', label: '6 hours' },
      { value: '24h', label: '24 hours' },
      { value: '7 dias', label: '7 days' },
      { value: '14 dias', label: '14 days' },
      { value: '28 dias', label: '28 days' },
    ],
    []
  )

  const formik = useFormik({
    initialValues: {
      status: [],
      start_date: '',
      end_date: '',
    },
    onSubmit: (values) => {
      console.log('submit', values) // eslint-disable-line no-console
    },
  })

  return (
    <>
      <NextSeo title="Análises - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent
            removeSidebarMargin={true}
            className="border-b border-gray-light"
          >
            <form
              className="w-full flex flex-col space-y-4 mb-5 xl:space-x-4 xl:space-y-0 xl:flex-row"
              onSubmit={formik.handleSubmit}
            >
              <div className="flex items-center">
                <strong className="block mr-2 whitespace-nowrap text-sm">
                  Intervalo de tempo
                </strong>
                <Selector
                  name="status"
                  value={formik.values.status}
                  options={statusOptions}
                  onChange={(value) => {
                    formik.setFieldValue('status', value)
                  }}
                  className="w-40"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="date"
                  name="start_date"
                  className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.start_date}
                />
                <FontAwesomeIcon icon={faArrowRight} />
                <input
                  type="date"
                  name="end_date"
                  className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.end_date}
                />
              </div>
              <button type="submit" className="btn">
                Comparar
              </button>
            </form>
            <div className="flex items-center">
              <ul
                className="flex items-center border-r border-r-gray pr-4 mr-4
                text-blue text-sm space-x-3"
              >
                <li>
                  <Link href="/analysis/" className="">
                    Last Hour
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Lasts 6hrs
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Últimas 24hrs
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Últimos 7 dias
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Últimos 14 dias
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Hoje
                  </Link>
                </li>
                <li>
                  <Link href="/analysis/" className="">
                    Esta semana
                  </Link>
                </li>
              </ul>
              <ExportButton fileName="ANALISYS" />
            </div>
          </PageContent>

          <PageContent
            removeSidebarMargin={true}
            className="border-b border-gray-light"
          >
            <div className="w-4/5 h-[300px] mb-10 bg-gray-light" />
            <div className="w-full flex flex-col md:flex-row">
              <div className="flex flex-col md:flex-row md:space-x-4 md:w-4/5">
                <div className="w-60">
                  <input
                    type="text"
                    name="metrics"
                    placeholder="Procure por métricas"
                    className="w-full px-4 h-10 mb-2 bg-white leading-10 rounded outline-none text-sm"
                  />
                  <select
                    size="15"
                    className="w-full appearance-none border border-gray-light text-xs"
                    name="metrics_filter"
                  >
                    <optgroup
                      className="category"
                      label=" ▼ Machine metrics"
                      title="Machine metrics"
                    >
                      <option
                        value="[Cluster].[Machine].[Processors].[PercentProcessorTime]"
                        title="Machine: processor time"
                        className=""
                      >
                        &nbsp;&nbsp;&nbsp;Machine: processor time
                      </option>
                      <option
                        value="[Cluster].[Machine].[Processors].[AverageQueueLength]"
                        title="Avg. CPU queue length"
                      >
                        &nbsp;&nbsp;&nbsp;Avg. CPU queue length
                      </option>
                      <option
                        value="[Cluster].[Machine].[Memory].[UsedBytes]"
                        title="Machine: memory used"
                      >
                        &nbsp;&nbsp;&nbsp;Machine: memory used
                      </option>
                      <option
                        value="[Cluster].[Machine].[Memory].[PagesPerSecond]"
                        title="Memory pages/sec"
                        className="selected"
                      >
                        &nbsp;&nbsp;&nbsp;Memory pages/sec
                      </option>
                      <option
                        value="[Cluster].[Machine].[Network].[PercentUtilization]"
                        title="Network utilization"
                      >
                        &nbsp;&nbsp;&nbsp;Network utilization
                      </option>
                      <option
                        value="[Cluster].[Machine].[LogicalDisk].[Capacity].[UsedBytes]"
                        title="Disk used bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Disk used bytes
                      </option>
                      <option
                        value="[Cluster].[Machine].[LogicalDisk].[Capacity].[UsedPercent]"
                        title="Disk used %"
                      >
                        &nbsp;&nbsp;&nbsp;Disk used %
                      </option>
                      <option
                        value="[Cluster].[Machine].[LogicalDisk].[Capacity].[FreeBytes]"
                        title="Disk free bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Disk free bytes
                      </option>
                      <option
                        value="[Cluster].[Machine].[LogicalDisk].[AverageReadTime]"
                        title="Disk avg. read time"
                      >
                        &nbsp;&nbsp;&nbsp;Disk avg. read time
                      </option>
                      <option
                        value="[Cluster].[Machine].[LogicalDisk].[AverageWriteTime]"
                        title="Disk avg. write time"
                      >
                        &nbsp;&nbsp;&nbsp;Disk avg. write time
                      </option>
                      <option
                        value="[Cluster].[Machine].[LogicalDisk].[ReadBytesPerSecond]"
                        title="Disk read bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Disk read bytes/sec
                      </option>
                      <option
                        value="[Cluster].[Machine].[LogicalDisk].[WriteBytesPerSecond]"
                        title="Disk write bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Disk write bytes/sec
                      </option>
                      <option
                        value="[Cluster].[Machine].[LogicalDisk].[TransfersPerSecond]"
                        title="Disk transfers/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Disk transfers/sec
                      </option>
                      <option
                        value="[Cluster].[Machine].[LogicalDisk].[AverageTransferQueueLength]"
                        title="Avg. disk queue length"
                      >
                        &nbsp;&nbsp;&nbsp;Avg. disk queue length
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ SQL Server metrics"
                      title="SQL Server metrics"
                    >
                      <option
                        value="[Cluster].[SqlServer].[GeneralStatistics].[UserConnections]"
                        title="User connections"
                      >
                        &nbsp;&nbsp;&nbsp;User connections
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Process].[PercentProcessorTime]"
                        title="SQL Server: processor time"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: processor time
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[TotalServerMemoryBytes]"
                        title="SQL Server: total memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: total memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[TargetServerMemoryBytes]"
                        title="SQL Server: target memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: target memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[FreeMemoryBytes]"
                        title="SQL Server: free memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: free memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[DynamicSqlCacheMemoryBytes]"
                        title="SQL Server: dynamic SQL cache memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: dynamic SQL cache memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[ConnectionMemoryBytes]"
                        title="SQL Server: connection memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: connection memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[LockMemoryBytes]"
                        title="SQL Server: lock memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: lock memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[OptimizerMemoryBytes]"
                        title="SQL Server: optimizer memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: optimizer memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[DatabaseCacheMemoryBytes]"
                        title="SQL Server: buffer cache memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: buffer cache memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[WorkspaceMemoryBytes]"
                        title="SQL Server: granted workspace memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: granted workspace memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[LogPoolMemoryBytes]"
                        title="SQL Server: log pool memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: log pool memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[ReservedMemoryBytes]"
                        title="SQL Server: reserved server memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: reserved server memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[MaximumWorkspaceMemoryBytes]"
                        title="SQL Server: maximum workspace memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: maximum workspace memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[StolenServerMemoryBytes]"
                        title="SQL Server: stolen server memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: stolen server memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[MemoryManager].[MemoryGrantsPending]"
                        title="Memory grants pending"
                      >
                        &nbsp;&nbsp;&nbsp;Memory grants pending
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[PlanCache].[PlanCacheMemoryBytes]"
                        title="SQL Server: plan cache memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: plan cache memory
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[SqlStatistics].[BatchRequestsPerSecond]"
                        title="Batch requests/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Batch requests/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[SqlStatistics].[CompilationsPerSecond]"
                        title="Compilations/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Compilations/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[SqlStatistics].[CompilationsPerBatchRequest]"
                        title="Compilations/batch"
                      >
                        &nbsp;&nbsp;&nbsp;Compilations/batch
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[SqlStatistics].[RecompilationsPerSecond]"
                        title="Recompilations/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Recompilations/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[BufferManager].[PageLifeExpectancy]"
                        title="Buffer page life expectancy"
                      >
                        &nbsp;&nbsp;&nbsp;Buffer page life expectancy
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[BufferManager].[FreeListStallsPerSec]"
                        title="Free list stalls/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Free list stalls/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[BufferManager].[PageReadsPerSec]"
                        title="Page reads/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Page reads/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[AccessMethods].[FullScansPerSecond]"
                        title="Full scans/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Full scans/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[AccessMethods].[PageSplitsPerSecond]"
                        title="Page splits/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Page splits/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[AccessMethods].[PageSplitsPerBatchRequest]"
                        title="Page splits/batch request"
                      >
                        &nbsp;&nbsp;&nbsp;Page splits/batch request
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Latches].[AverageLatchWaitTime]"
                        title="Latch wait time"
                      >
                        &nbsp;&nbsp;&nbsp;Latch wait time
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Locks].[LockTimeoutsPerSecond]"
                        title="Lock timeouts/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Lock timeouts/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Locks].[LockWaitsPerSecond]"
                        title="Lock waits/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Lock waits/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Locks].[AverageLockWaitTime]"
                        title="Avg. lock wait time"
                      >
                        &nbsp;&nbsp;&nbsp;Avg. lock wait time
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Distribution].[FreeBytes]"
                        title="Tempdb: Free bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb: Free bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Distribution].[InternalBytes]"
                        title="Tempdb: Internal object bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb: Internal object bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Distribution].[UserObjectBytes]"
                        title="Tempdb: User object bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb: User object bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Distribution].[MixedExtentBytes]"
                        title="Tempdb: Mixed extent bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb: Mixed extent bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Distribution].[VersionBytes]"
                        title="Tempdb: Version store bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb: Version store bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Files].[FreeBytes]"
                        title="Tempdb files: Free bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb files: Free bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Files].[InternalBytes]"
                        title="Tempdb files: Internal object bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb files: Internal object bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Files].[UserBytes]"
                        title="Tempdb files: User object bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb files: User object bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Files].[MixedBytes]"
                        title="Tempdb files: Mixed extent bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb files: Mixed extent bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[Files].[VersionStoreBytes]"
                        title="Tempdb files: Version store bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb files: Version store bytes
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[VersionStore].[GenerationRate]"
                        title="Tempdb version store: Generation rate bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb version store: Generation
                        rate...
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[VersionStore].[CleanupRate]"
                        title="Tempdb version store: Cleanup rate bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb version store: Cleanup rate...
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[TempDB].[VersionStore].[LongestRunningTransactionTime]"
                        title="Tempdb version store: Longest running transaction time"
                      >
                        &nbsp;&nbsp;&nbsp;Tempdb version store: Longest
                        running...
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ Database metrics"
                      title="Database metrics"
                    >
                      <option
                        value="[Cluster].[SqlServer].[Database].[Performance].[TransactionsPerSecond]"
                        title="Transactions/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Transactions/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Performance].[ActiveTransactions]"
                        title="Active transactions"
                      >
                        &nbsp;&nbsp;&nbsp;Active transactions
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Storage].[TotalSizeBytes]"
                        title="Total file size"
                      >
                        &nbsp;&nbsp;&nbsp;Total file size
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Storage].[TotalDataSizeBytes]"
                        title="Total data file size"
                      >
                        &nbsp;&nbsp;&nbsp;Total data file size
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Storage].[TotalDataUsedBytes]"
                        title="Total data file used"
                      >
                        &nbsp;&nbsp;&nbsp;Total data file used
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[File].[Size]"
                        title="File size"
                      >
                        &nbsp;&nbsp;&nbsp;File size
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[File].[UsedSize]"
                        title="File used"
                      >
                        &nbsp;&nbsp;&nbsp;File used
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Storage].[TotalLogSizeBytes]"
                        title="Total log file size"
                      >
                        &nbsp;&nbsp;&nbsp;Total log file size
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Storage].[TotalLogUsedBytes]"
                        title="Total log space used"
                      >
                        &nbsp;&nbsp;&nbsp;Total log space used
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Storage].[PercentTotalLogUsed]"
                        title="Log space used %"
                      >
                        &nbsp;&nbsp;&nbsp;Log space used %
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Performance].[LogBytesFlushedPerSecond]"
                        title="Log bytes flushed/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Log bytes flushed/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Performance].[LogFlushesPerSecond]"
                        title="Log flushes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Log flushes/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[Performance].[LogFlushWaitsPerSecond]"
                        title="Log flush waits/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Log flush waits/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[File].[Performance].[AverageStallPerRead]"
                        title="Stalls per read"
                      >
                        &nbsp;&nbsp;&nbsp;Stalls per read
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[File].[Performance].[AverageStallPerWrite]"
                        title="Stalls per write"
                      >
                        &nbsp;&nbsp;&nbsp;Stalls per write
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[File].[Performance].[ReadBytesPerSecond]"
                        title="Read bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Read bytes/sec
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[File].[Performance].[WriteBytesPerSecond]"
                        title="Write bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Write bytes/sec
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ Azure SQL database metrics"
                      title="Azure SQL database metrics"
                    >
                      <option
                        value="[AzureSqlServer].[Database].[Resources].[PercentDtu]"
                        title="DTU percent"
                      >
                        &nbsp;&nbsp;&nbsp;DTU percent
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Resources].[PercentCpu]"
                        title="CPU percent"
                      >
                        &nbsp;&nbsp;&nbsp;CPU percent
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Resources].[PercentIo]"
                        title="Data I/O percent"
                      >
                        &nbsp;&nbsp;&nbsp;Data I/O percent
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Resources].[PercentLogWrite]"
                        title="Log I/O percent"
                      >
                        &nbsp;&nbsp;&nbsp;Log I/O percent
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Resources].[PercentMemoryUsed]"
                        title="Memory used percent"
                      >
                        &nbsp;&nbsp;&nbsp;Memory used percent
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[GeneralStatistics].[UserConnections]"
                        title="User connections"
                      >
                        &nbsp;&nbsp;&nbsp;User connections
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[MemoryManager].[TotalServerMemoryBytes]"
                        title="SQL Server: total memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: total memory
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[MemoryManager].[TargetServerMemoryBytes]"
                        title="SQL Server: target memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: target memory
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[MemoryManager].[FreeMemoryBytes]"
                        title="SQL Server: free memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: free memory
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[PlanCache].[PlanCacheMemoryBytes]"
                        title="SQL Server: plan cache memory"
                      >
                        &nbsp;&nbsp;&nbsp;SQL Server: plan cache memory
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[SqlStatistics].[BatchRequestsPerSecond]"
                        title="Batch requests/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Batch requests/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[SqlStatistics].[CompilationsPerSecond]"
                        title="Compilations/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Compilations/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[SqlStatistics].[CompilationsPerBatchRequest]"
                        title="Compilations/batch"
                      >
                        &nbsp;&nbsp;&nbsp;Compilations/batch
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[SqlStatistics].[RecompilationsPerSecond]"
                        title="Recompilations/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Recompilations/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[BufferManager].[PageLifeExpectancy]"
                        title="Buffer page life expectancy"
                      >
                        &nbsp;&nbsp;&nbsp;Buffer page life expectancy
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[AccessMethods].[FullScansPerSecond]"
                        title="Full scans/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Full scans/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[AccessMethods].[PageSplitsPerSecond]"
                        title="Page splits/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Page splits/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[AccessMethods].[PageSplitsPerBatchRequest]"
                        title="Page splits/batch request"
                      >
                        &nbsp;&nbsp;&nbsp;Page splits/batch request
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Latches].[AverageLatchWaitTime]"
                        title="Latch wait time"
                      >
                        &nbsp;&nbsp;&nbsp;Latch wait time
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Locks].[LockTimeoutsPerSecond]"
                        title="Lock timeouts/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Lock timeouts/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Locks].[LockWaitsPerSecond]"
                        title="Lock waits/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Lock waits/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Locks].[AverageLockWaitTime]"
                        title="Avg. lock wait time"
                      >
                        &nbsp;&nbsp;&nbsp;Avg. lock wait time
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Performance].[TransactionsPerSecond]"
                        title="Transactions/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Transactions/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Performance].[ActiveTransactions]"
                        title="Active transactions"
                      >
                        &nbsp;&nbsp;&nbsp;Active transactions
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Performance].[LogBytesFlushedPerSecond]"
                        title="Log bytes flushed/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Log bytes flushed/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Performance].[LogFlushesPerSecond]"
                        title="Log flushes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Log flushes/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Performance].[LogFlushWaitsPerSecond]"
                        title="Log flush waits/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Log flush waits/sec
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Storage].[DatabaseUsedSizeInBytes]"
                        title="Data size"
                      >
                        &nbsp;&nbsp;&nbsp;Data size
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Resources].[MaxWorkerPercent]"
                        title="Worker thread percent"
                      >
                        &nbsp;&nbsp;&nbsp;Worker thread percent
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[Resources].[MaxSessionPercent]"
                        title="Session percent"
                      >
                        &nbsp;&nbsp;&nbsp;Session percent
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ Elastic pool metrics"
                      title="Elastic pool metrics"
                    >
                      <option
                        value="[AzureSqlServer].[ElasticPool].[Resources].[DtuPercent]"
                        title="DTU percent"
                      >
                        &nbsp;&nbsp;&nbsp;DTU percent
                      </option>
                      <option
                        value="[AzureSqlServer].[ElasticPool].[Resources].[AvgCpuPercent]"
                        title="CPU percent"
                      >
                        &nbsp;&nbsp;&nbsp;CPU percent
                      </option>
                      <option
                        value="[AzureSqlServer].[ElasticPool].[Resources].[AvgDataIoPercent]"
                        title="Data I/O percent"
                      >
                        &nbsp;&nbsp;&nbsp;Data I/O percent
                      </option>
                      <option
                        value="[AzureSqlServer].[ElasticPool].[Resources].[AvgLogWritePercent]"
                        title="Log I/O percent"
                      >
                        &nbsp;&nbsp;&nbsp;Log I/O percent
                      </option>
                      <option
                        value="[AzureSqlServer].[ElasticPool].[Resources].[MaxWorkerPercent]"
                        title="Worker thread percent"
                      >
                        &nbsp;&nbsp;&nbsp;Worker thread percent
                      </option>
                      <option
                        value="[AzureSqlServer].[ElasticPool].[Resources].[MaxSessionPercent]"
                        title="Session percent"
                      >
                        &nbsp;&nbsp;&nbsp;Session percent
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ Availability group metrics"
                      title="Availability group metrics"
                    >
                      <option
                        value="[Cluster].[AvailabilityGroup].[Replica].[Database].[Performance].[LogBytesReceivedPerSecond]"
                        title="Log bytes received/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Log bytes received/sec
                      </option>
                      <option
                        value="[Cluster].[AvailabilityGroup].[Replica].[Database].[Performance].[LogSendQueue]"
                        title="Log send queue"
                      >
                        &nbsp;&nbsp;&nbsp;Log send queue
                      </option>
                      <option
                        value="[Cluster].[AvailabilityGroup].[Replica].[Database].[Performance].[RecoveryQueue]"
                        title="Redo queue"
                      >
                        &nbsp;&nbsp;&nbsp;Redo queue
                      </option>
                      <option
                        value="[Cluster].[AvailabilityGroup].[Replica].[Database].[Performance].[RedoneBytesPerSecond]"
                        title="Redo rate"
                      >
                        &nbsp;&nbsp;&nbsp;Redo rate
                      </option>
                      <option
                        value="[Cluster].[AvailabilityGroup].[Replica].[Database].[Performance].[TransactionDelay]"
                        title="Transaction delay ms/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Transaction delay ms/sec
                      </option>
                      <option
                        value="[Cluster].[AvailabilityGroup].[Replica].[Performance].[FlowControlTime]"
                        title="Flow control time ms/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Flow control time ms/sec
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ VMware metrics"
                      title="VMware metrics"
                    >
                      <option
                        value="[Cluster].[Machine].[VMware].[PercentCpuUsage]"
                        title="Processor time"
                      >
                        &nbsp;&nbsp;&nbsp;Processor time
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[GuestCpuReady]"
                        title="Guest CPU ready time"
                      >
                        &nbsp;&nbsp;&nbsp;Guest CPU ready time
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[GuestCpuSwapWait]"
                        title="Guest CPU swap wait"
                      >
                        &nbsp;&nbsp;&nbsp;Guest CPU swap wait
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[CpuCostop]"
                        title="CPU Co-Stop"
                      >
                        &nbsp;&nbsp;&nbsp;CPU Co-Stop
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[MemorySwapInRateBytesPerSecond]"
                        title="Memory swap in rate bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Memory swap in rate bytes/sec
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[MemorySwapOutRateBytesPerSecond]"
                        title="Memory swap out rate bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Memory swap out rate bytes/sec
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[PercentMemoryUsage]"
                        title="Memory usage"
                      >
                        &nbsp;&nbsp;&nbsp;Memory usage
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[PercentGuestMemoryLatency]"
                        title="Guest Memory latency"
                      >
                        &nbsp;&nbsp;&nbsp;Guest Memory latency
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[GuestMemoryBalloonedBytes]"
                        title="Guest Memory ballooned"
                      >
                        &nbsp;&nbsp;&nbsp;Guest Memory ballooned
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[HostMemoryBalloonedBytes]"
                        title="Host Memory ballooned"
                      >
                        &nbsp;&nbsp;&nbsp;Host Memory ballooned
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[DiskLatency]"
                        title="Disk latency"
                      >
                        &nbsp;&nbsp;&nbsp;Disk latency
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[DiskReadBytes]"
                        title="Disk read bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Disk read bytes/sec
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[DiskWriteBytes]"
                        title="Disk write bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Disk write bytes/sec
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[NetworkUsageBytes]"
                        title="Network usage bytes/sec"
                      >
                        &nbsp;&nbsp;&nbsp;Network usage bytes/sec
                      </option>
                      <option
                        value="[Cluster].[Machine].[VMware].[Processor].[EffectiveVmSpeedMhz]"
                        title="Effective VM speed MHz"
                      >
                        &nbsp;&nbsp;&nbsp;Effective VM speed MHz
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ Cluster metrics"
                      title="Cluster metrics"
                    >
                      <option
                        value="[Cluster].[ClusterSharedVolumes].[UsedBytes]"
                        title="Cluster Shared Volume used bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Cluster Shared Volume used bytes
                      </option>
                      <option
                        value="[Cluster].[ClusterSharedVolumes].[UsedPercent]"
                        title="Cluster Shared Volume used %"
                      >
                        &nbsp;&nbsp;&nbsp;Cluster Shared Volume used %
                      </option>
                      <option
                        value="[Cluster].[ClusterSharedVolumes].[FreeBytes]"
                        title="Cluster Shared Volume free bytes"
                      >
                        &nbsp;&nbsp;&nbsp;Cluster Shared Volume free bytes
                      </option>
                      <option
                        value="[Cluster].[ClusterSharedVolumes].[FreePercent]"
                        title="Cluster Shared Volume free %"
                      >
                        &nbsp;&nbsp;&nbsp;Cluster Shared Volume free %
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ sqlmon-az-bm2.uksouth.cloudapp.azure.com Custom metrics"
                      title="sqlmon-az-bm2.uksouth.cloudapp.azure.com Custom metrics"
                    >
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[sqlmon-az-bm2.uksouth.cloudapp.azure.com:1]"
                        title="AccessControlChanges"
                      >
                        &nbsp;&nbsp;&nbsp;AccessControlChanges
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[sqlmon-az-bm2.uksouth.cloudapp.azure.com:2]"
                        title="ConfigurationItemsChanged"
                      >
                        &nbsp;&nbsp;&nbsp;ConfigurationItemsChanged
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[sqlmon-az-bm2.uksouth.cloudapp.azure.com:3]"
                        title="ObjectsChanged"
                      >
                        &nbsp;&nbsp;&nbsp;ObjectsChanged
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[sqlmon-az-bm2.uksouth.cloudapp.azure.com:4]"
                        title="SuspiciousErrors"
                      >
                        &nbsp;&nbsp;&nbsp;SuspiciousErrors
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ sqlmon-vmw-bm.red-gate.com Custom metrics"
                      title="sqlmon-vmw-bm.red-gate.com Custom metrics"
                    >
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:1]"
                        title="AccessControlChanges"
                      >
                        &nbsp;&nbsp;&nbsp;AccessControlChanges
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:5]"
                        title="Average I/O stalls"
                      >
                        &nbsp;&nbsp;&nbsp;Average I/O stalls
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:2]"
                        title="ConfigurationItemsChanged"
                      >
                        &nbsp;&nbsp;&nbsp;ConfigurationItemsChanged
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:3]"
                        title="ObjectsChanged"
                      >
                        &nbsp;&nbsp;&nbsp;ObjectsChanged
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:4]"
                        title="SuspiciousErrors"
                      >
                        &nbsp;&nbsp;&nbsp;SuspiciousErrors
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ SQLMON-EC2-BM2 Custom metrics"
                      title="SQLMON-EC2-BM2 Custom metrics"
                    >
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[SQLMON-EC2-BM2:2]"
                        title="SqlServerCentral: forum posts/hr"
                      >
                        &nbsp;&nbsp;&nbsp;SqlServerCentral: forum posts/hr
                      </option>
                      <option
                        value="[Cluster].[SqlServer].[Database].[CustomMetric].[SQLMON-EC2-BM2:5]"
                        title="SqlServerCentral: Table size (MB) - wp_posts"
                      >
                        &nbsp;&nbsp;&nbsp;SqlServerCentral: Table size (MB) -...
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ sqlmon-az-bm2.uksouth.cloudapp.azure.com Azure custom metrics"
                      title="sqlmon-az-bm2.uksouth.cloudapp.azure.com Azure custom metrics"
                    >
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[sqlmon-az-bm2.uksouth.cloudapp.azure.com:1]"
                        title="AccessControlChanges"
                      >
                        &nbsp;&nbsp;&nbsp;AccessControlChanges
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[sqlmon-az-bm2.uksouth.cloudapp.azure.com:2]"
                        title="ConfigurationItemsChanged"
                      >
                        &nbsp;&nbsp;&nbsp;ConfigurationItemsChanged
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[sqlmon-az-bm2.uksouth.cloudapp.azure.com:3]"
                        title="ObjectsChanged"
                      >
                        &nbsp;&nbsp;&nbsp;ObjectsChanged
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[sqlmon-az-bm2.uksouth.cloudapp.azure.com:4]"
                        title="SuspiciousErrors"
                      >
                        &nbsp;&nbsp;&nbsp;SuspiciousErrors
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ sqlmon-vmw-bm.red-gate.com Azure custom metrics"
                      title="sqlmon-vmw-bm.red-gate.com Azure custom metrics"
                    >
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:1]"
                        title="AccessControlChanges"
                      >
                        &nbsp;&nbsp;&nbsp;AccessControlChanges
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:5]"
                        title="Average I/O stalls"
                      >
                        &nbsp;&nbsp;&nbsp;Average I/O stalls
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:2]"
                        title="ConfigurationItemsChanged"
                      >
                        &nbsp;&nbsp;&nbsp;ConfigurationItemsChanged
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:3]"
                        title="ObjectsChanged"
                      >
                        &nbsp;&nbsp;&nbsp;ObjectsChanged
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[sqlmon-vmw-bm.red-gate.com:4]"
                        title="SuspiciousErrors"
                      >
                        &nbsp;&nbsp;&nbsp;SuspiciousErrors
                      </option>
                    </optgroup>
                    <optgroup
                      className="category"
                      label=" ▼ SQLMON-EC2-BM2 Azure custom metrics"
                      title="SQLMON-EC2-BM2 Azure custom metrics"
                    >
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[SQLMON-EC2-BM2:2]"
                        title="SqlServerCentral: forum posts/hr"
                      >
                        &nbsp;&nbsp;&nbsp;SqlServerCentral: forum posts/hr
                      </option>
                      <option
                        value="[AzureSqlServer].[Database].[CustomMetric].[SQLMON-EC2-BM2:5]"
                        title="SqlServerCentral: Table size (MB) - wp_posts"
                      >
                        &nbsp;&nbsp;&nbsp;SqlServerCentral: Table size (MB) -...
                      </option>
                    </optgroup>
                  </select>
                </div>
                <div className="w-60">
                  <input
                    type="text"
                    name="cluster"
                    placeholder="Procurar por cluster"
                    className="w-full px-4 h-10 mb-2 bg-white leading-10 rounded outline-none text-sm"
                  />
                  <select
                    size="15"
                    className="w-full appearance-none border border-gray-light text-xs"
                    name="cluster_filter"
                  >
                    <option
                      value="r1,4:base,s36:4c07d85a-92f3-4f0e-b040-0121aab069ab,7:Cluster,1,4:Name,s15:azurevm-sqmtest,"
                      title="azurevm-sqmtest"
                    >
                      {' '}
                      azurevm-sqmtest{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s6:sm-dc2,"
                      title="sm-dc2"
                    >
                      {' '}
                      sm-dc2{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s7:sqm-dc1,"
                      title="sqm-dc1"
                    >
                      {' '}
                      sqm-dc1{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s14:sqm-sqlmonitor,"
                      title="sqm-sqlmonitor"
                    >
                      {' '}
                      sqm-sqlmonitor{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:260ca7e9-c6fa-4cc5-8de2-e05e68114e71,7:Cluster,1,4:Name,s22:sscdbcluster.ssc.local,"
                      title="sscdbcluster.ssc.local"
                    >
                      {' '}
                      sscdbcluster.ssc.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s28:ssc-web-staging.smdemo.local,"
                      title="ssc-web-staging.smdemo.local"
                    >
                      {' '}
                      ssc-web-staging.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s22:staging01.smdemo.local,"
                      title="staging01.smdemo.local"
                    >
                      {' '}
                      staging01.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s22:staging02.smdemo.local,"
                      title="staging02.smdemo.local"
                      selected="selected"
                      className="selected"
                    >
                      {' '}
                      staging02.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s19:test01.smdemo.local,"
                      title="test01.smdemo.local"
                    >
                      {' '}
                      test01.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s19:test02.smdemo.local,"
                      title="test02.smdemo.local"
                    >
                      {' '}
                      test02.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s23:workload01.smdemo.local,"
                      title="workload01.smdemo.local"
                    >
                      {' '}
                      workload01.smdemo.local{' '}
                    </option>
                    <option
                      value="r1,4:base,s36:421db8b6-1db9-486b-b8a8-02812f55648b,7:Cluster,1,4:Name,s23:workload02.smdemo.local,"
                      title="workload02.smdemo.local"
                    >
                      {' '}
                      workload02.smdemo.local{' '}
                    </option>
                  </select>
                </div>
              </div>
              <div className="w-full md:w-1/5"></div>
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AnalysisPage
