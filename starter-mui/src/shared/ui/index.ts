// shared/ui の窓口（Public API） ── MUI 版
//
// 元は samples/_shared/mui-ui。各アプリの src/shared/ui はそのコピー（npm run sync-ui で反映）。
// ボタン・入力欄などは MUI の部品をそのまま使い、MUI にない組み合わせだけをここで作る。
export { AppShell, type AppShellNavItem } from "./AppShell/AppShell";
export { ConfirmDialog } from "./ConfirmDialog/ConfirmDialog";
export { DataTable, type DataTableColumn } from "./DataTable/DataTable";
export { DescriptionList, type DescriptionItem } from "./DescriptionList/DescriptionList";
export { DialogForm } from "./DialogForm/DialogForm";
export { useFormDialog } from "./DialogForm/useFormDialog";
export { EmptyState } from "./EmptyState/EmptyState";
export { FormTextField } from "./FormTextField/FormTextField";
export { Notifier } from "./Notifier/Notifier";
export { notify, useNotifierStore } from "./Notifier/notifierStore";
export { PageHeader, type BreadcrumbItem } from "./PageHeader/PageHeader";
export { QuantityStepper } from "./QuantityStepper/QuantityStepper";
export { StatCard } from "./StatCard/StatCard";
// サンプル集の公開ページ用（試験で作るアプリには要らない）
export { SamplesTopLink } from "./SamplesTopLink/SamplesTopLink";
