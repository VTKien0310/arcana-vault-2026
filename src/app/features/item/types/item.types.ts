/**
 * API types
 */

type SignedUploadUrlResponse = {
  url: string,
  path: string
  token: string
};

/**
 * Entity types
 */

interface SignedUploadUrlEntity {
  path: string
  token: string
}

export {SignedUploadUrlResponse, SignedUploadUrlEntity};
