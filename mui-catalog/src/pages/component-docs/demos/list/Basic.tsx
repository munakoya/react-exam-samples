import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

const contacts = [
  { icon: <EmailIcon />, primary: "メール", secondary: "info@example.com" },
  { icon: <PhoneIcon />, primary: "電話", secondary: "03-1234-5678" },
  { icon: <PlaceIcon />, primary: "住所", secondary: "東京都千代田区1-1-1" },
];

// List > ListItem > ListItemIcon ＋ ListItemText の組み合わせ。
// ListItemText は primary（1行目）と secondary（2行目の薄い文字）を持てる
export default function ListBasic() {
  return (
    <List subheader={<ListSubheader>お問い合わせ先</ListSubheader>} sx={{ maxWidth: 360 }}>
      {contacts.map((contact) => (
        <ListItem key={contact.primary} divider>
          <ListItemIcon>{contact.icon}</ListItemIcon>
          <ListItemText primary={contact.primary} secondary={contact.secondary} />
        </ListItem>
      ))}
    </List>
  );
}
