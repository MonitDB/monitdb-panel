import { default as Image } from 'next/image'
import { styled } from 'styled-components'

import suggestions from '~/icons/suggestions.png'

const SuggestionButton = ({ onClick }) => {
  const StyledButton = styled.button`
    border: 1px solid #f1f1f1;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
    width: 64px;
    height: 64px;
    margin-left: auto;

    &:active {
      background-color: #f1f1f1; // Cor de fundo ao ser clicado
    }
  `

  return (
    <StyledButton>
      <Image src={suggestions} alt="Suggestions" onClick={onClick} />
    </StyledButton>
  )
}

export default SuggestionButton
