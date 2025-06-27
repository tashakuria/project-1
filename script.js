const landing = document.getElementById('landing');
const app = document.getElementById('app');
const enterBtn = document.getElementById('enter-btn');
const songList = document.getElementById('song-list');
const addForm = document.getElementById('add-song-form');
const moodFilter = document.getElementById('mood-filter');

const API_URL = "http://localhost:3000/songs";


const fallbackImages = [
"https://i.pinimg.com/564x/20/ed/f6/20edf65d0502d847f2931d8ee3e87a5b.jpg",
"https://i.pinimg.com/564x/f9/9b/95/f99b95f26bc7c7fc68e934e5d3c81d25.jpg",
"https://i.pinimg.com/564x/4c/12/b6/4c12b65628d2c0146bd1068b6d5673b2.jpg",
"https://i.pinimg.com/564x/47/7c/f9/477cf950d702c1b9466e67f68cf75aa0.jpg",
"https://i.pinimg.com/564x/85/55/e9/8555e91d54dd6dd0ce360bb2902e7d73.jpg"
];


enterBtn.addEventListener('click', () => {
landing.classList.add('hidden');
app.classList.remove('hidden');
loadSongs();
});


function loadSongs() {
fetch("http://localhost:3000/songs")
.then(res => res.json())
.then(data => {
songList.innerHTML = '';
data.forEach(song => renderSong(song));
});
}

document.getElementById("enter-btn").addEventListener("click", () => {
document.getElementById("landing").style.display = "none";
document.getElementById("main").style.display = "block";
loadSongs(); 
});

function renderSong(song) {
const card = document.createElement('div');
card.className = 'song-card';

const image = song.image || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

card.innerHTML = `
<img src="${image}" alt="${song.title}">
<h4>${song.title}</h4>
<p>${song.artist}</p>
<p>Mood: ${song.mood}</p>
<button class="like-btn"> ${song.likes || 0}</button>
`;


const likeBtn = card.querySelector('.like-btn');
likeBtn.addEventListener('click', () => {
song.likes = (song.likes || 0) + 1;
likeBtn.textContent = ` ${song.likes}`;
updateLikes(song);
});

songList.appendChild(card);
}


function updateLikes(song) {
fetch(`${API_URL}/${song.id}`, {
method: 'PATCH',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ likes: song.likes })
});
}


addForm.addEventListener('submit', e => {
e.preventDefault();
const formData = new FormData(addForm);
const newSong = {
title: formData.get('title'),
artist: formData.get('artist'),
mood: formData.get('mood'),
image: formData.get('image'),
likes: 0
};

fetch(API_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(newSong)
})
.then(res => res.json())
.then(song => {
renderSong(song);
addForm.reset();
});
});


moodFilter.addEventListener('change', () => {
const mood = moodFilter.value;

fetch(API_URL)
.then(res => res.json())
.then(data => {
songList.innerHTML = '';
const filtered = mood === 'all' ? data : data.filter(song => song.mood === mood);
filtered.forEach(renderSong);
});
});

function renderSong(song) {
const card = document.createElement('div');
card.className = 'song-card';

const image = song.image || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

card.innerHTML = `
<img src="${image}" alt="${song.title}">
<h4>${song.title}</h4>
<p>${song.artist}</p>
<p>Mood: ${song.mood}</p>
<button class="like-btn">❤️ ${song.likes || 0}</button>
<button class="delete-btn">🗑️ Delete</button>
`;


const likeBtn = card.querySelector('.like-btn');
likeBtn.addEventListener('click', () => {
song.likes = (song.likes || 0) + 1;
likeBtn.textContent = `❤️ ${song.likes}`;
updateLikes(song);
});


const deleteBtn = card.querySelector('.delete-btn');
deleteBtn.addEventListener('click', () => {
fetch(`${API_URL}/${song.id}`, {
method: 'DELETE'
})
.then(() => {
card.remove(); 
});
});

songList.appendChild(card);
}