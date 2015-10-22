app.factory('SearchService', function SearchService($http) {
    var searchTracks = function (title, callback) {
        $http.get("https://api.spotify.com/v1/search?q=" + title + "&type=track&limit=10")
        .success(callback);
    }

    var searchAlbums = function (title, callback) {
        $http.get("https://api.spotify.com/v1/search?q=" + title + "&type=album&limit=10")
        .success(callback);
    }

    var searchArtists = function (title, callback) {
        $http.get("https://api.spotify.com/v1/search?q=" + title + "&type=artist&limit=10")
        .success(callback);
    }

    var searchTrackById = function (id, callback) {
        $http.get("https://api.spotify.com/v1/tracks/" + id)
        .success(callback);
    }

    var searchAlbumById = function (id, callback) {
        $http.get("https://api.spotify.com/v1/albums/" + id)
        .success(callback);
    }

    var searchArtistById = function (id, callback) {
        $http.get("https://api.spotify.com/v1/artists/" + id)
        .success(callback);
    }

    return {
        searchTracks: searchTracks,
        searchAlbums: searchAlbums,
        searchArtists: searchArtists,
        searchTrackById: searchTrackById,
        searchAlbumById: searchAlbumById,
        searchArtistById: searchArtistById
    }
});