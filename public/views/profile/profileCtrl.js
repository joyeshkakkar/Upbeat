app.controller("ProfileController", function ($scope, $http, $routeParams, $rootScope, SearchService, $modal, PlaylistService, UserService) {
   var currentUser = $rootScope.currentUser;
    $scope.currentUser = currentUser;
    userId = currentUser._id;

    UserService.searchUserByUserId(userId, function (response) {
        $rootScope.currentUser = response;
        $scope.currentUser = response;
        currentUser = response;
        console.log(response);
        $scope.favTracks = currentUser.tracks;
        $scope.favAlbums = currentUser.albums;
        $scope.favArtists = currentUser.artists;
    });

    $scope.removeTrackFromFav = function (track) {
        var currentUser = $rootScope.currentUser;
        var index = $scope.favTracks.indexOf(track);
        console.log(currentUser);
        currentUser.tracks.splice(index, 1);
        var userId = currentUser._id;
        UserService.updateUser(currentUser, function (response) {
            UserService.searchUserByUserId(userId, function (response) {
                $rootScope.currentUser = response;
                $scope.currentUser = response;
                currentUser = response;
                console.log(response);
                $scope.favTracks = currentUser.tracks;
            });
        });
    }

    $scope.removeAlbumFromFav = function (album) {
        var currentUser = $rootScope.currentUser;
        var index = $scope.favAlbums.indexOf(album);
        currentUser.albums.splice(index, 1);
        var userId = currentUser._id;
        UserService.updateUser(currentUser, function (response) {
            UserService.searchUserByUserId(userId, function (response) {
                $rootScope.currentUser = response;
                $scope.currentUser = response;
                currentUser = response;
                console.log(response);
                $scope.favAlbums = currentUser.albums;
            });
        });
    }

    $scope.removeArtistFromFav = function (artist) {
        var currentUser = $rootScope.currentUser;
        var index = $scope.favArtists.indexOf(artist);
        currentUser.artists.splice(index, 1);
        var userId = currentUser._id;

        UserService.updateUser(currentUser, function (response) {
            UserService.searchUserByUserId(userId, function (response) {
                $rootScope.currentUser = response;
                $scope.currentUser = response;
                currentUser = response;
                console.log(response);
                $scope.favArtists = currentUser.artists;
            });
        });
    }

    $scope.viewArtistData = function (artist) {
        var favArtist = null;
        SearchService.searchArtistById(artist.id, function (response) {
            favArtist = response;
            var modalInstance = $modal.open({
                templateUrl: 'artistDetails.html',
                controller: "ArtistModalController",
                size: 'sm',
                resolve: {
                    favArtist: function () {
                        return favArtist;
                    }
                }
            });
        });
    }

    $scope.viewTrackData = function (track) {
        var favTrack = null;
        SearchService.searchTrackById(track.id, function (response) {
            favTrack = response;
            var modalInstance = $modal.open({
                templateUrl: 'trackDetails.html',
                controller: "TrackModalController",
                size: 'sm',
                resolve: {
                    favTrack: function () {
                        return favTrack;
                    }
                }
            });
        });
    }

    $scope.viewAlbumData = function (album) {
        var favAlbum = null;
        SearchService.searchAlbumById(album.id, function (response) {
            favAlbum = response;
            var modalInstance = $modal.open({
                templateUrl: 'albumDetails.html',
                controller: "AlbumModalController",
                size: 'sm',
                resolve: {
                    favAlbum: function () {
                        return favAlbum;
                    }
                }
            });
        });
    }

    $scope.addTrackToPlaylist = function (track) {
        var currentUser = $rootScope.currentUser;
        var userId = currentUser._id;
        PlaylistService.searchPlaylistByUserId(userId, function (response) {
            playlists = response;
            var modalInstance = $modal.open({
                templateUrl: 'playlistDetailsInProfiles.html',
                controller: "PlaylistModalInProfileController",
                resolve: {
                    playlists: function () {
                        return playlists;
                    },
                    track: function () {
                        return track;
                    }
                }
            });
        });
    }
});

app.controller("PlaylistModalInProfileController", function ($scope, $http, $modalInstance, playlists, track, PlaylistService) {
    $scope.playlists = playlists;
    $scope.playlistUpdated = false;
    console.log(track);
    $scope.done = function () {
        $modalInstance.close("Close");
    };

    $scope.updatePlaylistWithTrack = function (playlist) {
        var trackToBeUpdated = { name: track.name, id: track.id, preview_url: track.preview_url, external_url: track.external_url };
        playlist.tracks.push(trackToBeUpdated);
        PlaylistService.updatePlaylistWithTrack(playlist, function (response) {
            $scope.playlistUpdated = true;
        });
    }

    $scope.trackInPlaylist = function (playlist) {
        var tracks = playlist.tracks;
        for (var t in tracks) {        
            if (track.id == tracks[t].id) {
                return true;
            }
        }
        return false;
    }
});

app.controller("ArtistModalController", function ($scope, $modalInstance, favArtist) {
    $scope.favArtist = favArtist;
    console.log(favArtist);
    $scope.ok = function () {
        $modalInstance.close("Close");
    };
});

app.controller("AlbumModalController", function ($scope, $modalInstance, favAlbum) {
    $scope.favAlbum = favAlbum;
    console.log(favAlbum);
    $scope.ok = function () {
        $modalInstance.close("Close");
    };
});

app.controller("TrackModalController", function ($scope, $modalInstance, favTrack) {
    $scope.favTrack = favTrack;
    console.log(favTrack);
    $scope.ok = function () {
        $modalInstance.close("Close");
    };
});