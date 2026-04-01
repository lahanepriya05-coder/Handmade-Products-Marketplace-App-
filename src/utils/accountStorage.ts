export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  label: string;
  isDefault: boolean;
}

export interface AccountSettings {
  orderUpdates: boolean;
  shippingUpdates: boolean;
  marketingEmails: boolean;
  smsAlerts: boolean;
  preferredLanguage: string;
  preferredCurrency: string;
}

const ADDRESSES_KEY = "kinara_account_addresses";
const SETTINGS_KEY = "kinara_account_settings";

const defaultSettings: AccountSettings = {
  orderUpdates: true,
  shippingUpdates: true,
  marketingEmails: false,
  smsAlerts: false,
  preferredLanguage: "English",
  preferredCurrency: "INR",
};

const readRecord = <T,>(key: string): Record<string, T> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (error) {
    console.error(`Failed to read ${key}`, error);
    return {};
  }
};

const writeRecord = <T,>(key: string, value: Record<string, T>) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
};

export const getSavedAddresses = (userId?: string) => {
  if (!userId) {
    return [] as SavedAddress[];
  }

  const record = readRecord<SavedAddress[]>(ADDRESSES_KEY);
  return Array.isArray(record[userId]) ? record[userId] : [];
};

export const saveAddresses = (userId: string, addresses: SavedAddress[]) => {
  const record = readRecord<SavedAddress[]>(ADDRESSES_KEY);
  record[userId] = addresses;
  writeRecord(ADDRESSES_KEY, record);
};

export const getAccountSettings = (userId?: string): AccountSettings => {
  if (!userId) {
    return defaultSettings;
  }

  const record = readRecord<AccountSettings>(SETTINGS_KEY);
  return {
    ...defaultSettings,
    ...(record[userId] || {}),
  };
};

export const saveAccountSettings = (userId: string, settings: AccountSettings) => {
  const record = readRecord<AccountSettings>(SETTINGS_KEY);
  record[userId] = settings;
  writeRecord(SETTINGS_KEY, record);
};
