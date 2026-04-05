export type RefreshKeyResponse = {
  expiration: string;
  channels: KeyChannel[];
};

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

export {KeyChannel};
