// Offline Storage Utility using IndexedDB
// Provides local storage for trips and reservations when offline

const DB_NAME = 'magical-holidays-offline';
const DB_VERSION = 1;

interface OfflineDB {
  trips: IDBObjectStore;
  reservations: IDBObjectStore;
  badges: IDBObjectStore;
  metadata: IDBObjectStore;
}

let dbPromise: Promise<IDBDatabase> | null = null;

// Initialize the database
function initDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[OfflineStorage] Failed to open database');
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log('[OfflineStorage] Database opened successfully');
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!db.objectStoreNames.contains('trips')) {
        db.createObjectStore('trips', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('reservations')) {
        const reservationStore = db.createObjectStore('reservations', { keyPath: 'id' });
        reservationStore.createIndex('tripId', 'tripId', { unique: false });
      }
      if (!db.objectStoreNames.contains('badges')) {
        db.createObjectStore('badges', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }

      console.log('[OfflineStorage] Database schema created');
    };
  });

  return dbPromise;
}

// Generic store operations
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`[OfflineStorage] Failed to get all from ${storeName}:`, error);
    return [];
  }
}

async function putInStore<T>(storeName: string, data: T): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`[OfflineStorage] Failed to put in ${storeName}:`, error);
  }
}

async function putManyInStore<T>(storeName: string, items: T[]): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      items.forEach((item) => store.put(item));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error(`[OfflineStorage] Failed to put many in ${storeName}:`, error);
  }
}

async function clearStore(storeName: string): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`[OfflineStorage] Failed to clear ${storeName}:`, error);
  }
}

// Trips
export async function getOfflineTrips<T>(): Promise<T[]> {
  return getAllFromStore<T>('trips');
}

export async function saveTripsOffline<T>(trips: T[]): Promise<void> {
  await clearStore('trips');
  await putManyInStore('trips', trips);
  await setLastSyncTime('trips');
}

// Reservations
export async function getOfflineReservations<T>(): Promise<T[]> {
  return getAllFromStore<T>('reservations');
}

export async function saveReservationsOffline<T>(reservations: T[]): Promise<void> {
  await clearStore('reservations');
  await putManyInStore('reservations', reservations);
  await setLastSyncTime('reservations');
}

// Badges
export async function getOfflineBadges<T>(): Promise<T[]> {
  return getAllFromStore<T>('badges');
}

export async function saveBadgesOffline<T>(badges: T[]): Promise<void> {
  await clearStore('badges');
  await putManyInStore('badges', badges);
  await setLastSyncTime('badges');
}

// Metadata
async function setLastSyncTime(dataType: string): Promise<void> {
  await putInStore('metadata', {
    key: `lastSync_${dataType}`,
    timestamp: Date.now(),
  });
}

export async function getLastSyncTime(dataType: string): Promise<number | null> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('metadata', 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.get(`lastSync_${dataType}`);

      request.onsuccess = () => {
        resolve(request.result?.timestamp || null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    return null;
  }
}

// Check if we're online
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

// Format last sync time for display
export function formatLastSync(timestamp: number | null): string {
  if (!timestamp) return 'Never synced';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return new Date(timestamp).toLocaleDateString();
}
