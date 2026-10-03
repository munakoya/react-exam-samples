import { useState } from "react";
import { Stack, Switch } from "@/shared/ui";

// 押した瞬間に反映される設定に使う。checked と event.target.checked で扱う
export default function SwitchBasic() {
  const [settings, setSettings] = useState({ email: true, push: false });

  return (
    <Stack gap={3}>
      <Switch
        label="メールで通知する"
        checked={settings.email}
        onChange={(event) => setSettings((prev) => ({ ...prev, email: event.target.checked }))}
      />
      <Switch
        label="プッシュ通知を受け取る"
        checked={settings.push}
        onChange={(event) => setSettings((prev) => ({ ...prev, push: event.target.checked }))}
      />
      <Switch label="使えない設定" disabled />
    </Stack>
  );
}
