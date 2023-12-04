import { saveAs } from 'file-saver'
import { default as Image } from 'next/image'
import { styled } from 'styled-components'

import rdpImage from '~/icons/rdp.png'

const RdpButton = ({ address, port, serverName }) => {
  const StyledButton = styled.button`
    border: 1px solid #0000001f;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

    &:active {
      background-color: #e0e0e0; // Cor de fundo ao ser clicado
    }
  `

  const RDPScript = `screen mode id:i:1
use multimon:i:0
desktopwidth:i:1366
desktopheight:i:768
session bpp:i:32
winposstr:s:0,1,0,0,1366,728
compression:i:1
smart sizing:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
displayconnectionbar:i:1
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:${address}:${3389}
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectwebauthn:i:1
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
gatewaybrokeringtype:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
enablerdsaadauth:i:0`

  const handleExport = () => {
    const rdpBuffer = Buffer.from(RDPScript)

    const blob = new Blob([rdpBuffer], { type: 'application/octet-stream' })

    saveAs(
      new Blob([blob], {}),
      `${serverName ?? 'MONIT_DB_FILE'}_${Date.now()}.rdp`
    )
  }

  return (
    <StyledButton onClick={handleExport}>
      <Image src={rdpImage} alt="Imagem" height={32} width={32} />
    </StyledButton>
  )
}

export default RdpButton
