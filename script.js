//  DSA 
class Node {
  constructor(song) {
    this.song = song;
    this.next = null;
    this.prev = null;
  }
}

class Playlist {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  addSong(song) {
    const newNode = new Node(song);
    if (!this.head) {
      this.head = this.tail = this.current = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  next() {
    this.current = this.current.next || this.head;
    return this.current.song;
  }

  prev() {
    this.current = this.current.prev || this.tail;
    return this.current.song;
  }

  getCurrent() {
    return this.current.song;
  }
}

//  SETUP 
const playlist = new Playlist();

playlist.addSong({ name: "Song 1", path: "songs/song1.mp3" });
playlist.addSong({ name: "Song 2", path: "songs/song2.mp3"});
playlist.addSong({ name: "Song 3", path: "songs/song3.mp3"});
playlist.addSong({ name: "Song 4", path: "songs/song4.mp3"});
playlist.addSong({ name: "Song 5", path: "songs/song5.mp3"});
playlist.addSong({ name: "Song 6", path: "songs/song6.mp3"});
playlist.addSong({ name: "Song 7", path: "songs/song7.mp3"});
playlist.addSong({ name: "Song 8", path: "songs/song8.mp3"});
playlist.addSong({ name: "Song 9", path: "songs/song9.mp3"});
playlist.addSong({ name: "Song 10", path: "songs/song10.mp3"});

let historyStack = [];
let favorites = new Set();
let lastSong = null;

// DOM
const audio = document.getElementById("audio");
const songName = document.getElementById("song-name");
const progress = document.getElementById("progress");
// Auto next
audio.addEventListener("ended", nextSong);

//  CORE 
function loadSong(song, autoPlay = false) {
  audio.pause();
  audio.currentTime = 0;

  audio.src = song.path;

  songName.innerText = song.name;

  // history
  if (!historyStack.length || historyStack.at(-1) !== song.name) {
    historyStack.push(song.name);
  }

  if (autoPlay) {
    // small delay ensures src is applied
    setTimeout(() => {
      audio.play().catch((err) => {
        console.log("Play failed:", err);
      });
    }, 100);
  }
}

// initial load
loadSong(playlist.getCurrent());

// play / pause
function playPause() {
  audio.paused ? audio.play() : audio.pause();
}

// next
function nextSong() {
  loadSong(playlist.next(), true);
}

// prev
function prevSong() {
  loadSong(playlist.prev(), true);
}


//  FAVORITES 
function toggleFavorite() {
  const name = playlist.getCurrent().name;

  if (favorites.has(name)) {
    favorites.delete(name);
  } else {
    favorites.add(name);
  }

  alert("Favorites:\n" + [...favorites].join("\n"));
}

function showFavorites() {
  alert("Favorites:\n" + [...favorites].join("\n"));
}

//  SHUFFLE 
function shuffleSong() {
  let temp = playlist.head;
  let arr = [];

  while (temp) {
    arr.push(temp.song);
    temp = temp.next;
  }

  let random;
  do {
    random = arr[Math.floor(Math.random() * arr.length)];
  } while (arr.length > 1 && random === lastSong);

  lastSong = random;

  loadSong(random, true);
}

//  SEARCH 
function searchSong() {
  const q = document.getElementById("searchBox").value.toLowerCase();
  let temp = playlist.head;

  while (temp) {
    if (temp.song.name.toLowerCase().includes(q)) {
      loadSong(temp.song, true);
      return;
    }
    temp = temp.next;
  }

  alert("Song not found");
}

//  PROGRESS 
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

//  THEME 
function toggleTheme() {
  document.body.classList.toggle("light-mode");
}

//  WAVE 
audio.addEventListener("play", () => {
  document.querySelector(".wave").style.opacity = "1";
});

audio.addEventListener("pause", () => {
  document.querySelector(".wave").style.opacity = "0.3";
});

// KEYBOARD 
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    playPause();
  }

  if (e.code === "ArrowRight") nextSong();
  if (e.code === "ArrowLeft") prevSong();
});