/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, Input } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import Grid from '~/components/grid/grid'
import Loading from '~/components/loading/loading'
import { PageContent } from '~/components/page'
import TerminalWindow from '~/components/terminal'
import { useGlobal } from '~/hooks/index'
import Layout from '~/layouts/default'
import { updateServerNewVersion } from '~/services/servers'
import { formatServer } from '~/utils/server'

const uploadFileToServer = async (serverId, formData) => {
  return updateServerNewVersion(serverId, formData)
}

export default function UpdateNewVersion() {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const [formattedServers, setFormattedServers] = useState([])

  const [selectedServers, setSelectedServers] = useState([])

  const [serverUploadResult, setServerUploadResult] = useState({})
  const [file, setFile] = useState()
  const [terminalOutput, setTerminalOutput] = useState([])

  useEffect(() => {
    if (servers.length === 0 || serverTypes.length === 0) {
      return
    }

    setFormattedServers(
      [...servers].map((server) => ({
        ...formatServer(server, { serverTypes }),
        active: true,
      }))
    )
  }, [servers, serverTypes])

  const handleServerClick = (id) => {
    setSelectedServers((previousSelectedServers) => {
      const index = previousSelectedServers.indexOf(id)
      if (index === -1) {
        return [...previousSelectedServers, id]
      } else {
        const newSelectedServers = [...previousSelectedServers]
        newSelectedServers.splice(index, 1)
        return newSelectedServers
      }
    })
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]

    setTerminalOutput((state) => [
      ...state,
      `File "${selectedFile.name}" added!`,
      `Size ${selectedFile.size} B`,
    ])
    setFile(selectedFile)
  }

  const uploadSequentially = async () => {
    const reader = new FileReader()

    reader.readAsArrayBuffer(file, 'utf8')

    reader.addEventListener('load', async (event) => {
      const file = event.target.result

      const formData = new FormData()
      formData.append('file', new Blob([file]))

      for (const serverId of selectedServers) {
        setServerUploadResult((previousResults) => ({
          ...previousResults,
          [serverId]: { status: 'waiting' },
        }))
      }

      for (const serverId of selectedServers) {
        try {
          const server = formattedServers.find((s) => s.id === serverId)
          setTerminalOutput((state) => [
            ...state,
            `Uploading File to ${server.serverName}...`,
          ])
          setServerUploadResult((previousResults) => ({
            ...previousResults,
            [serverId]: { status: 'loading' },
          }))

          const { data: result } = await uploadFileToServer(serverId, formData)

          if (result.error) {
            setTerminalOutput((state) => [
              ...state,
              `Failed to upload file to ${server.serverName}. Error: ${result.output}`,
            ])
            setServerUploadResult((previousResults) => ({
              ...previousResults,
              [serverId]: { status: 'error' },
            }))
          } else {
            setTerminalOutput((state) => [
              ...state,
              `File uploaded to ${
                server.serverName
              }.\n\nServer response: ${JSON.stringify(
                result.output,
                undefined,
                2
              )}\n \nQuery runned in ${Math.floor(result.time)} ms`,
            ])
            setServerUploadResult((previousResults) => ({
              ...previousResults,
              [serverId]: { status: 'success' },
            }))
          }
        } catch (error) {
          setTerminalOutput((state) => [
            ...state,
            `Error uploading file to server ${serverId}. Details: ${error.message}`,
          ])
          setServerUploadResult((previousResults) => ({
            ...previousResults,
            [serverId]: { status: 'error' },
          }))
        }
      }
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (selectedServers.length === 0) {
      setTerminalOutput((state) => [
        ...state,
        'Please select at least one server and choose a valid .sql file.',
      ])

      return
    }

    setServerUploadResult({})
    await uploadSequentially()
  }
  const handleRemoveFile = () => {
    setTerminalOutput((state) => [...state, 'File removed!'])

    setFile()
  }

  return (
    <>
      <NextSeo title="Update New Version - Configurations - MonitDB" />
      <Layout>
        <PageContent className="lg:pt-20">
          <div className="mb-10">
            <h2>
              <strong className="">Choose the servers to Run</strong>
            </h2>
            <span className="opacity-75">
              Upload a file and select the servers to update.
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="relative w-full mx-auto mb-10 lg:w-2/3 lg:mb-20"
          >
            {!file ? (
              <div className="relative">
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer bg-white border border-gray-300 py-2 px-4 rounded-md shadow-md flex items-center"
                >
                  <span className="mr-2">Upload SQL File</span>
                  <Input
                    id="fileInput"
                    type="file"
                    accept=".sql"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="flex justify-between">
                <div className="bg-white w-[50%] p-2 rounded">
                  <span className="mr-2">{file.name}</span>
                </div>
                <div>
                  <Button danger onClick={handleRemoveFile}>
                    Remove
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    className="ml-2"
                  >
                    Upload
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="w-full">
            {servers.length === 0 && <Loading />}
            <Grid>
              {formattedServers.map(({ id, serverName, active }) =>
                active ? (
                  <div
                    key={`alerts-server-${id}`}
                    onClick={() => handleServerClick(id)}
                    className={`group relative col-span-2 transition-all duration-200 md:col-span-3 lg:col-span-4 lg:hover:!opacity-100 xl:col-span-3 ${
                      selectedServers.includes(id)
                        ? 'bg-blue text-white'
                        : 'bg-white text-black'
                    } cursor-pointer rounded p-4`}
                  >
                    <div className="w-full mb-4">
                      <h4 className="!mb-2 font-bold text-base">
                        {serverName}
                      </h4>
                      {selectedServers.includes(id) ? (
                        <p>
                          {serverUploadResult[id]?.status === 'waiting' &&
                            'Waiting...'}
                          {serverUploadResult[id]?.status === 'loading' &&
                            'Uploading...'}
                          {serverUploadResult[id]?.status === 'success' &&
                            'The Database was successfull updated!'}
                          {serverUploadResult[id]?.status === 'error' &&
                            'Error updating the Database!'}
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
            </Grid>
          </div>

          {formattedServers.length > 0 > 0 && (
            <div className="mt-10">
              <TerminalWindow
                height={'400px'}
                width={'100%'}
                buttons={[
                  {
                    onClick: () => {
                      setTerminalOutput([])
                    },
                    tooltip: 'Clear terminal',
                  },
                ]}
              >
                {terminalOutput.map((value, index) => (
                  <p key={index}>{value}</p>
                ))}
              </TerminalWindow>
            </div>
          )}
        </PageContent>
      </Layout>
    </>
  )
}
