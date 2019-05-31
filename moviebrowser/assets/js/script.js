"use strict";

// TMDB base API
const TMDB_API = "https://api.themoviedb.org/3{path}?api_key=4648af97d228f4eb504c1d05840743f3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

let state = {
    genresArray: [],
    searchTitle: "",
    pageNumber: 1
};

// handles responses from the fetch() API.
function handleResponse(response) {
    if (response.ok) {
        return response.json();
    } else {
        //iTunes API errors are sent
        //as a JSON object containing
        //an `errorMessage` property
        return response.json()
            .then(function (err) {
                throw new Error(err.errorMessage);
            });
    }
}

// handles errors that occur while fetching
function handleError(err) {
    console.error(err);
    alert(err);
}

// fetches movies based on genres from the TMDB API
function fetchMovies() {
    document.getElementById("movies").innerHTML = " ";
    let path = "/discover/movie";
    let page = "&page=" + state.pageNumber;
    let genres = "&with_genres=" + state.genresArray;
    let url = TMDB_API.replace("{path}", path) + page + genres;
    return fetch(url);
}

// fetches all the available genres from the TMDB API
function fetchGenres() {
    let path = "/genre/movie/list";
    let url = TMDB_API.replace("{path}", path);
    return fetch(url);
}

// fetches movies based on title search from the TMDB API
function fetchSearch() {
    document.getElementById("movies").innerHTML = " ";
    let path = "/search/movie";
    let page = "&page=" + state.pageNumber;
    let search = "&query=" + state.searchTitle;
    let url = TMDB_API.replace("{path}", path) + page + search;
    return fetch(url);
}

// fetches movie details for movie from given movie ID
function fetchMovieDetails(movieId) {
    let path = "/movie/" + movieId;
    let url = TMDB_API.replace("{path}", path);
    console.log(url);
    return fetch(url);
}

// creates a selectable genders list
function renderGenres(data) {
    document.getElementById("genres").innerHTML = " ";
    data.genres.forEach(function (genre) {
        let item = document.createElement("li");
        item.className = "list-group-item list-group-item-action";
        item.textContent = genre.name;
        document.getElementById("genres").appendChild(item);
        item.addEventListener("click", function () {
            document.getElementById("titleSearch").value = "";
            state.searchTitle = "";
            state.pageNumber = 1;
            if (item.className.includes("active")) {
                item.classList.remove("active");
                state.genresArray.splice(state.genresArray.indexOf(genre.id), 1);
            } else {
                item.classList.add("active");
                state.genresArray.push(genre.id);
            }
            discoverMovies();
        });
    });
}

// creates a movie card
function renderCard(movie) {
    let card = document.createElement("div");
    card.className = "card";
    let imgPath = movie.backdrop_path;
    let imgSrc = TMDB_IMG + "/w300" + imgPath;
    let img = card.appendChild(document.createElement("img"));
    img.className = "card-img-top";
    if (imgPath === null) {
        img.src = "assets/img/image-not-found.jpg";
    } else {
        img.src = imgSrc;
    }
    img.setAttribute("data-toggle", "modal");
    img.setAttribute("data-target", "#movieDetails");
    img.addEventListener("click", function () {
        fetchMovieDetails(movie.id)
            .then(handleResponse)
            .then(renderModal)
            .catch(handleError);
        document.getElementById("modalImg").src = "";
        document.getElementById("modalBody").childNodes.forEach(function (child) {
            child.textContent = "";
        })
    });
    let body = card.appendChild(document.createElement("div"));
    body.className = "card-body";
    let title = body.appendChild(document.createElement("h4"));
    title.className = "card-title text-primary";
    title.textContent = movie.title;
    title.setAttribute("data-toggle", "modal");
    title.setAttribute("data-target", "#movieDetails");
    title.addEventListener("click", function () {
        img.click();
    });
    let release = body.appendChild(document.createElement("h6"));
    release.className = "card-subtitle text-muted";
    release.textContent = movie.release_date.substring(0, 4);
    let description = body.appendChild(document.createElement("p"));
    description.className = "card-text clamp";
    description.textContent = movie.overview;
    description.id = movie.id;

    // creates the fade clamp for the card
    let readMore = body.appendChild(document.createElement("span"));
    readMore.textContent = "more";
    readMore.className = "more text-primary";
    readMore.addEventListener("click", function () {
        if (readMore.textContent === "more") {
            document.getElementById(movie.id).classList.remove("clamp");
            readMore.textContent = "less";
        } else {
            document.getElementById(movie.id).classList.add("clamp");
            readMore.textContent = "more";
        }
    });
    return card;
}

