type BackendApiErrorContent = {
  error: {
    code: string;
    message: string;
    path: string;
  };
}

type BackendApiResponse<T> = {
  ok: boolean;
  content: T | BackendApiErrorContent;
}

/**
 * Checks if the content is a BackendApiErrorContent.
 * This method is mainly used for type hinting when process success response.
 * Since API response can be either success or error, this method helps to mark the response as not an error when processing success response.
 *
 * @param content
 */
function isBackendApiErrorContent(content: unknown): content is BackendApiErrorContent {
  if (typeof content !== 'object') return false;

  const errorContent = content as BackendApiErrorContent;

  return errorContent.error !== undefined
    && errorContent.error.code !== undefined
    && errorContent.error.message !== undefined
    && errorContent.error.path !== undefined;
}

export {
  BackendApiResponse,
  BackendApiErrorContent,
  isBackendApiErrorContent,
};
