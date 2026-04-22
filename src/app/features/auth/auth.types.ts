/**
 * API types
 */

type RefreshKeyResponse = {
  expiration: string;
  channels: KeyChannel[];
};

type SubmitKeyResponse = {
  secret: string;
};

/**
 * Entity types
 */

interface KeyEntity {
  expiration: string;
  channels: string;
}

/**
 * Util types
 */

enum KeyChannel {
  EMAIL = 0,
  TELEGRAM = 1,
  SMS = 2
}

namespace KeyChannel {
  export function name(keyChannel: KeyChannel): string {
    return ['Email', 'Telegram', 'SMS'][keyChannel];
  }
}

export {KeyChannel, RefreshKeyResponse, SubmitKeyResponse, KeyEntity};
