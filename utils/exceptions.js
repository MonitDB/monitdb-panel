import axios from 'axios'

export const HandleExceptionMessagesTypes = {
  USER_CREDENTIALS: 'USER_CREDENTIALS',
  USER_TOKEN_EXPIRED: 'USER_TOKEN_EXPIRED',
  GENERAL: 'GENERAL',
}

const HandleExceptionMessages = {
  USER_CREDENTIALS: 'User or password invalid',
  USER_TOKEN_EXPIRED: 'Token expired',
  GENERAL: 'An error occurred, please try again later',
}

export const handleException = (error, errorMessage) => {
  if (errorMessage) {
    return HandleExceptionMessages[errorMessage]
  }

  if (axios.isAxiosError(error)) {
    const serverError = error
    const serverResponse = serverError?.response

    if (serverResponse?.status === 401) {
      return 'Unauthorized'
    }

    // BUG-22: a mensagem da API vive em response.DATA.message. Ler
    // response.message devolvia sempre undefined, e todo o painel caia no
    // generico -- o utilizador via "tente mais tarde" quando a API tinha
    // dito exatamente o que estava errado (ex.: quem bloqueia um delete).
    // NestJS manda string ou array (erros de validacao).
    const apiMessage = serverResponse?.data?.message
    if (Array.isArray(apiMessage)) return apiMessage.join(' ')
    return apiMessage || HandleExceptionMessages.GENERAL
  }

  return error?.message || HandleExceptionMessages.GENERAL
}
