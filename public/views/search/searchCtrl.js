app.controller("SearchController", function ($scope, $http, $rootScope, SearchService, PlaylistService, UserService, $modal) {
    $scope.currentUser = $rootScope.currentUser;
    $scope.search = function () {
        $scope.showNoResultTerm = true;
        SearchService.searchTracks($scope.searchByTitle, function (response) {
            $scope.tracks = response.tracks.items;
        });
        SearchService.searchAlbums($scope.searchByTitle, function (response) {
            $scope.albums = response.albums.items;
        });
        SearchService.searchArtists($scope.searchByTitle, function (response) {
            $scope.artists = response.artists.items;
        });
    }

    $scope.removeTrack = function (track) {
        var index = $scope.tracks.indexOf(track);
        $scope.tracks.splice(index, 1);
    }

    $scope.removeAlbum = function (album) {
        var index = $scope.albums.indexOf(album);
        $scope.albums.splice(index, 1);
    }

    $scope.removeArtist = function (artist) {
        var index = $scope.artists.indexOf(artist);
        $scope.artists.splice(index, 1);
    }

    $scope.addTrackToFavorites = function (track) {
        var currentUser = $rootScope.currentUser;
        var trackToBeUpdated = { name: track.name, id: track.id, preview_url: track.preview_url, external_url: track.external_urls.spotify};
        currentUser.tracks.push(trackToBeUpdated);
        UserService.updateUser(currentUser, function (response) {
            console.log(response);
            $scope.currentUser = response;
        })
    }

    $scope.removeTrackFromFav = function (track) {
        var currentUser = $rootScope.currentUser;
        console.log(currentUser);
        for (var t in currentUser.tracks) {
            if (track.id == currentUser.tracks[t].id) {
                currentUser.tracks.splice(t, 1);
            }
        }
        console.log(currentUser);
        UserService.updateUser(currentUser, function (response) {
            UserService.searchUserByUserId(userId, function (response) {
                $rootScope.currentUser = response;
                $scope.currentUser = response;
                currentUser = response;
                console.log(response);
            });
        });
    }

    $scope.addAlbumToFavorites = function (album) {
        var currentUser = $rootScope.currentUser;
        var albumToBeUpdated = { name: album.name, id: album.id };
        currentUser.albums.push(albumToBeUpdated);
        UserService.updateUser(currentUser, function (response) {
            $scope.currentUser = response;
        })
    }

    $scope.removeAlbumFromFav = function (album) {
        var currentUser = $rootScope.currentUser;
        console.log(currentUser);
        for (var a in currentUser.albums) {
            if (album.id == currentUser.albums[a].id) {
                currentUser.albums.splice(a, 1);
            }
        }
        console.log(currentUser);
        UserService.updateUser(currentUser, function (response) {
            UserService.searchUserByUserId(userId, function (response) {
                $rootScope.currentUser = response;
                $scope.currentUser = response;
                currentUser = response;
                console.log(response);
            });
        });
    }

    $scope.addArtistToFavorites = function (artist) {
        var currentUser = $rootScope.currentUser;
        var artistToBeUpdated = { name: artist.name, id: artist.id };
        currentUser.artists.push(artistToBeUpdated);
        UserService.updateUser(currentUser, function(response){
            $scope.currentUser = response;
        })
    }

    $scope.removeArtistFromFav = function (artist) {
        var currentUser = $rootScope.currentUser;
        console.log(currentUser);
        for (var a in currentUser.artists) {
            if (artist.id == currentUser.artists[a].id) {
                currentUser.artists.splice(a, 1);
            }
        }
        console.log(currentUser);
        UserService.updateUser(currentUser, function (response) {
            UserService.searchUserByUserId(userId, function (response) {
                $rootScope.currentUser = response;
                $scope.currentUser = response;
                currentUser = response;
                console.log(response);
            });
        });
    }

    $scope.change = function (response) {
        $scope.showNoResultTerm = false;
    }

    $scope.trackInFav = function (track) {
        var currentUser = $rootScope.currentUser;
        var tracks = currentUser.tracks;
        for (var t in tracks) {
            if (track.id == tracks[t].id) {
                return true;
            }
        }
        return false;
    }

    $scope.albumInFav = function (track) {
        var currentUser = $rootScope.currentUser;
        var tracks = currentUser.tracks;
        for (var t in tracks) {
            if (track.id == tracks[t].id) {
                return true;
            }
        }
        return false;
    }

    $scope.albumInFav = function (album) {
        var currentUser = $rootScope.currentUser;
        var albums = currentUser.albums;
        for (var a in albums) {
            if (album.id == albums[a].id) {
                return true;
            }
        }
        return false;
    }

    $scope.artistInFav = function (artist) {
        var currentUser = $rootScope.currentUser;
        var artists = currentUser.artists;
        for (var a in artists) {
            if (artist.id == artists[a].id) {
                return true;
            }
        }
        return false;
    }

    $scope.addTrackToPlaylist = function (track) {
        var currentUser = $rootScope.currentUser;
        var userId = currentUser._id;
        PlaylistService.searchPlaylistByUserId(userId, function (response) {
            playlists = response;
            var modalInstance = $modal.open({
                templateUrl: 'playlistDetails.html',
                controller: "PlaylistModalController",
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

app.controller("PlaylistModalController", function ($scope, $http, $modalInstance, playlists, track, PlaylistService) {
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