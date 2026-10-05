import styles from "./SamplesTopLink.module.css";

/**
 * 「← サンプル集」へ戻るリンク（GitHub Pages の公開ページ用）
 *
 * 公開ページではアプリが /react-exam-samples/inventory/ のような場所に置かれる（import.meta.env.BASE_URL）。
 * その 1 つ上（/react-exam-samples/）がサンプル集のトップなので、そこへのリンクを出す。
 * 手元（npm run dev）では BASE_URL が "/" なので、何も出さない。
 *
 * 試験で作るアプリには要らない部品。
 *
 *   <Header title="在庫管理" right={<SamplesTopLink />} />
 */

const baseUrl = import.meta.env.BASE_URL;
// "/react-exam-samples/inventory/" → "/react-exam-samples/"（最後のフォルダを取る）
const samplesTopUrl = baseUrl === "/" ? null : baseUrl.replace(/[^/]+\/$/, "");

export const SamplesTopLink = () => {
  if (!samplesTopUrl) return null;

  // アプリの外へ出るので、React Router の Link ではなく普通の <a>
  return (
    <a href={samplesTopUrl} className={styles.link}>
      ← サンプル集
    </a>
  );
};
