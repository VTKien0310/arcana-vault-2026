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

interface ItemEntity {
  // Expect the fields type-hinted as undefined to be undefined for directories. Yes, Supabase's directory has an undefined for id.
  id?: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  last_accessed_at?: string;
  size?: number;
  mime_type?: string;
}

export {SignedUploadUrlResponse, SignedUploadUrlEntity, ItemEntity};
