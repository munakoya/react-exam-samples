import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Suspense, use, useState } from "react";
import {
  appNames,
  fsdLayerColors,
  getAppName,
  getLayer,
  getRepoUrl,
  getSrcPath,
  type AppFile,
} from "../model/appLinks";
import { loadAppSource } from "../model/sources";
import { CodeBlock } from "./CodeBlock";

/**
 * サンプルアプリのファイル一覧（左）と、選んだファイルのコード（右） ── pages/component-docs/ui
 *
 *   <AppCodeExplorer files={pattern.files} />
 *
 * 左の一覧には FSD の層（pages・widgets・features…）を色付きで出し、「どの層に何を置くか」が見えるようにする。
 * コードは選んだときに1ファイルずつ読み込む（model/sources.ts の loadAppSource）。
 */

/** FSD の層の Chip（「features」などを色付きで出す） */
export const LayerChip = ({ path }: { path: string }) => {
  const layer = getLayer(path);
  if (!layer) return null;
  return <Chip size="small" label={layer} color={fsdLayerColors[layer]} variant="outlined" sx={{ fontFamily: "monospace" }} />;
};

// コード本体。use() で Promise の結果を待つ（待っている間は外の <Suspense> の fallback が出る）
const AppSource = ({ path }: { path: string }) => {
  const code = use(loadAppSource(path));

  if (code === undefined) {
    return (
      <Alert severity="info">
        このカタログ単体ではサンプルアプリのファイルを読み込めない。{" "}
        <Link href={getRepoUrl(path)} target="_blank" rel="noopener">
          GitHub で見る
        </Link>
      </Alert>
    );
  }
  return <CodeBlock code={code} fileName={path} />;
};

export const AppCodeExplorer = ({ files }: { files: AppFile[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = files[activeIndex];

  if (!active) return null;

  return (
    <Grid container spacing={2}>
      {/* ----- 左：ファイルの一覧（スマホでは上） ----- */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper variant="outlined">
          <List dense disablePadding aria-label="サンプルアプリのファイル">
            {files.map((file, index) => (
              <ListItemButton
                key={file.path}
                selected={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                divider={index < files.length - 1}
                sx={{ alignItems: "flex-start" }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
                      <LayerChip path={file.path} />
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ fontWeight: 700, fontFamily: "monospace", overflowWrap: "anywhere" }}
                      >
                        {file.path.split("/").at(-1)}
                      </Typography>
                    </Stack>
                  }
                  secondary={file.note}
                  slotProps={{ secondary: { sx: { mt: 0.5 } } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* ----- 右：選んだファイルのコード ----- */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Chip size="small" label={appNames[getAppName(active.path)] ?? getAppName(active.path)} />
            <LayerChip path={active.path} />
            <Typography variant="body2" sx={{ fontFamily: "monospace", overflowWrap: "anywhere" }}>
              src/{getSrcPath(active.path)}
            </Typography>
            <Link
              href={getRepoUrl(active.path)}
              target="_blank"
              rel="noopener"
              variant="body2"
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, ml: "auto" }}
            >
              GitHub
              <OpenInNewIcon sx={{ fontSize: 14 }} />
            </Link>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {active.note}
          </Typography>
          {/* key：ファイルを変えたら読み込み直す */}
          <Suspense key={active.path} fallback={<Skeleton variant="rounded" height={320} />}>
            <AppSource path={active.path} />
          </Suspense>
        </Stack>
      </Grid>
    </Grid>
  );
};
