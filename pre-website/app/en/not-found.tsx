import Link from 'next/link';

export default function NotFoundEN() {
  return (
    <div className="flex flex-col items-center justify-center px-6 text-center h-[calc(100svh-72px)] min-h-[500px] bg-cream-100">
      <h1 className="font-heading text-7xl font-extrabold text-teal-700 mb-4">404</h1>
      <h2 className="font-heading text-3xl font-bold text-foreground mb-6">Page not found</h2>
      <p className="text-foreground/70 max-w-md mb-10 text-lg">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/en" className="rounded-xl bg-accent px-8 py-4 text-lg font-bold text-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:-translate-y-0.5">
        Back to Homepage
      </Link>
    </div>
  );
}
