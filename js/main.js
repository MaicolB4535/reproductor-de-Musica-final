document.addEventListener('DOMContentLoaded', function() {
    const songs = Array.from(document.querySelectorAll('.ms'));
    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    const nombreCancion = document.getElementById('nombreCancion');
    const songImage = document.getElementById('imgCancion');
    const autorCancion = document.getElementById('autorCancion');
    const botonPlay = document.querySelector('#botonPlay');
    const botonPausa = document.querySelector('#botonPausa');
    const botonAleatorio = document.querySelector('#botonAleatorio');
    const botonPrev = document.querySelector('#botonPrev');
    const botonNext = document.querySelector('#botonNext');
    const botonRepetir = document.querySelector('#botonRepetir');
    const botonLike = document.querySelector('#botonLike');
    const botonListaCanciones = document.querySelector('#playList');
    const listaCanciones = document.querySelector('#listaDecanciones');
    const tiempoInicial = document.querySelector('#tiempoInicial');
    const tiempoDuracion = document.querySelector('#tiempoDuracion');
    const medidorTiempo = document.querySelector('#medidorTiempo');
    const barraDeTiempo = document.querySelector('#barraDeTiempo');

    let currentIndex = 0;
    let isRepeating = false; 

    function loadSong(index) {
        const song = songs[index];
        const title = song.getAttribute('data-title');
        const src = song.getAttribute('data-src');
        const img = song.getAttribute('data-img');
        const autor = song.getAttribute('data-subtitle');

        nombreCancion.textContent = title;
        autorCancion.textContent = autor;
        audioSource.src = src;
        audioPlayer.load();
        songImage.style.backgroundImage = `url(${img})`;
        listaCanciones.classList.remove('active');
    }

    function playSong() {
        botonPlay.classList.add('play');
        botonPlay.style.display = "none";
        botonPausa.style.display = "block";
        audioPlayer.play();
    }
    
    function pauseSong() {
        botonPlay.classList.remove('play');
        botonPlay.style.display = "block";
        botonPausa.style.display = "none";
        audioPlayer.pause();
    }

    function playNextSong() {
        currentIndex = (currentIndex + 1) % songs.length;
        loadSong(currentIndex);
        playSong();
    }

    function playPreviousSong() {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        loadSong(currentIndex);
        playSong();
    }

    function playRandomSong() {
        currentIndex = Math.floor(Math.random() * songs.length);
        loadSong(currentIndex);
        playSong();
    }

    function toggleRepeat() {
        isRepeating = !isRepeating;
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        playSong();
    }

    function handleSongEnd() {
        if (isRepeating) {
            audioPlayer.currentTime = 0; 
            audioPlayer.play(); 
        } else {
            playNextSong(); 
        }
    }

    function updateBarProgres(e) {
        const { duration, currentTime } = e.target;
        const porcentajeProgreso = (currentTime / duration) * 100;
        medidorTiempo.style.left = `${porcentajeProgreso}%`;
    
        tiempoInicial.textContent = formatTime(currentTime);
        tiempoDuracion.textContent = formatTime(duration);
    }
    
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickPosition = e.offsetX;
        const duration = audioPlayer.duration;

        audioPlayer.currentTime = (clickPosition / width) * duration;
    }

    songs.forEach((song, index) => {
        song.addEventListener('click', function() {
            currentIndex = index;
            loadSong(currentIndex);
            // playSong();
        });
    });

    botonPlay.addEventListener('click', () => {
        const isPlaying = botonPlay.classList.contains('play');
    
        if (!isPlaying) {
            playSong();
        } else {
            pauseSong();
        }
    });

    botonPausa.addEventListener('click', () => {
        const isPlaying = botonPlay.classList.contains('play');
    
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    botonAleatorio.addEventListener('click', function() {
        playRandomSong();
    });

    botonPrev.addEventListener('click', function() {
        playPreviousSong();
    });

    botonNext.addEventListener('click', function() {
        playNextSong();
    });

    botonRepetir.addEventListener('click', function() {
        toggleRepeat();
    });

    audioPlayer.addEventListener('ended', handleSongEnd);

    botonListaCanciones.addEventListener('click', () => {
        listaCanciones.classList.toggle('active');
    });
    
    botonLike.addEventListener('click', () => {
        botonLike.classList.toggle('like');
    });

    audioPlayer.addEventListener('timeupdate', updateBarProgres);

    barraDeTiempo.addEventListener('click', setProgress);

    loadSong(currentIndex);
});
