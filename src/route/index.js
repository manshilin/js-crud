// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

//===============================================================
class Track {
  static #list = []
  constructor(name, author, image) {
    this.name = name
    this.author = author
    this.image = image
    this.id = Math.floor(1000 + Math.random() * 9000)
  }
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }
  static getList() {
    return this.#list.reverse()
  }
  static getById(id) {
    return this.#list.find((track) => track.id == id)
  }
}

//===============================================================
Track.create(
  'Track 1',
  'Author 1',
  'https://picsum.photos/100/100',
)
Track.create(
  'Track 2',
  'Author 2',
  'https://picsum.photos/100/100',
)
Track.create(
  'Track 3',
  'Author 3',
  'https://picsum.photos/100/100',
)
Track.create(
  'Track 4',
  'Author 4',
  'https://picsum.photos/100/100',
)
Track.create(
  'Track 5',
  'Author 5',
  'https://picsum.photos/100/100',
)
Track.create(
  'Track 6',
  'Author 6',
  'https://picsum.photos/100/100',
)
Track.create(
  'Track 7',
  'Author 7',
  'https://picsum.photos/100/100',
)
//===============================================================
class Playlist {
  static #list = []
  constructor(name) {
    this.name = name
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }
  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      this.#list.find((playlist) => playlist.id === id) ||
      null
    )
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    const randomTracks = allTracks
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter((track) => track.id !== trackId)
  }
  addTrack = (track) => {
    this.tracks.push(track)
  }

  static findListByName(name) {
    return this.#list.filter((playlist) =>
      playlist.name.toLowerCase().includes(name.toLowerCase())
    );
  }
}

//===============================================================
router.get('/', (req, res) => {
  res.render('spotify-list-playlist', {
    style: 'spotify-list-playlist',
    data: {
      tracks: Track.getList(),
      playlists: Playlist.getList(),
    },
  })
})
//===============================================================
router.get('/spotify-choose', (req, res) => {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {
      tracks: Track.getList(),
      playlists: Playlist.getList(),
    },
  })
})

//=====================================================================
router.get('/spotify-create', (req, res) => {
  const isMix = !!req.query.isMix

  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
})
//=====================================================================
router.post('/spotify-create', (req, res) => {
  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: "Поле обов'язкове для заповнення",
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
      errors: {
        name: "Поле обов'язкове для заповнення",
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }
  console.log(playlist)
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      name: playlist.name,
      playlistId: playlist.id,
      tracks: playlist.tracks,
    },
  })
})
//=====================================================================
router.get('/spotify-playlist', (req, res) => {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)
  console.log(playlist)
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Плейлист не знайдено',
        link: '/',
      },
    })
  }
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      name: playlist.name,
      playlistId: playlist.id,
      tracks: playlist.tracks,
    },
  })
})
//=====================================================================
router.get('/spotify-delete-track', (req, res) => {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)
  console.log(playlistId, trackId, playlist)
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Плейлист не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  playlist.deleteTrackById(trackId)
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

//=====================================================================
router.get('/spotify-playlist-add', (req, res) => {
  const playlistId = Number(req.query.playlistId)
  const playlist = Playlist.getById(playlistId) 
  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      playlistId: playlistId,
      tracks: Track.getList(),
      name: playlist.name,
      
    },
  })
})
//=====================================================================
router.get('/spotify-add-track', (req, res) => {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)
  const track = Track.getById(trackId)
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Плейлист не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  playlist.addTrack(track)
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

//====================================================================
router.get('/spotify-search', (req, res) => {
  const name = ''
  const list = Playlist.findListByName(name)
  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({tracks, ...rest}) => ({
        ...rest,
        amount: tracks.length,
      }
        )),
        name,
    },
  })
})
//=====================================================================
router.post('/spotify-search', (req, res) => {
  const name = req.body.name || ''
  const list = Playlist.findListByName(name)
  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({tracks, ...rest}) => ({
        ...rest,
        amount: tracks.length,
      }
        )),
        name,
    },
  })
})
//=====================================================================

module.exports = router
