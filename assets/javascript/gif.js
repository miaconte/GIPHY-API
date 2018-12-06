
var topics = ["New Girl", "The Office", "Game of Thrones", "Greys Anatomy", "Anne with an E", "Breaking Bad", "Stranger Things", "House of Cards", "The Crown", "Mindhunter"];
var tvImage = "";

function showButtons () {
    $("#buttonItems").empty();
    $("#subInput").val("");

    for (var i = 0; i < topics.length; i++) {
        var button = $("<button class='btn btn-primary'>");
        button.addClass("show");
        button.attr("show-name", topics[i]);
        button.text(topics[i]);
        $("#buttonItems").append(button);
        $("#buttonItems").append(" ");
    }
}

showButtons();

$("#addyours").on("click", function(event) {
    $("#entry").empty();
    event.preventDefault();
    var tvShow = $("#subInput").val().trim();
    var noShow = $(this).attr("show-name");

    
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + tvShow + "&limit=2&api_key=dc6zaTOxFJmzC";

        $.ajax({ url: queryURL, method: "GET"}).done(function(response) {

        if (response.pagination.total_count >= 10) {
            topics.push(tvShow);
            showButtons(); }
        else if (response.pagination.total_count === 0) {
            $("#entry").html(" Sorry, no results."); }
        else if (response.pagination.total_count === 1) { $("#entry").html(" We didn't find much on that one, try another."); }
        else { $("#entry").html(" Sorry, there were only " + response.pagination.total_count + " result, try another?"); }
        $("#subInput").val("");
        });

});

$(document).on("click", ".show", display);

function display() {

    // This is just to clear out any error message (if there is one)
    $("#entry").empty();

    var noShow = $(this).attr("show-name");

    // The GIPHY query.  This limits to 10 results
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + noShow + "&limit=10&api_key=dc6zaTOxFJmzC";

    $.ajax({ url: queryURL, method: "GET"}).done(function(response) {

        // This runs 10 times (limit is 10 in query) to show all the GIPHY pictures from the website's response.
        for (var j = 0; j < response.data.length; j++) {
            
            // Gets the animated gif URL
            var active = response.data[j].images.fixed_width.url;
            // Gets the still gif URL
            var still = response.data[j].images.fixed_width_still.url;
            var rating = "Rating: " + (response.data[j].rating).toUpperCase();
            var tvImage = $("<img>");
            
            $("#ratings").css("color", "maroon");

            // This creates a new div for the rating so that it maintains the gifs size
            var ratingDiv = $("<div id='ratingDiv'>" + rating + "</div>");
            $(ratingDiv).css({"text-align":"center", "font-size":"20px", "width":"200", "display":"block"});

            tvImage.attr({"active":active, "still":still, "src":still, "state":"still"});

            // This holds the new div for both rating and the image. Every image will have a rating on top of it.
            var ratingAndImage = $("<div>");
            $(ratingAndImage).css({"float":"left"});
            $(ratingAndImage).prepend(ratingDiv, tvImage);

            $("#ratings").prepend(ratingAndImage);
            $(tvImage).on("click", function(event) {

                // error message
                $("#entry").empty();
                
                var state = $(this).attr("state");
                var source = $(this).attr("src");

                if (state === "still") {
                $(this).attr("src", $(this).attr("active"));
                $(this).attr("state", "active"); }
                else {
                $(this).attr("src", $(this).attr("still"));
                $(this).attr("state", "still"); } 
            });

        }

   });

}