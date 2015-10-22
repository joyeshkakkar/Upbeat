app.controller("UpbeatController", function ($scope, $http) {
    $scope.searchTracks = function () {
        var title = $scope.searchByTitle;
        $http.get("https://api.spotify.com/v1/search?q=" + title + "&type=track&limit=1")
        .success(function (response) {
            console.log(response.tracks.items[0].artists[0].name);
            $scope.tracks = response.tracks.items;
        })
    }

    $scope.removeTrack = function (track) {
        var index = $scope.tracks.indexOf(track);
        $scope.tracks.splice(index, 1);
    }


    /*$scope.favoriteMovies = [];

    $scope.addToFavorites = function (movie) {
        $scope.favoriteMovies.push(movie);
    }

    

    $scope.addMovie = function () {
        var newMovie = {
            title: $scope.movie.title,
            rating: $scope.movie.rating,
            year: $scope.movie.year,
            plot: $scope.movie.plot
        };
        $scope.movies.push(newMovie);
    }
        
    $scope.selectMovie = function (movie) {
        $scope.movie = movie;
    }

    $scope.updateMovie = function () {
        alert($scope.movie.title);
    }*/
});