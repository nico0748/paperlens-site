import { ErrorIcon, InfoIcon } from "./icons";

/** DADS の通知バナー。種類をアイコンと枠の色の両方で示し、色だけに頼らない */
export function Notice({
  kind = "info",
  title,
  children,
  role,
}: {
  kind?: "info" | "error";
  title?: string;
  children?: React.ReactNode;
  role?: "alert" | "status";
}) {
  const Icon = kind === "error" ? ErrorIcon : InfoIcon;
  return (
    <div className={`notice notice-${kind}`} role={role}>
      <Icon size={24} className="notice-icon" />
      <div className="notice-body">
        {title && <p className="notice-title">{title}</p>}
        {children}
      </div>
    </div>
  );
}
