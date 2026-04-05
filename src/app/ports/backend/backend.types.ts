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
