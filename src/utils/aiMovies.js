/**
 * Fetches real movies from TMDB API.
 * Falls back to Anthropic AI generation if no TMDB key.
 * Falls back to hardcoded films if neither key is available.
 */

// TMDB genre name → ID mapping
const GENRE_MAP = {
  'Action': 28, 'Adventure': 12, 'Animation': 16, 'Biography': 36,
  'Comedy': 35, 'Crime': 80, 'Drama': 18, 'Family': 10751,
  'Horror': 27, 'Sci-Fi': 878, 'Thriller': 53, 'Romance': 10749,
  'Mystery': 9648, 'Fantasy': 14, 'War': 10752, 'Music': 10402,
};

// Reverse map: TMDB genre ID → name
const GENRE_ID_TO_NAME = Object.fromEntries(
  Object.entries(GENRE_MAP).map(([name, id]) => [id, name])
);

/**
 * Primary: Fetch movies from TMDB discover API.
 * Returns ~200 real movies with real poster URLs.
 */
export const fetchMoviesFromTMDB = async (genres = []) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  if (!apiKey) return null;

  // Build genre filter
  const genreIds = genres.map(g => GENRE_MAP[g]).filter(Boolean);
  const genreParam = genreIds.length > 0 ? `&with_genres=${genreIds.join(',')}` : '';

  // Fetch multiple pages for variety (10 pages = 200 movies)
  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const allMovies = [];

  await Promise.all(pages.map(async (page) => {
    try {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=100&page=${page}${genreParam}&language=en-US`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();

      data.results.forEach(movie => {
        if (!movie.poster_path || !movie.title) return;

        const genreNames = (movie.genre_ids || [])
          .map(id => GENRE_ID_TO_NAME[id])
          .filter(Boolean)
          .slice(0, 2)
          .join(', ') || 'Drama';

        allMovies.push({
          id: movie.id,
          title: movie.title,
          year: (movie.release_date || '').slice(0, 4) || '—',
          genre: genreNames,
          runtime: '—',
          synopsis: movie.overview || 'No description available.',
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        });
      });
    } catch (e) {
      console.warn(`TMDB page ${page} failed:`, e);
    }
  }));

  if (allMovies.length === 0) return null;

  // Shuffle and return 30
  return shuffleArray(allMovies).slice(0, 30);
};

/**
 * Secondary: Generate movies with Claude AI + enrich with OMDB posters.
 */
export const fetchMoviesFromAI = async (genres = []) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const genreText = genres.length > 0
    ? `The movies MUST be from these genres: ${genres.join(', ')}.`
    : 'Include a diverse mix of genres.';

  const prompt = `Generate exactly 30 well-known, real movies. ${genreText}
Return ONLY a JSON array. Each object: {"id": number, "title": string, "year": string, "genre": string, "runtime": string, "synopsis": string (2 sentences max)}. No posterUrl. No markdown.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    const text = data.content[0].text.replace(/```json?/gi, '').replace(/```/g, '').trim();
    const movies = JSON.parse(text);

    // Enrich with OMDB posters
    const OMDB_KEY = 'trilogy';
    const enriched = await Promise.all(movies.map(async (movie) => {
      try {
        const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movie.title)}&y=${movie.year}&apikey=${OMDB_KEY}&type=movie`;
        const r = await fetch(url);
        if (r.ok) {
          const d = await r.json();
          if (d.Response === 'True' && d.Poster && d.Poster !== 'N/A') {
            return { ...movie, posterUrl: d.Poster };
          }
        }
      } catch (_) {}
      const slug = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { ...movie, posterUrl: `https://picsum.photos/seed/${slug}/400/600` };
    }));

    return enriched;
  } catch (e) {
    console.error('AI generation failed:', e);
    return null;
  }
};

/**
 * Master function: tries TMDB → AI → returns null (caller uses hardcoded)
 */
export const generateMovieCatalogue = async (genres = []) => {
  // Try TMDB first (instant, reliable, real posters)
  const tmdbMovies = await fetchMoviesFromTMDB(genres);
  if (tmdbMovies && tmdbMovies.length > 0) return tmdbMovies;

  // Try AI generation (slower, needs Anthropic key)
  const aiMovies = await fetchMoviesFromAI(genres);
  if (aiMovies && aiMovies.length > 0) return aiMovies;

  // Return null — caller will use hardcoded films
  return null;
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
