import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { CodeBlock } from "./CodeBlock";

/**
 * 部品本体のソース（複数ファイル）をタブで切り替えて表示する
 *
 *   <SourceTabs files={getSharedUiFiles("Notifier")} />
 */

type SourceFile = {
  /** タブに出す名前（"Notifier.tsx"） */
  fileName: string;
  /** コードの上に出すパス（"src/shared/ui/Notifier/Notifier.tsx"） */
  path: string;
  code: string;
};

export const SourceTabs = ({ files }: { files: SourceFile[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = files[activeIndex];

  if (!active) return null;

  return (
    <Stack spacing={1}>
      {/* ファイルが1つならタブは出さない */}
      {files.length > 1 && (
        <Tabs
          value={activeIndex}
          onChange={(_event, index: number) => setActiveIndex(index)}
          variant="scrollable"
          aria-label="ソースファイル"
        >
          {files.map((file) => (
            <Tab key={file.fileName} label={file.fileName} sx={{ textTransform: "none" }} />
          ))}
        </Tabs>
      )}
      <CodeBlock code={active.code} fileName={active.path} />
    </Stack>
  );
};
