import axios from 'axios'

export const HandleExceptionMessagesTypes = {
  USER_CREDENTIALS: 'USER_CREDENTIALS',
  USER_TOKEN_EXPIRED: 'USER_TOKEN_EXPIRED',
  GENERAL: 'GENERAL',
}

const HandleExceptionMessages = {
  USER_CREDENTIALS: 'Usuário ou senha inválidos',
  USER_TOKEN_EXPIRED: 'Seu login expirou',
  GENERAL: 'Algum erro aconteceu, favor tentar novamente em alguns instantes',
}

export const handleException = (error, errorMessage) => {
  if (errorMessage) {
    return HandleExceptionMessages[errorMessage]
  }

  if (axios.isAxiosError(error)) {
    const serverError = error
    const serverResponse = serverError?.response

    if (serverResponse?.status === 401) {
      return 'Acesso não autorizado.'
    }

    return serverResponse?.data || HandleExceptionMessages.GENERAL
  }

  return error?.message || HandleExceptionMessages.GENERAL
}
