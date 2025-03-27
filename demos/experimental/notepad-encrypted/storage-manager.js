// < ========================================================
// < Exported StorageManager Class
// < ========================================================

export class StorageManager {

    static notesKey = 'notepad-encrypyted-2025-03-27-notes';
    static settingsKey = 'notepad-encrypyted-2025-03-27-settings';

    static notes = {

    }

    static settings = {
        highlightedUUID: null,
        openUUIDS: []
    }

    static _save(storageKey, storageObject) {
        let storageString = JSON.stringify(storageObject);
        localStorage.setItem(storageKey, storageString);
    }

    static _load(storageKey) {
        let storageString = localStorage.getItem(storageKey);
        return storageString ? JSON.parse(storageString) : {}
    }

    static load() {

        // > Load saved settings object, and merge with default
        let settings = StorageManager._load(StorageManager.settingsKey);
        Object.assign(StorageManager.settings, settings);

        // > Load saved notes object, and merge with default
        let notes = StorageManager._load(StorageManager.notesKey);
        Object.assign(StorageManager.notes, notes);

    }

    static save() {

        // > Save settings object to localStorage
        StorageManager._save(StorageManager.settingsKey, StorageManager.settings);

        // > Save notes object to localStorage
        StorageManager._save(StorageManager.notesKey, StorageManager.notes);
        
    }

}