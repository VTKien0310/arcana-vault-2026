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
  // Expect the fields type-hinted as undefined to be undefined for directory (that is what powers "collection" under the hood).
  // Yes, Supabase's directory has an undefined for id.
  id?: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  last_accessed_at?: string;
  size?: number;
  mime_type?: string;
}

interface SignedViewUrlEntity {
  url: string;
}

/**
 * Util types
 */

enum ItemType {
  COLLECTION = 0,
  VIDEO = 1,
  IMAGE = 2
}

type ItemViewInfo = {
  item: ItemEntity;
  itemType: ItemType;
}

export {SignedUploadUrlResponse, SignedUploadUrlEntity, ItemEntity, ItemType, ItemViewInfo, SignedViewUrlEntity};
