'use client';

export default function DashboardError({ error }: { error: Error }) {
  return (
    <pre className="whitespace-pre-wrap p-4 text-sm text-rose-700">
      Dashboard error: {error.message}
    </pre>
  );
}