app.factory('PlaylistService', function PlaylistService($http) {
    var searchPlaylistByUserId = function (userId, callback) {
        $http.get("/api/playlist/" + userId)
        .success(callback);
    }

    var searchPlaylistExcludingAUserId = function (userId, callback) {
        $http.get("/api/playlistNotForUserId/" + userId)
        .success(callback);
    }

    var updatePlaylistWithTrack = function (playlist, callback) {
        $http.put("/api/playlist", playlist)
        .success(callback);
    }

    var updatePlaylistWithComment = function (playlist, callback) {
        $http.put("/api/playlist", playlist)
        .success(callback);
    }

    var updatePlaylistName = function (playlist, callback) {
        $http.put("/api/playlist", playlist)
        .success(callback);
    }

    var deletePlaylist = function (playlist, callback) {
        $http.delete("/api/playlist/" + playlist._id)
        .success(callback);
    }

    var savePlaylist = function (playlist, callback) {
        $http.post("/api/playlist", playlist)
        .success(callback);
    }
    
    var publishUnpublishPlaylist = function (playlist, callback) {
        $http.put("/api/playlist", playlist)
            .success(callback);
    }

    var searchPlaylistByPlaylistIds = function (playlistJSON, callback) {
        $http.get("/api/playlistByPlaylistIds", playlistJSON)
        .success(callback);
    }
    
    return {
        searchPlaylistByUserId: searchPlaylistByUserId,
        updatePlaylistWithTrack: updatePlaylistWithTrack,
        updatePlaylistWithComment: updatePlaylistWithComment,
        deletePlaylist: deletePlaylist,
        savePlaylist: savePlaylist,
        publishUnpublishPlaylist: publishUnpublishPlaylist,
        searchPlaylistExcludingAUserId: searchPlaylistExcludingAUserId,
        searchPlaylistByPlaylistIds: searchPlaylistByPlaylistIds,
        updatePlaylistName: updatePlaylistName
    }
});