// we're going to do most of the work in here.

// TODO: find the HTML container for posts in the group by ID


var findPosts = function (name) {
	var wrapper_element_list =  $('.userContentWrapper');
	var posts = [];

	wrapper_element_list.each(function (index) {
		var wrapperElem = $(this);
		var span_element_list = wrapperElem.find('span');

		span_element_list.each.each(function (index) {
			var spanElement = $(this);
			if (spanElement.text().indexOf(name) > -1) {
				posts.push(wrapperElem);
			}
		});
	});
};


// TODO: take in input through a floating dialog box

// TODO: filter by name, hopefully there's a common class 

// TODO: remove parent container for each posts
