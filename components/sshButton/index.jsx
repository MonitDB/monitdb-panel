import { default as Image } from 'next/image'
import { styled } from 'styled-components'

import sshImage from '~/icons/ssh.png'

const SshButon = () => {
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

  return (
    <StyledButton>
      <Image src={sshImage} alt="Imagem" height={32} width={32} />
    </StyledButton>
  )
}

export default SshButon
