import { useId, useRef, useState, type ChangeEvent } from "react";
import styles from "./ImageField.module.css";

/**
 * 画像を選んで、プレビューを表示する入力欄（アルバム・プロフィール画像など）
 *
 * 選んだ画像は、縮小してから「data URL」（"data:image/jpeg;base64,..." という文字列）にして返す。
 * 文字列なので、そのまま store に入れて localStorage に保存できる。
 *   ⚠ localStorage は合計 5MB ほどしか保存できない。大きいまま保存するとすぐいっぱいになるので、
 *     maxSize（長い辺のピクセル数）まで縮小し、JPEG にして小さくしている。
 *
 * 値（data URL）は親が持つ（制御コンポーネント）。React Hook Form では Controller でつなぐ。
 *   // zod：image: z.string().min(1, "写真を選んでください")
 *   <Controller
 *     control={control}
 *     name="image"
 *     render={({ field, fieldState }) => (
 *       <ImageField label="写真" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
 *     )}
 *   />
 *
 *   // useState で持つ場合
 *   const [image, setImage] = useState("");
 *   <ImageField label="写真" value={image} onChange={setImage} />
 */

type ImageFieldProps = {
  label: string;
  /** 選ばれている画像の data URL。未選択なら "" */
  value: string;
  onChange: (dataUrl: string) => void;
  hint?: string;
  error?: string;
  /** 縮小後の長い辺のピクセル数 */
  maxSize?: number;
};

/** 画像ファイルを、長い辺が maxSize 以下の JPEG の data URL にする */
const resizeImage = (file: File, maxSize: number) =>
  new Promise<string>((resolve, reject) => {
    // ファイルを <img> で読み込むための一時的な URL
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height)); // 小さい画像は拡大しない
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("画像を変換できませんでした"));
        return;
      }
      // JPEG は透明にできないので、先に白で塗る（PNG の透明部分が黒くならないように）
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl); // 一時的な URL は使い終わったら消す
      resolve(canvas.toDataURL("image/jpeg", 0.8)); // 0.8：画質（0〜1）。下げるほど小さくなる
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("画像を読み込めませんでした"));
    };
    image.src = objectUrl;
  });

export const ImageField = ({
  label,
  value,
  onChange,
  hint,
  error,
  maxSize = 800,
}: ImageFieldProps) => {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  // 同じファイルを選び直せるように、選んだ後に <input> の中身を空にする（そのための ref）
  const inputRef = useRef<HTMLInputElement>(null);
  // 画像以外を選んだ・読み込めなかったときのエラー（入力チェックのエラー error とは別）
  const [readError, setReadError] = useState("");

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setReadError("画像ファイルを選んでください");
      return;
    }
    try {
      onChange(await resizeImage(file, maxSize));
      setReadError("");
    } catch (e) {
      setReadError(e instanceof Error ? e.message : "画像を読み込めませんでした");
    }
  };

  const message = readError || error || hint;
  const isError = Boolean(readError || error);

  return (
    <div className={styles.field}>
      <p className={styles.label}>{label}</p>

      {value ? (
        <img src={value} alt={`${label}のプレビュー`} className={styles.preview} />
      ) : (
        <div className={styles.placeholder}>画像が選ばれていません</div>
      )}

      <div className={styles.actions}>
        {/*
          本物の <input type="file"> は見えなくして、<label> をボタンの見た目にする。
          <label> を押すと <input> が押されたことになり、ファイルの選択画面が開く
        */}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*" // 選択画面で画像だけを出す
          className={`visually-hidden ${styles.input}`}
          onChange={handleChange}
          aria-describedby={message ? messageId : undefined}
          aria-invalid={isError || undefined}
        />
        <label htmlFor={inputId} className={styles.button}>
          {value ? `${label}を変える` : `${label}を選ぶ`}
        </label>
        {value && (
          <button type="button" className={styles.button} onClick={() => onChange("")}>
            取り消す
          </button>
        )}
      </div>

      {message && (
        <p id={messageId} className={styles.message} data-error={isError}>
          {message}
        </p>
      )}
    </div>
  );
};
