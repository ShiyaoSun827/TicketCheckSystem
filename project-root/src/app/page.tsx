import { getMovies } from "@/lib/admin-dashboard-actions";
import NavBar from "@/components/NavBar";
import MovieCard from "@/components/MovieCard";

export default async function Home({ searchParams }: { searchParams?: { page?: string; search?: string } }) {
  const page = parseInt(searchParams?.page || "1", 10);
  const searchQuery = searchParams?.search?.toLowerCase() || "";

  const itemsPerPage = 9;
  const movies = await getMovies();

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <NavBar />
      <h1 className="text-3xl font-bold p-4">==Movies==</h1>

      <form className="px-4 mb-4 flex gap-2" method="GET">
        <input
          type="text"
          name="search"
          placeholder="Search movies..."
          defaultValue={searchParams?.search || ""}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {paginatedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 py-6">
        {page > 1 && (
          <a
            href={`/?page=${page - 1}&search=${searchQuery}`}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Previous
          </a>
        )}
        <span className="font-medium">Page {page} of {totalPages}</span>
        {page < totalPages && (
          <a
            href={`/?page=${page + 1}&search=${searchQuery}`}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
