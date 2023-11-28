/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import Grid from '~/components/grid/grid'
import Loading from '~/components/loading/loading'
import { PageContent } from '~/components/page'
import { useGlobal } from '~/hooks/index'
import Layout from '~/layouts/default'
import { updateServerNewVersion } from '~/services/servers'
import { formatServer } from '~/utils/server'

export default function UpdateNewVersion() {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()
  const [formattedServers, setFormattedServers] = useState([])

  const [selectedServers, setSelectedServers] = useState([])
  const [initialUpload, setInitialUpload] = useState(false)
  const [, setLoadingServers] = useState({})
  const [serverUploadResult, setServerUploadResult] = useState({})
  const [file, setFile] = useState(null)

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

  const uploadFileToServer = async (serverId, formData) => {
    return updateServerNewVersion(serverId, formData)
  }
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

    if (selectedFile && selectedFile.name.endsWith('.sql')) {
      setFile(selectedFile)
    } else {
      // Reset the file state if an invalid file is selected
      setFile()
    }
  }

  const uploadSequentially = async () => {
    const reader = new FileReader()

    reader.readAsArrayBuffer(file, 'utf8')

    reader.addEventListener('load', async (event) => {
      const file = event.target.result

      const formData = new FormData()
      formData.append('file', new Blob([file]))

      for (const serverId of selectedServers) {
        try {
          setInitialUpload(true)
          setLoadingServers((previousLoadingServers) => [
            ...previousLoadingServers,
            serverId,
          ])

          const { data: result } = await uploadFileToServer(serverId, formData)

          if (result.error)
            setServerUploadResult((previousResults) => ({
              ...previousResults,
              [serverId]: { success: false, loaded: true },
            }))
          else
            setServerUploadResult((previousResults) => ({
              ...previousResults,
              [serverId]: { success: true, loaded: true },
            }))
        } catch {
          setServerUploadResult((previousResults) => ({
            ...previousResults,
            [serverId]: { success: false, loaded: true },
          }))
        } finally {
          setLoadingServers((previousLoadingServers) =>
            previousLoadingServers.filter((id) => id !== serverId)
          )
        }
      }
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (selectedServers.length === 0 || !file) {
      alert('Please select at least one server and choose a valid .sql file.')
      return
    }

    setLoadingServers(selectedServers)
    setServerUploadResult({})
    await uploadSequentially()
  }
  const handleRemoveFile = () => {
    setFile()
  }

  return (
    <>
      <NextSeo title="Components - Configurations - MonitDB" />
      <Layout>
        <PageContent className="lg:pt-20">
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
                  <input
                    id="fileInput"
                    type="file"
                    accept=".sql"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center w-full space-between">
                <span className="mr-2">{file.name}</span>
                <div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="bg-white text-black border border-gray-300 px-4 py-2 rounded cursor-pointer mr-5 ml-10"
                  >
                    Remove
                  </button>
                  <button
                    type="submit"
                    disabled={selectedServers.length === 0 || !file}
                    className="bg-blue text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="w-full">
            <h2 className="mb-10 heading-md">Choose the servers to Run</h2>
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
                      <p>{serverName}</p>
                      {selectedServers.includes(id) ? (
                        // Se o servidor está selecionado
                        initialUpload && serverUploadResult[id]?.loaded ? (
                          <>
                            <h4 className="!mb-2 font-bold text-base">
                              {serverUploadResult[id]?.success &&
                              serverUploadResult[id]?.loaded
                                ? 'Upload Successful'
                                : 'Upload Failed'}
                            </h4>
                            {serverUploadResult[id]?.success ? (
                              <p>Upload to server {id} was successful!</p>
                            ) : (
                              <p>Error to Run</p>
                            )}
                          </>
                        ) : (
                          <p>Waiting...</p>
                        )
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

          {formattedServers.length > 0 && initialUpload > 0 && (
            <div className="w-full" style={{ marginTop: '20px' }}>
              {/* <div className="p-4 border-t-2 border-t-gray bg-gray-light bg-opacity-25  ">
                <div className="w-full mb-4">
                  <h4 className="!mb-2 font-bold text-base">Log results</h4>
                  <pre className=" whitespace-pre-wrap ">aa</pre>
                </div>
              </div>{' '} */}
            </div>
          )}
        </PageContent>
      </Layout>
    </>
  )
}
