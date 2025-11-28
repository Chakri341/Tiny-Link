export default function ExpiredPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-3xl font-bold mb-3 text-red-600">⛔ Link Expired</h1>
      <p className="text-gray-600 dark:text-gray-300">
        This short link has expired and can no longer be accessed.
      </p>
    </div>
  );
}
