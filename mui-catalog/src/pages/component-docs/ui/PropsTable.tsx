import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { PropDoc } from "../model/muiDocs";

/**
 * props の一覧表（名前・型・初期値・説明）
 */

const monospace = {
  fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace',
  fontVariantLigatures: "none", // => や === を記号にまとめない
  fontSize: 13,
};

export const PropsTable = ({ props, note }: { props: PropDoc[]; note?: string }) => {
  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="props の一覧">
          <TableHead>
            <TableRow>
              <TableCell>名前</TableCell>
              <TableCell>型</TableCell>
              <TableCell>初期値</TableCell>
              <TableCell>説明</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.map((prop) => (
              <TableRow key={prop.name}>
                <TableCell component="th" scope="row" sx={{ ...monospace, color: "primary.main", fontWeight: 700, minWidth: 140 }}>
                  {prop.name}
                  {/* 必須の印。読み上げでは「必須」と伝える */}
                  {prop.required && (
                    <Box component="span" sx={{ color: "error.main" }} title="必須">
                      *
                      <Box component="span" sx={visuallyHidden}>
                        必須
                      </Box>
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ ...monospace, color: "secondary.main", minWidth: 140 }}>{prop.type}</TableCell>
                <TableCell sx={{ ...monospace, whiteSpace: "nowrap" }}>{prop.default ?? "—"}</TableCell>
                <TableCell sx={{ minWidth: 200 }}>{prop.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {note && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {note}
        </Typography>
      )}
    </Box>
  );
};

// 画面には出さず、読み上げだけで伝える
const visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;
