'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Star, Calendar, Film, Loader2 } from 'lucide-react';
import Link from 'next/link';

type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
};

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMovies = async (searchQuery = '') => {
    setLoading(true);
    setError('');
    
    try {
      const url = searchQuery
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            searchQuery
          )}&api_key=ab797cfc0b024bf00f7063493e9d2c5d`
        : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=ab797cfc0b024bf00f7063493e9d2c5d`;
      
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      
      if (data.results) {
        setMovies(data.results);
      } else {
        setError('No movies found');
      }
    } catch (err) {
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchMovies(query);
    }
  };

  useEffect(() => {
    fetchMovies(); // Load popular movies initially
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear().toString();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-black py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MovieX
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Discover your next favorite movie
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for movies, actors, directors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 pr-24 h-14 text-lg rounded-full border-2 border-gray-200 dark:border-gray-700 
                         focus:border-blue-500 dark:focus:border-blue-400 
                         bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                         shadow-lg hover:shadow-xl transition-all duration-300"
            />
            <Button 
              onClick={() => fetchMovies(query)}
              disabled={loading}
              className="absolute right-2 h-10 px-6 rounded-full 
                         bg-gradient-to-r from-blue-500 to-purple-600 
                         hover:from-blue-600 hover:to-purple-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80 mb-4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2"></div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {movies.length > 0 ? (
            movies.map((movie) => (
            <Link href={`/movie/${movie.id}`}> <div
                key={movie.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl 
                                 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                                 transition-all duration-300 rounded-xl">
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzM3NDE1MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
                      }
                      alt={movie.title}
                      className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    {/* Rating Badge */}
                    {movie.vote_average && movie.vote_average > 0 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className={`text-xs font-semibold ${getRatingColor(movie.vote_average)}`}>
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                     
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {movie.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>

                    {movie.overview && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {movie.overview}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
              </Link> 
            ))
          ) : !loading && (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Film className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No movies found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try searching with different keywords or browse our popular movies
                </p>
                {query && (
                  <Button 
                    onClick={() => {
                      setQuery('');
                      fetchMovies();
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Show Popular Movies
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}