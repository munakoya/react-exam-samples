/**
 * localStorage に保存するときのキー（名前）
 *
 * 同じブラウザ・同じ URL（localhost:5173）で別のアプリを動かすと、
 * キーが同じだとデータが混ざる。アプリ名を先頭に付けて区別する。
 *
 *   storageKey("transactions") → "household-budget:transactions"
 *
 * 保存されている中身は、DevTools の Application タブ → Local Storage で確認・削除できる。
 */

const STORAGE_PREFIX = "household-budget";

export const storageKey = (name: string) => `${STORAGE_PREFIX}:${name}`;
