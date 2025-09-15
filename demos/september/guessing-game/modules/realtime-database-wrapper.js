// < ======================================================
// < Imports
// < ======================================================

import {
    getDatabase,
    ref,
    get,
    set,
    remove,
    push,
    onValue
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js';

// < ======================================================
// < Functions
// < ======================================================

async function clearDatabase(database) {
    try {
        const rootRef = ref(database, '/');
        await remove(rootRef);
        console.log('Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
}

// > ======================================================
// > Exports
// > ======================================================

export {
    getDatabase,
    clearDatabase,
    get,
    set,
    ref,
    push,
    remove,
    onValue
}