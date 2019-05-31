describe("report functions", function() {
    var expect = chai.expect;

    describe("getTitle", function() {
        it("should return the correct property", function() {
            var movie = {title: "Test Title"};
            var title = getTitle(movie);
            expect(title).to.be.a("string");
            expect(title).to.equal(movie.title);
        });
        it("should return `(no title)` if input has no title property or is null/undefined", function() {
            expect(getTitle({})).to.equal("(no title)");
            expect(getTitle(null)).to.equal("(no title)");
            expect(getTitle(undefined)).to.equal("(no title)");
        });
    });

    describe("getYearReleased", function() {
        it("should return just the year", function() {
            var movie = {released: "2017-01-02"};
            var year = getYearReleased(movie);
            expect(year).to.be.a("number");
            expect(year).to.equal(2017);
        });
        it("should return undefined if there is no `released` property", function() {
            expect(getYearReleased({})).to.be.undefined;
        });
        it("should return undefined if input is null or undefined", function() {
            expect(getYearReleased(null)).to.be.undefined;
            expect(getYearReleased(undefined)).to.be.undefined;            
        });
    });

    describe("getCitation", function() {
        it("should return a correctly formatted value", function() {
            var movie = {title: "test title", released: "2017-01-02"};
            var titleAndYear = getCitation(movie);
            expect(titleAndYear).to.be.a("string")
            expect(titleAndYear).to.equal("test title (2017)");
        });
        it("should handle missing properties", function() {
            expect(getCitation({title: "test title"})).to.equal("test title");
            expect(getCitation({released: "2017-01-02"})).to.equal("(no title) (2017)");
            expect(getCitation({})).to.equal("(no title)");
        });
        it("should return `(no title)` if input is null or undefined", function() {
            expect(getCitation(null)).to.equal("(no title)")
            expect(getCitation(undefined)).to.equal("(no title)")
        });
    });

    describe("getAvgTicketPrice", function() {
        it("should return the correct value", function() {
            var movie = {gross: 100, tickets: 10};
            var avgPrice = getAvgTicketPrice(movie);
            expect(avgPrice).to.be.a("number");
            expect(avgPrice).to.equal(10);
        });
        it("should return NaN if `gross` or `tickets` is missing", function() {
            expect(getAvgTicketPrice({gross: 100})).to.be.NaN;
            expect(getAvgTicketPrice({tickets: 10})).to.be.NaN;
            expect(getAvgTicketPrice({})).to.be.NaN;
        });
        it("should return undefined if input is null or undefined", function() {
            expect(getAvgTicketPrice(null)).to.be.undefined;
            expect(getAvgTicketPrice(undefined)).to.be.undefined;
        });
    });

    describe("totalTicketsSold", function() {
        it("should return correct total for movies array", function() {
            var total = totalTicketsSold(MOVIES);
            expect(total).to.be.a("number");
            expect(total).to.equal(1300786809);
        });
        it("should return zero for an empty array", function() {
            expect(totalTicketsSold([])).to.equal(0);            
        });
        it("should return zero for an array with objects that have no `gross` values", function() {
            expect(totalTicketsSold([{}])).to.equal(0);
        });
    });

    describe("allCitations", function() {
        it("should return citations for each movie in the array", function() {
            var results = allCitations(MOVIES);
            expect(results).to.be.an("array");
            expect(results).to.have.length(MOVIES.length);
            expect(results[0]).to.be.a("string");
            expect(results[0]).to.equal(getCitation(MOVIES[0]));
        });
        it("should return an empty array for an empty input array", function() {
            var results = allCitations([])
            expect(results).to.be.an("array")
            expect(results).to.have.length(0);
        });
    });

    describe("topGrossingMovie", function() {
        it("should return correct movie from movies array", function() {
            var top = topGrossingMovie(MOVIES);
            expect(top).to.be.an("object");
            expect(top).to.include({
                "title":"Finding Dory",
                "released":"2016-06-17",
                "distributor":"Walt Disney",
                "genre":"Adventure",
                "rating":"PG",
                "gross":486295561,
                "tickets":56219140
            });
        });
        it("should return undefined for an empty array", function() {
            expect(topGrossingMovie([])).to.be.undefined;
        });
    });

    describe("onlyDisneyMovies", function() {
        it("should return correct results from movies array", function() {
            var disney = onlyDisneyMovies(MOVIES);
            expect(disney).to.be.an("array");
            expect(disney).to.have.length(17);
            expect(disney[0]).to.be.an("object");
        });
        it("should return an empty array for an empty input array", function() {
            var disney = onlyDisneyMovies([]);
            expect(disney).to.be.an("array");
            expect(disney).to.have.length(0);
        });
    });

    describe("top10DisneyMovies", function() {
        it("should return correct results from movies array", function() {
            var topDisney = top10DisneyMovies(MOVIES);
            expect(topDisney).to.be.an("array");
            expect(topDisney).to.have.length(10);
            expect(topDisney[0].title).to.equal("Finding Dory");
            expect(topDisney[9].title).to.equal("Pete’s Dragon");
        });
        it("should return an empty array for an empty input array", function() {
            var topDisney = top10DisneyMovies([]);
            expect(topDisney).to.be.an("array");
            expect(topDisney).to.have.length(0);            
        });
    });

    describe("top10Comedies", function() {
        it("should return correct results from movies array", function() {
            var topComedy = top10Comedies(MOVIES);
            expect(topComedy).to.be.an("array");
            expect(topComedy).to.have.length(10);
            expect(topComedy[0]).to.be.an("object");
            expect(topComedy[0].title).to.equal("Ghostbusters");
            expect(topComedy[9].title).to.equal("Neighbors 2: Sorority Rising");
        });
        it("should return an empty array for an empty input array", function() {
            var topComedy = top10Comedies([]);
            expect(topComedy).to.be.an("array");
            expect(topComedy).to.have.length(0);
        });
    });

    describe("distinctDistributors", function() {
        it("should return the correct number of distributors", function() {
            var results = distinctDistributors(MOVIES);
            expect(results).to.be.an("array");
            expect(results).to.have.length(155);
            expect(results[0]).to.be.a("string");
        });
        it("should return `(none)` for a missing or blank distributor", function() {
            var results = distinctDistributors([{}]);
            expect(results).to.be.an("array");
            expect(results).to.have.length(1);
            expect(results[0]).to.be.a("string");
            expect(results[0]).to.equal("(none)");
        });
        it("should return an empty array for an empty input array", function() {
            var results = distinctDistributors([]);
            expect(results).to.be.an("array");
            expect(results).to.have.length(0);
        });
    });

    describe("countByRating", function() {
        it("should return the correct ratings and counts from the movies array", function() {
            var results = countByRating(MOVIES);
            expect(results).to.be.an("object");
            expect(results).to.include({
                "Not Rated": 365,
                G: 10,
                PG: 61,
                "PG-13": 137,
                R: 222,
                "NC-17": 2,
            });
        });
        it("should return an empty object for an empty input array", function() {
            var results = countByRating([]);
            expect(results).to.be.an("object");
            expect(results).to.be.empty;
        });
    });

    describe("grossByGenre", function() {
        it("should return correct results from the movies array", function() {
            var results = grossByGenre(MOVIES);
            expect(results).to.be.an("array");
            expect(results).to.have.length(14);
            expect(results[0]).to.be.an("object");
            expect(results[0]).to.have.property("genre");
            expect(results[0].genre).to.equal("Adventure");
            expect(results[0]).to.have.property("gross");
            expect(results[0].gross).to.equal(4541916818);
            expect(results).to.have.deep.ordered.members([
                {genre: "Adventure", gross: 4541916818},
                {genre: "Action", gross: 2296781414},
                {genre: "Comedy", gross: 1444758242},
                {genre: "Drama", gross: 1375796232},
                {genre: "Thriller/Suspense", gross: 658272103},
                {genre: "Horror", gross: 479704769},
                {genre: "Western", gross: 147173775},
                {genre: "Romantic Comedy", gross: 137174695},
                {genre: "Documentary", gross: 50795237},
                {genre: "Black Comedy", gross: 48370932},
                {genre: "Musical", gross: 38826256},
                {genre: "Concert/Performance", gross: 27211033},
                {genre: "Multiple Genres", gross: 2862219},
                {genre: "(none)", gross: 2165576}
            ]);
        });
        it("should return an empty array for an empty input array", function() {
            var results = grossByGenre([]);
            expect(results).to.be.an("array");
            expect(results).to.have.length(0);
        });
    });

    //TESTS FOR EXTRA CREDIT FUNCTIONS
    describe("ticketsByRating", function() {
        it("should return the correct results from the movies array", function() {
            var results = ticketsByRating(MOVIES);
            expect(results).to.be.an("array");
            expect(results).to.have.length(6);
            expect(results[0]).to.be.an("object");
            expect(results).to.have.deep.ordered.members([
                {rating: "G", tickets: 1582462},
                {rating: "PG", tickets: 353315435},
                {rating: "PG-13", tickets: 631716454},
                {rating: "R", tickets: 303319819},
                {rating: "NC-17", tickets: 4106},
                {rating: "Not Rated", tickets: 10848533}
            ]);
        });
    });

    describe("oldest10", function() {
        it("should return the correct results from the movies array", function() {
            var results = oldest10(MOVIES);
            expect(results).to.be.an("array");
            expect(results).to.have.length(10);
            expect(results[0]).to.be.an("object");
            expect(results[0]).to.have.property("title")
            expect(results[0]).to.have.property("releasedFromNow");
            expect(results[0]).to.include({
                title: "Elevator to the Gallows",
                releasedFromNow: "56 years ago",
                gross: 110193,
                tickets: 12739
            });
        });
    });
});
