/**
 * Calls Claude Haiku to generate 30 random movies matching the given genres.
 * Then enriches each movie with a real poster from OMDB API.
 */
export const generateMovieCatalogue = async (genres = [], apiKey) => {
  if (!apiKey) throw new Error('No Anthropic API key provided');

  const genreText = genres.length > 0
    ? `The movies MUST be from these genres only: ${genres.join(', ')}.`
    : 'Include a diverse mix of genres (Action, Drama, Sci-Fi, Crime, Animation, Horror, Comedy, Romance, Thriller).';

  const prompt = `You are a movie database. Generate exactly 30 well-known, real movies that actually exist.
${genreText}

Return ONLY a valid JSON array with no markdown, no explanation, nothing else. Each object must have EXACTLY these fields:
- id: unique integer starting from 1000
- title: the EXACT real movie title (must be a real film that exists)
- year: string like "2019"
- genre: string like "Sci-Fi" or "Action, Thriller"
- runtime: string like "2h 12m"
- synopsis: 2 sentences maximum describing the plot

Do NOT include a posterUrl field - I will fetch that separately.

Make sure movies are diverse, well-known classics and hits spanning different decades.
Output the JSON array now with no other text:`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error: ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  // Strip any accidental markdown code fences
  const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim();
  let movies = JSON.parse(cleaned);

  // Enrich with real posters from OMDB (free, no key needed for poster fetch)
  movies = await enrichWithPosters(movies);

  return movies;
};

/**
 * Fetches real movie posters from OMDB API for each generated movie.
 * Falls back to a stylized placeholder if not found.
 */
const enrichWithPosters = async (movies) => {
  const OMDB_KEY = 'trilogy'; // free public demo key
  
  const enriched = await Promise.all(movies.map(async (movie) => {
    try {
      const titleEncoded = encodeURIComponent(movie.title);
      const url = `https://www.omdbapi.com/?t=${titleEncoded}&y=${movie.year}&apikey=${OMDB_KEY}&type=movie`;
      const res = await fetch(url);
      
      if (res.ok) {
        const data = await res.json();
        if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
          return { ...movie, posterUrl: data.Poster };
        }
      }
    } catch (e) {
      // silently fall through to placeholder
    }

    // Stylized fallback using a reliable placeholder service with movie title
    const slug = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      ...movie,
      posterUrl: `https://picsum.photos/seed/${slug}/400/600`
    };
  }));

  return enriched;
};
