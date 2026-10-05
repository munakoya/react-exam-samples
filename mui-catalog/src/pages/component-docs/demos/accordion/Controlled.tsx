import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const sections = [
  { id: "basic", title: "基本情報", body: "名前・メールアドレスを入力する" },
  { id: "address", title: "住所", body: "郵便番号・住所を入力する" },
  { id: "payment", title: "支払い方法", body: "カードまたは銀行振込を選ぶ" },
];

// 開いている項目を state で持つと「1つだけ開く」にできる（false は全部閉じている）
export default function AccordionControlled() {
  const [expanded, setExpanded] = useState<string | false>("basic");

  return (
    <div>
      {sections.map((section) => (
        <Accordion
          key={section.id}
          expanded={expanded === section.id}
          // isExpanded：押した結果、開くなら true
          onChange={(_event, isExpanded) => setExpanded(isExpanded ? section.id : false)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${section.id}-panel`} id={`${section.id}-header`}>
            <Typography component="span">{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">{section.body}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
