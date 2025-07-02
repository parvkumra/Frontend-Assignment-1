'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Calendar, Clock, Globe, Heart, Share2, Play, Users, Award, Film, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  release_date: string;
  vote_average: number;
  vote_count?: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  production_companies?: { id: number; name: string; logo_path?: string }[];
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { iso_639_1: string; name: string }[];
  budget?: number;
  revenue?: number;
  tagline?: string;
  status?: string;
  popularity?: number;
};

type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
  order: number;
};

type Crew = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path?: string;
};

export default function MovieDetailsPage() {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  // Mock ID for demo - in real app this would come from useParams()
  const p = useParams();
  const id=p.id

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const [movieRes, creditsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=ab797cfc0b024bf00f7063493e9d2c5d`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=ab797cfc0b024bf00f7063493e9d2c5d`)
      ]);

      const movieData = await movieRes.json();
      const creditsData = await creditsRes.json();

      setMovie(movieData);
      setCast(creditsData.cast?.slice(0, 8) || []);
      setCrew(creditsData.crew?.filter((person: Crew) => 
        ['Director', 'Producer', 'Screenplay', 'Writer'].includes(person.job)
      ).slice(0, 6) || []);
    } catch (err) {
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDirector = () => {
    return crew.find(person => person.job === 'Director')?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Movie Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Could not load movie details'}</p>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-black">
       <div className="relative">
        {movie.backdrop_path && (
          <div className="absolute inset-0 h-96 overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-slate-50/20 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900/20" />
          </div>
        )}
        
        {/* Navigation */}
        <div className="relative z-10 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <Button 
              onClick={() => window.history.back()}
              variant="outline" 
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movies
            </Button>
          </div>
        </div>

        <div className="relative z-10 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="lg:w-1/3 flex justify-center lg:justify-start">
                <div className="relative group">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzM3NDE1MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
                    }
                    alt={movie.title}
                    className="w-80 h-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              <div className="lg:w-2/3 space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="text-xl text-gray-600 dark:text-gray-400 italic">
                      "{movie.tagline}"
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <span className={`text-2xl font-bold ${getRatingColor(movie.vote_average)}`}>
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({movie.vote_count?.toLocaleString()} votes)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-5 h-5" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 rounded-full text-sm font-medium"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Trailer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setLiked(!liked)}
                    className={`${liked ? 'text-red-500 border-red-300' : ''} hover:text-red-500 hover:border-red-300`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                    {liked ? 'Liked' : 'Add to Favorites'}
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                    Overview
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Director</h3>
                    <p className="text-gray-600 dark:text-gray-400">{getDirector()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Status</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.status || 'Released'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <div className="px-4 py-12 bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              Top Cast
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {cast.map((actor) => (
                <Card key={actor.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg1IiBoZWlnaHQ9IjE4NSIgZmlsbD0iIzM3NDE1MSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGNpcmNsZSBjeD0iOTIuNSIgY3k9IjY1IiByPSIyNSIgZmlsbD0iIzM3NDE1MSIvPjxwYXRoIGQ9Im05MiA5MWMtMjAgMC0zNyAxMC0zNyAyM3Y3MWg3NHYtNzFjMC0xMy0xNy0yMy0zNy0yM3oiIGZpbGw9IiMzNzQxNTEiLz48L3N2Zz4='
                      }
                      alt={actor.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-3 text-center">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1 line-clamp-1">
                      {actor.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {actor.character}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-500" />
            Movie Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Budget</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatMoney(movie.budget)}
                </p>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Revenue</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatMoney(movie.revenue)}
                </p>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Popularity</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {movie.popularity?.toFixed(0) || 'N/A'}
                </p>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Runtime</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatRuntime(movie.runtime)}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}