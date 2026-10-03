/**
 * _shared/ui（UI 部品の元）を、各サンプルの src/shared/ui へ上書きコピーする
 *
 *   npm run sync-ui
 *
 * 各サンプルは試験本番と同じく「1つで完結したアプリ」にしたいので、部品は各アプリにコピーして持つ。
 * 部品を直すときは _shared/ui を直してからこのスクリプトを実行し、全サンプルへ反映する。
 */
import { cpSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "_shared", "ui");
const { workspaces } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

for (const app of workspaces) {
  const target = join(root, app, "src", "shared", "ui");
  rmSync(target, { recursive: true, force: true }); // _shared で消した部品が残らないように、一度消してからコピー
  cpSync(source, target, { recursive: true });
  console.log(`synced: ${app}/src/shared/ui`);
}