// creates the modal for movie details
function renderModal(movie) {
    document.getElementById("modalTitle").textContent = movie.original_title;
    if (movie.poster_path) {
        document.getElementById("modalImg").src = TMDB_IMG + "/w300" + movie.poster_path;
    } else {
        document.getElementById("modalImg").src = "";
    }
    if (movie.genres.length > 0) {
        document.getElementById("modalGenres").textContent = movie.genres[0].name;
        for (let i = 1; i < movie.genres.length; i++) {
            document.getElementById("modalGenres").textContent += ", " + movie.genres[i].name;
        }
    }
    if (movie.production_companies.length > 0) {
        document.getElementById("modalProductions").textContent = movie.production_companies[0].name;
        for (let i = 1; i < movie.production_companies.length; i++) {
            document.getElementById("modalProductions").textContent += ", " + movie.production_companies[i].name;
        }
    }
    document.getElementById("modalDate").textContent = movie.release_date;
    if (movie.tagline) {
        document.getElementById("tagline").textContent = "\"" + movie.tagline + "\"";
    }
    document.getElementById("modalDescription").textContent = movie.overview;
    document.getElementById("modalHomepage").textContent = movie.homepage;
    document.getElementById("modalHomepage").href = movie.homepage;
}

// creates all the movie cards and the current page number
function renderMovies(data) {
    let movies = data.results;
    let row = document.getElementById("movies");
    movies.forEach(function (movie) {
        row.appendChild(renderCard(movie));
    });
    let previousPage = document.getElementById("previous");
    let nextPage = document.getElementById("next");
    if (state.pageNumber < 2) {
        previousPage.disabled = true;
    }
    if (state.pageNumber === data.total_pages) {
        nextPage.disabled = true;
    }
    if (state.pageNumber > 1) {
        previousPage.disabled = false;
    }
    if (state.pageNumber < data.total_pages) {
        nextPage.disabled = false;
    }
    document.getElementById("page").textContent = state.pageNumber;
    document.getElementById("pageNumber").textContent = state.pageNumber + " of " + data.total_pages;
}

// creates an event for when user enters a search
function enterSearch() {
    let search = document.getElementById("searchBar");
    search.addEventListener("submit", function (e) {
        e.preventDefault();
        state.pageNumber = 1;
        state.genresArray = [];
        listGenres();
        state.searchTitle = document.getElementById("titleSearch").value;
        if (document.getElementById("titleSearch").value) {
            searchMovies();
        } else {
            discoverMovies();
        }
    });
}

// creates events for pagination
function changePage() {
    let previousPage = document.getElementById("previous");
    let nextPage = document.getElementById("next");
    previousPage.addEventListener("click", function () {
        state.pageNumber--;
        if (state.searchTitle === "") {
            discoverMovies();
        } else {
            searchMovies();
        }
    });
    nextPage.addEventListener("click", function () {
        state.pageNumber++;
        if (state.searchTitle === "") {
            discoverMovies();
        } else {
            searchMovies();
        }
    });
}

// completes getting discover movies 
function discoverMovies() {
    return fetchMovies()
        .then(handleResponse)
        .then(renderMovies)
        .catch(handleError);
}

// completes getting list of genres
function listGenres() {
    return fetchGenres()
        .then(handleResponse)
        .then(renderGenres)
        .catch(handleError);
}

// completes getting searched movies
function searchMovies() {
    return fetchSearch()
        .then(handleResponse)
        .then(renderMovies)
        .catch(handleError);
}

changePage();
listGenres();
discoverMovies();
enterSearch();