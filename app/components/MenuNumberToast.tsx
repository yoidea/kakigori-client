export default function MenuNumberToast({ number }: { number: number }) {
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50
                 rounded-xl bg-black/80 text-white px-3 py-2 text-sm shadow-lg"
    >
      メニュー番号: {number}
    </div>
  );
}