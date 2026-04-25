export const shuffleFilms = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const films = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    genre: "Sci-Fi / Adventure",
    runtime: "166 min",
    synopsis: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqO9Tg.jpg"
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    genre: "Biography / Drama",
    runtime: "180 min",
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. A cinematic exploration of the moral complexities and historic weight of the Manhattan Project.",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"
  },
  {
    id: 3,
    title: "Poor Things",
    year: 2023,
    genre: "Comedy / Drama",
    runtime: "141 min",
    synopsis: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter. Hungry for the worldliness she is lacking, Bella runs off with Duncan Wedderburn on a whirlwind adventure across the continents.",
    posterUrl: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8Ph11e5H297t3bUqD.jpg"
  },
  {
    id: 4,
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    genre: "Animation / Action",
    runtime: "140 min",
    synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg"
  },
  {
    id: 5,
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: "Action / Adventure",
    runtime: "139 min",
    synopsis: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led. A mind-bending exploration of family, love, and the multiverse.",
    posterUrl: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg"
  },
  {
    id: 6,
    title: "The Batman",
    year: 2022,
    genre: "Action / Crime",
    runtime: "176 min",
    synopsis: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption. He must forge new relationships, unmask the culprit, and bring justice to the abuse of power.",
    posterUrl: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"
  },
  {
    id: 7,
    title: "Blade Runner 2049",
    year: 2017,
    genre: "Sci-Fi / Thriller",
    runtime: "164 min",
    synopsis: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years. Together they must uncover the truth about a society on the brink of collapse.",
    posterUrl: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg"
  },
  {
    id: 8,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi / Adventure",
    runtime: "169 min",
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. They must navigate across the vast emptiness of the cosmos, leaving their families behind to secure a future for mankind.",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QlsUUHXjNpeEYZNdgebtXg.jpg"
  },
  {
    id: 9,
    title: "Parasite",
    year: 2019,
    genre: "Thriller / Drama",
    runtime: "132 min",
    synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan. A gripping and darkly comedic commentary on social inequality and desperation.",
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"
  },
  {
    id: 10,
    title: "Mad Max: Fury Road",
    year: 2015,
    genre: "Action / Sci-Fi",
    runtime: "120 min",
    synopsis: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max. A relentless chase across the desert ensues.",
    posterUrl: "https://image.tmdb.org/t/p/w500/hA2ple9q4cbBUGZ11I1gE9j4t6g.jpg"
  },
  // Adding 5 more for a solid 15. The rest can be expanded later if needed.
  {
    id: 11,
    title: "Joker",
    year: 2019,
    genre: "Crime / Drama",
    runtime: "122 min",
    synopsis: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.",
    posterUrl: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
  },
  {
    id: 12,
    title: "Whiplash",
    year: 2014,
    genre: "Drama / Music",
    runtime: "106 min",
    synopsis: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential. The relentless pursuit of perfection takes a dark and dangerous turn.",
    posterUrl: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg"
  },
  {
    id: 13,
    title: "The Grand Budapest Hotel",
    year: 2014,
    genre: "Comedy / Drama",
    runtime: "99 min",
    synopsis: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge. A charming, stylized tale of theft, love, and a bygone era.",
    posterUrl: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg"
  },
  {
    id: 14,
    title: "Arrival",
    year: 2016,
    genre: "Sci-Fi / Drama",
    runtime: "116 min",
    synopsis: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world. As she learns their language, she experiences vivid flashbacks that hold the key to unlocking the true purpose of their visit.",
    posterUrl: "https://image.tmdb.org/t/p/w500/pEFRzGFTpVEA7n2B1jKqjW7rDDI.jpg"
  },
  {
    id: 15,
    title: "Inception",
    year: 2010,
    genre: "Action / Sci-Fi",
    runtime: "148 min",
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O. The complex mission requires him to navigate multiple layers of dreams, risking everything.",
    posterUrl: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"
  }
];
