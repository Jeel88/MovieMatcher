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

export const fetchAllRationales = async (participants, topFilmId, apiKey) => {
  // This will call Claude API
  // Returning mocked data for now until we build the actual fetch call in the Results component
  if (!apiKey) {
    return participants.reduce((acc, p) => {
      acc[p.name] = `Because ${p.name} loved the visually striking style and the genre aligns with their previous highly rated films. It's a perfect match for their distinct taste profile.`;
      return acc;
    }, {});
  }

  // To be implemented fully in the Claude integration phase
  return {};
};
