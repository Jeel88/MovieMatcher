// Weighted Scoring
// love = 3 pts, yes = 1 pt, no = 0 pts

export const rankFilms = (participants) => {
  const scores = {};
  const filmIds = new Set();

  // Aggregate scores
  participants.forEach(p => {
    Object.entries(p.votes).forEach(([filmId, sentiment]) => {
      filmIds.add(filmId);
      if (!scores[filmId]) scores[filmId] = 0;
      
      if (sentiment === 'love') scores[filmId] += 3;
      if (sentiment === 'yes') scores[filmId] += 1;
    });
  });

  // Convert to array and sort descending
  const leaderboard = Array.from(filmIds).map(id => ({
    id: parseInt(id),
    score: scores[id]
  })).sort((a, b) => b.score - a.score);

  return leaderboard;
};

const SASSY_ROASTS = [
  "Basic taste detected. Of course you liked this one, it requires zero brain cells to comprehend.",
  "Oh look, another completely predictable swipe. I bet you think vanilla is the spiciest flavor too.",
  "Your algorithm profile suggests you have the cinematic taste of a sleepy golden retriever.",
  "I processed 14 million possible movies for you, and this is what you pick? My CPU is weeping.",
  "Statistically speaking, your movie opinions are why aliens refuse to talk to us.",
  "You definitely tell people you 'love indie films' but only watch Marvel movies in secret.",
  "I didn't need a neural network to predict this swipe. A Magic 8-Ball could have guessed your taste.",
  "Fascinating. Your votes perfectly align with someone who sleeps with socks on.",
  "Your cinematic palate is so unseasoned, it makes plain toast look like a gourmet meal.",
  "My sentiment analysis indicates you have excellent taste... in being completely average."
];

export const fetchAllRationales = async (participants, topFilmId, apiKey) => {
  // Simulate a slight delay for the "GENERATING ROAST..." effect
  await new Promise(resolve => setTimeout(resolve, 1500));

  return participants.reduce((acc, p) => {
    // Pick a random roast from the array
    const randomRoast = SASSY_ROASTS[Math.floor(Math.random() * SASSY_ROASTS.length)];
    acc[p.name] = randomRoast;
    return acc;
  }, {});
};
