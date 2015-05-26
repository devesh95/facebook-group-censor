// we're going to do most of the work in here.

// TODO: find the HTML container for posts in the group by name
// COMPLETE

var findPosts = function (name) {
	var posts = [];

	// create point of entry elements
	var wrapper_element_list =  $('div#contentArea > div.userContentWrapper');

	// process through each entry element
	wrapper_element_list.each(function (index) {
		var wrapperElem = $(this);
		// find span tags nested within each wrapper element
		var span_element_list = wrapperElem.find('span');

		// process through each span element
		span_element_list.each.each(function (index) {
			var spanElement = $(this);
			// check if the span text contains (vs exact match?) the input name
			if (spanElement.text().indexOf(name) > -1) {
				// append the post element to the posts array.
				posts.push(wrapperElem);
			}
		});
	});
};


// TODO: take in input through a floating dialog box

// TODO: filter by name, hopefully there's a common class 

// TODO: remove parent container for each posts
