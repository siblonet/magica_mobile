import * as SQLite from 'expo-sqlite';

export const Magica = {
  getMagica: async () => {
    try {
      const db = await SQLite.openDatabaseAsync("magica.db");
      return db;
    } catch (error) {
      console.error("Error opening database:", error);
      throw error;
    }
  },
};
