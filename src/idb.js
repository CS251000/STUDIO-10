import { openDB } from 'idb';

export const getDB = async () => {
    return openDB('formCacheDB', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('formFields')) {
                db.createObjectStore('formFields', { keyPath: 'fieldName' });
            }
        },
    });
};

// Save field value as an array
export const saveField = async (fieldName, value) => {
    const db = await getDB();
    const existingField = await db.get('formFields', fieldName);

    let updatedValue = [];
    if (existingField) {
        updatedValue = [...new Set([...existingField.value, value.trim()])];
    } else {
        updatedValue = [value.trim()];
    }

    await db.put('formFields', { fieldName, value: updatedValue });
};

// Fetch all fields with values as arrays
export const getFields = async () => {
    const db = await getDB();
    return await db.getAll('formFields');
};

export const getSuggestions = async (fieldName, query) => {
    const db = await getDB();
    const field = await db.get('formFields', fieldName);

    if (field && query) {
        return field.value.filter((item) =>
            item.toLowerCase().startsWith(query.toLowerCase())
        );
    }
    return [];
};
