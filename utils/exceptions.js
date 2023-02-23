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

    return serverResponse?.message || HandleExceptionMessages.GENERAL
  }

  return error?.message || HandleExceptionMessages.GENERAL
}
