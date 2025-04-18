// src/app/page.tsx
import MovieBrowserClient from "@/components/MovieBrowserClient";
import NavBar from "@/components/NavBar";

export default function HomePage() {
    return (
        <div>
            <NavBar />
            <MovieBrowserClient />
        </div>
    );
}
