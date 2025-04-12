export default async function page() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Login page</h1>
      </header>


      {/* 页脚 */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Movie Ticket System. All rights reserved.
      </footer>
    </div>
  );
}

export const dynamic = "force-dynamic";
