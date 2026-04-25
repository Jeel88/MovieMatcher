/**
 * Calls Claude to generate 30 random movies matching the given genres.
 * Uses the Messages API via a direct fetch (CORS-safe from browser using your anon key).
 */
export const generateMovieCatalogue = async (genres = [], apiKey) => {
  if (!apiKey) throw new Error('No Anthropic API key provided');

  const genreText = genres.length > 0
    ? `The movies MUST be from these genres: ${genres.join(', ')}.`
    : 'Include a diverse mix of genres (Action, Drama, Sci-Fi, Crime, Animation, Horror, Comedy, etc).';

  const prompt = `You are a movie database. Generate exactly 30 movies.
${genreText}

Return ONLY a valid JSON array, no markdown, no explanation. Each object must have these exact fields:
- id: a unique integer (start from 1000)
- title: string
- year: string (e.g. "2019")
- genre: string (e.g. "Sci-Fi" or "Action, Thriller")
- runtime: string (e.g. "2h 12m")
- synopsis: string (2 sentences max)
- posterUrl: use this exact URL pattern: "https://picsum.photos/seed/TITLE_SLUG/400/600" where TITLE_SLUG is the movie title lowercased with hyphens replacing spaces

Example of one entry:
{"id":1000,"title":"Dune","year":"2021","genre":"Sci-Fi","runtime":"2h 35m","synopsis":"A noble family becomes embroiled in a war for control over the universe's most valuable asset on a desert planet. Paul Atreides must travel to the most dangerous planet in the universe to ensure the future of his family.","posterUrl":"https://picsum.photos/seed/dune/400/600"}

Output the array now:`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-3-5',
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
  const movies = JSON.parse(cleaned);

  return movies;
};
