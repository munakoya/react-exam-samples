import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const tabs = [
  { value: "profile", label: "プロフィール", content: "名前・自己紹介を表示する" },
  { value: "orders", label: "注文履歴", content: "これまでの注文を一覧で表示する" },
  { value: "settings", label: "設定", content: "通知やパスワードを変更する" },
];

// Tabs の value と、各 Tab の value が一致したタブが選ばれた状態になる。
// 中身（パネル）は Tabs とは別に、自分で切り替えて表示する
export default function TabsBasic() {
  const [value, setValue] = useState("profile");

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        {/* onChange の第2引数に、押されたタブの value が入る */}
        <Tabs value={value} onChange={(_event, newValue: string) => setValue(newValue)} aria-label="マイページ">
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              id={`tab-${tab.value}`}
              aria-controls={`tabpanel-${tab.value}`}
            />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab) => (
        // hidden で選ばれていないパネルを隠す。role・aria-labelledby でタブと結び付ける
        <Box
          key={tab.value}
          role="tabpanel"
          hidden={value !== tab.value}
          id={`tabpanel-${tab.value}`}
          aria-labelledby={`tab-${tab.value}`}
          sx={{ p: 2 }}
        >
          <Typography>{tab.content}</Typography>
        </Box>
      ))}
    </Box>
  );
}
