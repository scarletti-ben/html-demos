// < ========================================================
// < Exported IndexedDB Functions
// < ========================================================

/**
 * Open a database given string name, or create it
 * - If the database exists, the promise returns it
 * - Opens the most recent version of the database
 * - Or creates database version 1 with `default` store
 * @param {string} databaseName - Database name
 * @returns {Promise<IDBDatabase>}
 */
export function openDB(databaseName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName);
        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains('default')) {
                database.createObjectStore('default');
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Store a key-value pair in a given store of a database
 * @param {IDBDatabase} database - The opened database instance
 * @param {string} key - The key to store the value at
 * @param {string} [storeName='default'] - The name of the store
 * @param {any} value - The value to store
 * @returns {Promise<void>}
 */
export function storeInDB(database, key, value, storeName = 'default') {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        store.put(value, key);
        transaction.oncomplete = () => {
            database.close();
            resolve();
        };
        transaction.onerror = () => reject(transaction.error);
    });
}

/**
 * Retrieve a value by key from a given store in the database
 * @param {IDBDatabase} database - The opened database instance
 * @param {string} key - The key to retrieve the value for
 * @param {string} [storeName='default'] - The name of the object store
 * @returns {Promise<any>} - Resolves with the retrieved value or undefined if not found
 */
export function getFromDB(database, key, storeName = 'default') {
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}