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
  },
  {
    id: 16,
    title: "The Matrix",
    year: 1999,
    genre: "Sci-Fi / Action",
    runtime: "136 min",
    synopsis: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  },
  {
    id: 17,
    title: "Pulp Fiction",
    year: 1994,
    genre: "Crime / Drama",
    runtime: "154 min",
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
  },
  {
    id: 18,
    title: "The Shawshank Redemption",
    year: 1994,
    genre: "Drama",
    runtime: "142 min",
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
  },
  {
    id: 19,
    title: "The Dark Knight",
    year: 2008,
    genre: "Action / Crime",
    runtime: "152 min",
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    id: 20,
    title: "Fight Club",
    year: 1999,
    genre: "Drama",
    runtime: "139 min",
    synopsis: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
  },
  {
    id: 21,
    title: "Forrest Gump",
    year: 1994,
    genre: "Drama / Romance",
    runtime: "142 min",
    synopsis: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
    posterUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg"
  },
  {
    id: 22,
    title: "Goodfellas",
    year: 1990,
    genre: "Biography / Crime",
    runtime: "145 min",
    synopsis: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    posterUrl: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg"
  },
  {
    id: 23,
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    genre: "Action / Adventure",
    runtime: "201 min",
    synopsis: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    posterUrl: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5OU6WeSy.jpg"
  },
  {
    id: 24,
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
    genre: "Action / Adventure",
    runtime: "124 min",
    synopsis: "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader and bounty hunter Boba Fett.",
    posterUrl: "https://image.tmdb.org/t/p/w500/7BuH8itoSrLExs2GIrFN21fH2v4.jpg"
  },
  {
    id: 25,
    title: "Spirited Away",
    year: 2001,
    genre: "Animation / Adventure",
    runtime: "125 min",
    synopsis: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
    posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkBg8lWOb.jpg"
  },
  {
    id: 26,
    title: "City of God",
    year: 2002,
    genre: "Crime / Drama",
    runtime: "130 min",
    synopsis: "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other a kingpin.",
    posterUrl: "https://image.tmdb.org/t/p/w500/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg"
  },
  {
    id: 27,
    title: "Se7en",
    year: 1995,
    genre: "Crime / Drama",
    runtime: "127 min",
    synopsis: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    posterUrl: "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVPh.jpg"
  },
  {
    id: 28,
    title: "The Silence of the Lambs",
    year: 1991,
    genre: "Crime / Drama",
    runtime: "118 min",
    synopsis: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
    posterUrl: "https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg"
  },
  {
    id: 29,
    title: "It's a Wonderful Life",
    year: 1946,
    genre: "Drama / Family",
    runtime: "130 min",
    synopsis: "An angel is sent from Heaven to help a desperately frustrated businessman by showing him what life would have been like if he had never existed.",
    posterUrl: "https://image.tmdb.org/t/p/w500/bSqt9rhDZx1Q7UZ86dBPKdNomp2.jpg"
  },
  {
    id: 30,
    title: "La La Land",
    year: 2016,
    genre: "Comedy / Drama",
    runtime: "128 min",
    synopsis: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    posterUrl: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rl0.jpg"
  },
  {
    id: 31,
    title: "Avengers: Infinity War",
    year: 2018,
    genre: "Action / Sci-Fi",
    runtime: "149 min",
    synopsis: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe.",
    posterUrl: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg"
  }
];
