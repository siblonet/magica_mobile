import * as SQLite from 'expo-sqlite';

export const Magica = {
  getMagica: () => SQLite.openDatabase("magica.db"),
};