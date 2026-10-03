/**
 * tokens.css の中身（文字列）から、CSS 変数の一覧を取り出す
 *
 *   "  --color-primary: #4f46e5; /* メイン *\/"
 *     → { name: "--color-primary", value: "#4f46e5", comment: "メイン" }
 *
 * tokens.css を書き換えると、トークンのページにもそのまま反映される。
 */

export type Token = {
  name: string;
  value: string;
  comment?: string;
};

// 「--名前: 値;」と、その後ろの「/* コメント */」（あれば）に一致する正規表現
const TOKEN_PATTERN = /(--[\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?/g;

export const parseTokens = (css: string): Token[] =>
  [...css.matchAll(TOKEN_PATTERN)].map(([, name, value, comment]) => ({
    name,
    value: value.trim(),
    comment,
  }));

/** 名前の先頭（"--color-" など）で絞り込む */
export const tokensWithPrefix = (tokens: Token[], prefix: string) =>
  tokens.filter((token) => token.name.startsWith(prefix));
