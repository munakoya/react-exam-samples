import Box from "@mui/material/Box";

/**
 * 文中の `…` で囲んだ部分を <code> にして表示する
 *
 *   <RichText text="値は `checked` で渡す" />  →  値は <code>checked</code> で渡す
 *
 * split に () 付きの正規表現を渡すと、一致した部分も配列に残る。
 * 奇数番目（1, 3, 5 …）が ` で囲まれていた部分になる。
 */
export const RichText = ({ text }: { text: string }) =>
  text.split(/`([^`]+)`/).map((part, index) =>
    index % 2 === 1 ? (
      <Box
        key={index}
        component="code"
        sx={{
          px: 0.5,
          py: "1px",
          borderRadius: 0.5,
          bgcolor: "grey.100",
          fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace',
          fontVariantLigatures: "none", // => や === を記号（⇒・≡）にまとめない
          fontSize: "0.85em",
          overflowWrap: "anywhere",
        }}
      >
        {part}
      </Box>
    ) : (
      part
    ),
  );
