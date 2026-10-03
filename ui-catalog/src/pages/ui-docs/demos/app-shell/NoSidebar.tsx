import { AppShell, Header, PageHeader, Stack } from "@/shared/ui";

// sidebar を渡さなければ、メインが横幅いっぱいになる（ログイン画面・1ページだけのアプリなど）
export default function AppShellNoSidebar() {
  return (
    <AppShell minHeight="200px" header={<Header title="ログイン" />}>
      <Stack style={{ padding: "var(--space-5)" }}>
        <PageHeader title="ようこそ" description="サイドバーのない画面" />
      </Stack>
    </AppShell>
  );
}
