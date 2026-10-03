import { ToastProvider, useToast, Button } from "@/shared/ui";

// ToastProvider でアプリ全体を1回だけ包む。中のどこからでも useToast() が使える
//
//   // main.tsx
//   createRoot(document.getElementById("root")!).render(
//     <ToastProvider>
//       <App />
//     </ToastProvider>,
//   );

const SaveButton = () => {
  const toast = useToast();
  return <Button onClick={() => toast.show("このボタンは Provider の中にある")}>通知を出す</Button>;
};

export default function ToastSetup() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}
