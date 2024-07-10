import { useRouteError } from 'react-router-dom'

interface HttpError extends Error {
  status?: number
  statusText?: string
}

const ErrorPage = () => {
  const error = useRouteError() as Error | HttpError
  console.error(error)

  const getErrorMessage = (error: Error | HttpError): string => {
    if ('statusText' in error && error.statusText) {
      return error.statusText
    } else if (error.message) {
      return error.message
    }
    return 'An unknown error occurred'
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{getErrorMessage(error)}</i>
      </p>
    </div>
  )
}

export default ErrorPage
