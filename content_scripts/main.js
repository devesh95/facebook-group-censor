var CENSOR_TAG = '<p class="sensor"> <span style="background-color: #B33A3A; color: #fff">&nbsp;Warning!&nbsp;</span>&nbsp;This post has been censored.<a style="float:right" class="reset _42ft _4jy0 _4jy3 _517h _51sy" role="button">Show Anyway</a></p>';

var findPosts = function (name) {
	var posts = [];

	// create point of entry elements
	var wrapper_element_list =  $('.userContentWrapper');

	// process through each entry element
	wrapper_element_list.each(function (index) {
		var wrapperElem = $(this);
		// find span tags nested within each wrapper element
		var span_element_list = wrapperElem.find('span');

		// process through each span element
		span_element_list.each(function (index) {
			var spanElement = $(this);

			if (isPost(spanElement)) {
				// check if the span text contains (vs exact match?) the input name
				if (spanElement.text().indexOf(name) > -1) {
					// append the post element to the posts array.
					console.log(spanElement.text());
					posts.push(wrapperElem);
				}
			}
		});
	});
	console.log('Found ' + posts.length + ' posts by ' + name + ' to censor.');
	censorPostContent(posts);
};

var isPost = function (elem) {
	var ignore = ['UFILikeSentenceText', 'UFICommentActorName', 'UFICommentContent'];
	for (var i = 0; i < ignore.length; i++) {
		if (elem.parent().hasClass(ignore[i])) {
			return false;
		}
	}
	return true;
};

var censorPostContent = function (posts) {
	// log content data for restoration.
	window.content_list = {};

	for (var i = 0; i < posts.length; i++) {
		var elem = $(posts[i]);
		elem.find('div.userContent > p').each(function (index) {
			var contentTag = $(this);

			// logging content data
			var id  = elem.data('gt').fbstory;

			if (!window.content_list[id]) {
				window.content_list[id] = {
					originalContent: contentTag,
					data: null,
					comments: $(elem).children().last()
				};

				if ($(elem).children().last().prev().children().first().data('ft') !== undefined && $(elem).children().last().prev().children().first().data('ft').tn === 'H') {
					window.content_list[id].data = $(elem).children().last().prev();
					$(elem).children().last().prev().remove();
				}

				// replace text with censor tag
				$(this).replaceWith(CENSOR_TAG);
			}
		});
	}
    console.log(window.content_list);
};

window.onload = function() {
	console.log('Running script on a Facebook group page.');
	// run using local storage data
	findPosts('');

	$('.reset').on('click', function () {
		var post = $(this);
		var elem = $(post).parents('.userContentWrapper');
		var id  = elem.data('gt').fbstory;
		elem.children().last().remove();
		elem.find('.sensor').each(function (index) {
			console.log($(this).text());
			$(this).replaceWith($(window.content_list[id].originalContent))
		});
		if (window.content_list[id].data) {
			elem.append($(window.content_list[id].data));
		}
		elem.append($(window.content_list[id].comments));
	});
};


// TODO: take in input through a floating dialog box
