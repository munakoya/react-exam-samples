import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

const faqs = [
  { id: "shipping", question: "送料はいくらですか？", answer: "3,000円以上のご注文で無料です。それ未満は全国一律500円です。" },
  { id: "return", question: "返品はできますか？", answer: "商品到着から7日以内であれば返品できます。" },
  { id: "payment", question: "支払い方法は？", answer: "クレジットカード・コンビニ払い・代金引換に対応しています。" },
];

// AccordionSummary（見出し）を押すと AccordionDetails（中身）が開閉する。開閉の state は持たなくてよい
export default function AccordionBasic() {
  return (
    <div>
      {faqs.map((faq) => (
        // defaultExpanded：最初から開いておく
        <Accordion key={faq.id} defaultExpanded={faq.id === "shipping"}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${faq.id}-content`}
            id={`${faq.id}-header`}
          >
            <Typography component="span">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
