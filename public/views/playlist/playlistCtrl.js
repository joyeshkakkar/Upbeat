app.controller("PlaylistController", function ($scope, $http, $rootScope, $modal, PlaylistService, UserService, FollowerService) {
    var currentUser = $rootScope.currentUser;
    $scope.currentUser = currentUser;
    $scope.isCollapsed = true;     
    console.log(currentUser);

    $scope.addComment = function (playlist, inputComment,form) {
        var currentUser = $rootScope.currentUser;
        console.log(playlist);
        console.log(currentUser);
        var commentText = inputComment.commentText;
        console.log(commentText);
        console.log(form);
        //console.log($scope.form);

        var commentToBeAdded = { userId: currentUser._id, firstName: currentUser.firstName, lastName: currentUser.lastName, commentText: commentText };
        console.log(commentToBeAdded);
        playlist.comments.push(commentToBeAdded);
        PlaylistService.updatePlaylistWithComment(playlist, function (response) {
            console.log(response);
            $scope.playlist = response;
            $scope.playlistUpdated = true;
            $scope.inputCommentFrmPub = {};
            console.log($scope.inputCommentFrmPub);
        });
    }

    if ($rootScope.currentUser != null) {
        var userId = currentUser._id;
        UserService.searchUserByUserId(userId, function (response) {
            $rootScope.currentUser = response;
            $scope.currentUser = response;
            console.log(response);
        });

        PlaylistService.searchPlaylistByUserId(userId, function (response) {
            console.log(response);
            $scope.ownPlaylists = response;
        });

        PlaylistService.searchPlaylistExcludingAUserId(userId, function (response) {
            $scope.publishedPlaylists = response;
            console.log(response);
        });

        FollowerService.followedPlaylist(userId, function (response) {
            console.log(response);
            $scope.followedPlaylists = response;
        });
    }

    $scope.deletePlaylist = function (playlist) {
        var currentUser = $rootScope.currentUser;
        var userId = currentUser._id;
        PlaylistService.deletePlaylist(playlist, function (response) {
            console.log(response);
            PlaylistService.searchPlaylistByUserId(userId, function (response) {
                $scope.ownPlaylists = response;
                console.log(response);
            });
        });
    }
       
    /*To add a new playlist*/
    $scope.savePlaylist = function () {
        var currentUser = $rootScope.currentUser;
        console.log(currentUser);
        var playlist = { name: $scope.playlistName, userId: currentUser._id };
        PlaylistService.savePlaylist(playlist, function (response) {
            PlaylistService.searchPlaylistByUserId(userId, function (response) {
                $scope.ownPlaylists = response;
            });
            $scope.isCollapsed = true;
            $scope.playlistName = null;
        });
    }

    $scope.followPlaylist = function (publishedPlaylist) {
        var currentUser = $rootScope.currentUser;
        console.log(currentUser);
        var follower = { playlistId: publishedPlaylist._id, followerUserId: currentUser._id };
        FollowerService.followPlaylist(follower, function (response) {
            console.log(response);
            PlaylistService.searchPlaylistExcludingAUserId(userId, function (response) {
                $scope.publishedPlaylists = response;
                console.log(response);
            });
            FollowerService.followedPlaylist(userId, function (response) {
                console.log(response);
                $scope.followedPlaylists = response;
            });
            $scope.isCollapsed = true;
            $scope.playlistName = null;
        });
    }

    $scope.unfollowPlaylist = function (followedPlaylist) {
        var currentUser = $rootScope.currentUser;
        console.log(currentUser);
        console.log(followedPlaylist);
        var follower = { playlistId: followedPlaylist._id, followerUserId: currentUser._id };
        console.log(follower);
        FollowerService.unfollowPlaylist(follower, function (response) {
            console.log(response);
            FollowerService.followedPlaylist(userId, function (response) {
                console.log(response);
                $scope.followedPlaylists = response;
            });
            PlaylistService.searchPlaylistExcludingAUserId(userId, function (response) {
                $scope.publishedPlaylists = response;
                console.log(response);
            });
            $scope.isCollapsed = true;
            $scope.playlistName = null;
        });
    }

    $scope.publishPlaylist = function (playlist) {
        console.log(playlist);
        var playlist =  { _id: playlist._id, name: playlist.name, tracks: playlist.tracks, comments: playlist.comments, publish: true, userId: playlist.userId, addedOn: playlist.addedOn};
        PlaylistService.publishUnpublishPlaylist(playlist, function (response) {
            console.log(response);
            PlaylistService.searchPlaylistByUserId(userId, function (response) {
                $scope.ownPlaylists = response;
                console.log(response);
            })
            $scope.isCollapsed = true;
            $scope.playlistName = null;
        });
    }

    $scope.editPlaylistName = function (playlist) {
        console.log(playlist);
        //var currentUser = $rootScope.currentUser;
        //var userId = currentUser._id;

        var modalInstance = $modal.open({
            templateUrl: 'playlistName.html',
            controller: "PlaylistNameModalController",
            size: 'sm',
            resolve: {
                playlist: function () {
                    return playlist;
                }
            }
        });

        modalInstance.result.then(function () {
            PlaylistService.searchPlaylistByUserId(userId, function (response) {
                $scope.ownPlaylists = response;
                console.log(response);
            })
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });    
    }

    $scope.showFollowers = function (playlist) {
        console.log(playlist);
        playlistId = playlist._id;
        $scope.open = false;
        FollowerService.searchFollowersForPlaylist(playlistId, function (response) {
            $scope.isCollapsed = true;
            $scope.playlistName = null;
            followers = response;
            console.log(followers);            
            var modalInstance = $modal.open({
                templateUrl: 'followers.html',
                controller: "FollowerModalController",
                size: 'sm',
                resolve: {
                    followers: function () {
                        return followers;
                    }
                }
            });

            modalInstance.result.then(function () {
                PlaylistService.searchPlaylistByUserId(userId, function (response) {
                    $scope.ownPlaylists = response;
                    console.log(response);
                })
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        });
    }

    $scope.unpublishPlaylist = function (playlist) {
        var playlist = { _id: playlist._id, name: playlist.name, tracks: playlist.tracks, comments: playlist.comments, publish: false, userId: playlist.userId, addedOn: playlist.addedOn };
        PlaylistService.publishUnpublishPlaylist(playlist, function (response) {
            console.log(response);
            PlaylistService.searchPlaylistByUserId(userId, function (response) {
                $scope.ownPlaylists = response;
                console.log(response);
            })
            $scope.isCollapsed = true;
            $scope.playlistName = null;
        });
    }

    

    $scope.updateComment = function (playlist, inputComment) {
        var currentUser = $rootScope.currentUser;
        console.log(playlist);
        console.log(currentUser);
        var commentText = inputComment.commentText;
        console.log(commentText);

        var index = playlist.comments.indexOf(inputComment);
        playlist.comments.splice(index, 1);
        PlaylistService.updatePlaylistWithComment(playlist, function (response) {
            console.log(response);
            $scope.playlist = response;
        });

        var commentToBeAdded = { userId: currentUser._id, firstName: currentUser.firstName, lastName: currentUser.lastName, commentText: commentText };
        console.log(commentToBeAdded);
        playlist.comments.push(commentToBeAdded);
        PlaylistService.updatePlaylistWithComment(playlist, function (response) {
            console.log(response);
            $scope.playlist = response;
            $scope.playlistUpdated = true;
            $scope.editable = false;
        });
    }



    $scope.deleteComment = function (playlist, comment) {
        var currentUser = $rootScope.currentUser;
        console.log(playlist);
        console.log(currentUser);
        console.log(comment);

        var index = playlist.comments.indexOf(comment);
        playlist.comments.splice(index, 1);
        PlaylistService.updatePlaylistWithComment(playlist, function (response) {
            console.log(response);
            $scope.playlist = response;
            $scope.playlistUpdated = true;
        });
    }

    $scope.editComment = function (playlist, comment) {
        var currentUser = $rootScope.currentUser;
        console.log(playlist);
        console.log(currentUser);
        console.log(comment);
        console.log($scope.editable);
        $scope.editable = true;
        $scope.commentId = comment._id;
    }

    $scope.removeTrackFromPlaylist = function (track, playlist) {
        console.log(track);
        console.log(playlist);
        var index = playlist.tracks.indexOf(track);
        playlist.tracks.splice(index, 1);
        PlaylistService.updatePlaylistWithTrack(playlist, function (response) {
            console.log(response);
            $scope.playlist = response;
            $scope.playlistUpdated = true;
        });
    }

    $scope.cancel = function () {
        $scope.isCollapsed = true;
        $scope.playlistName = null;
    }

    $scope.show = function () {
        $scope.isCollapsed = false;
    }

});


app.controller("FollowerModalController", function ($scope, $modalInstance, followers) {
    $scope.isCollapsed = true;
    $scope.playlistName = null;
    $scope.followers = followers;
    console.log(followers);
    $scope.ok = function () {
        $modalInstance.close("Close");
        $scope.isCollapsed = true;   
    };
});

app.controller("PlaylistNameModalController", function ($scope, $rootScope, $modalInstance, playlist, PlaylistService) {
    var currentUser = $rootScope.currentUser;
    var userId = currentUser._id;
    $scope.isCollapsed = true;
    $scope.playlistName = null;    
    console.log(playlist);
    $scope.playlistName = playlist.name;

    $scope.save = function (playlistName) {
        console.log(playlistName);
        var playlistToBeUpdated = { _id: playlist._id, name: playlistName, tracks: playlist.tracks, comments: playlist.comments, publish: playlist.publish, userId: playlist.userId, addedOn: playlist.addedOn };
        PlaylistService.updatePlaylistName(playlistToBeUpdated, function (response) {
            console.log(response);
        });
        $modalInstance.close("Close");
    };

    $scope.cancel = function () {
        $modalInstance.close("Close");
        $scope.isCollapsed = true;
    };
});