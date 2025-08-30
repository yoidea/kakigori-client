export default function ErrorCard({
  title,
  message,
}: {
  title: string;
  message?: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
      <div className="font-semibold">{title}</div>
      {message && <div className="text-sm mt-1">{message}</div>}
    </div>
  );
}
