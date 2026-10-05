/**
 * UI 部品の元を、各サンプルの src/shared/ui へ上書きコピーする
 *
 *   npm run sync-ui
 *
 * 各サンプルは試験本番と同じく「1つで完結したアプリ」にしたいので、部品は各アプリにコピーして持つ。
 * 部品を直すときは元を直してからこのスクリプトを実行し、全サンプルへ反映する。
 *
 * 元は2種類ある。アプリの package.json の dependencies に @mui/material があるかで決める。
 *   _shared/ui      … CSS Modules 版の部品（task-manager・inventory など）
 *   _shared/mui-ui  … MUI 版の部品（library・mui-catalog）
 */
import { cpSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { workspaces } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const usesMui = (app) => {
  const { dependencies = {} } = JSON.parse(readFileSync(join(root, app, "package.json"), "utf8"));
  return "@mui/material" in dependencies;
};

for (const app of workspaces) {
  const sourceName = usesMui(app) ? "mui-ui" : "ui";
  const source = join(root, "_shared", sourceName);
  const target = join(root, app, "src", "shared", "ui");
  rmSync(target, { recursive: true, force: true }); // _shared で消した部品が残らないように、一度消してからコピー
  cpSync(source, target, { recursive: true });
  console.log(`synced: _shared/${sourceName} → ${app}/src/shared/ui`);
}
