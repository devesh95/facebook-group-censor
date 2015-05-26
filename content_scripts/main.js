var CENSOR_TAG = '<p class="censor"> <span style="background-color: #B33A3A; color: #fff">&nbsp;Warning!&nbsp;</span>&nbsp;This post has been censored.<a style="float:right" class="reset _42ft _4jy0 _4jy3 _517h _51sy" role="button">Show Anyway</a></p>';

var inputBox = "";
inputBox += "<div class=\"form-style-6\" style=\"width: inherit";
inputBox += "    height: 250px;\">";
inputBox += "      <h1 style=\"background: #3B5998;";
inputBox += "    padding: 15px 0;";
inputBox += "    font-size: 140%;";
inputBox += "    font-weight: 300;";
inputBox += "    text-align: center;";
inputBox += "    color: #fff;";
inputBox += "    \">Facebook Group Censor<\/h1>";
inputBox += "      <form style=\"font: 95% Arial, Helvetica, sans-serif;";
inputBox += "    max-width: 95%;";
inputBox += "    margin: 10px auto;";
inputBox += "    padding: 16px;";
inputBox += "    background: #F7F7F7;";
inputBox += "\">";
inputBox += "        <p style=\"font-size: 14px;";
inputBox += "    margin: 10px; margin-top:0;\">Whom do you want to personally censor? Enter names below.<\/p>";
inputBox += "        <input style=\"-webkit-transition: all 0.30s ease-in-out;";
inputBox += "    -moz-transition: all 0.30s ease-in-out;";
inputBox += "    -ms-transition: all 0.30s ease-in-out;";
inputBox += "    -o-transition: all 0.30s ease-in-out;";
inputBox += "    outline: none;";
inputBox += "    box-sizing: border-box;";
inputBox += "    -webkit-box-sizing: border-box;";
inputBox += "    -moz-box-sizing: border-box;";
inputBox += "    width: 100%;";
inputBox += "    background: #fff;";
inputBox += "    margin-bottom: 4%;";
inputBox += "    border: 1px solid #ccc;";
inputBox += "    padding: 3%;";
inputBox += "    color: #555; font-size: 10px;";
inputBox += "    font: 95% Arial, Helvetica, sans-serif;\" id=\"names\" type=\"text\" name=\"names\" placeholder=\"Devesh, Jashan, etc.\" \/>";
inputBox += "        <input style=\"box-sizing: border-box;";
inputBox += "    -webkit-box-sizing: border-box;";
inputBox += "    -moz-box-sizing: border-box;";
inputBox += "    width: 49%;";
inputBox += "    padding: 3%;";
inputBox += "    background: #3B5998;";
inputBox += "    border-bottom: 2px solid #0e1f5b;";
inputBox += "    border-top-style: none;";
inputBox += "    border-right-style: none;";
inputBox += "    border-left-style: none;    ";
inputBox += "    color: #fff;\" id=\"censor-on\" type=\"button\" value=\"Start Censoring\" \/>";
inputBox += "        <input style=\"box-sizing: border-box;";
inputBox += "    -webkit-box-sizing: border-box;";
inputBox += "    -moz-box-sizing: border-box;";
inputBox += "    width: 49%;";
inputBox += "    padding: 3%;";
inputBox += "    background: #3B5998;";
inputBox += "    border-bottom: 2px solid #0e1f5b;";
inputBox += "    border-top-style: none;";
inputBox += "    border-right-style: none;";
inputBox += "    border-left-style: none;    ";
inputBox += "    color: #fff;\" id=\"censor-off\" type=\"button\" value=\"Stop Censoring\" \/>";

inputBox += "      <\/form>";
inputBox += "    <\/div>";

var findPosts = function (name, censor) {
	if (!name || name === '') {
		return;
	}
	var posts = [];

	// create point of entry elements
	var wrapper_element_list =  $('.userContentWrapper');
	window.nodes = wrapper_element_list.length;

	if (censor) {
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
					if (spanElement.text().toLowerCase().indexOf(name.toLowerCase()) > -1) {
						// append the post element to the posts array.
						console.log(spanElement.text());
						posts.push(wrapperElem);
					}
				}
			});
		});
		console.log('Found ' + posts.length + ' posts by ' + name + ' to censor.');

		censorPostContent(posts);
	}
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

window.init = function (input) {
	if (!input) {
		return;
	}
	
	var names = input.split(',');
	for (var i = 0; i < names.length; i++) {
		findPosts(names[i].trim(), true);
	}

	$('.reset').on('click', function () {
		var post = $(this);
		var elem = $(post).parents('.userContentWrapper');
		var id  = elem.data('gt').fbstory;
		elem.children().last().remove();
		elem.find('.censor').each(function (index) {
			if (!window.content_list[id]) {
				location.reload();
			}
			$(this).replaceWith($(window.content_list[id].originalContent))
		});
		if (window.content_list[id].data) {
			elem.append($(window.content_list[id].data));
		}
		elem.append($(window.content_list[id].comments));
	});
};

// lifesaver 2AM code
window.onscroll = function () {
	var old = window.nodes;
	findPosts(window.name, false);
	if (old < window.nodes) {
		$('#censor-off').trigger('click');
		$('#censor-on').trigger('click');
	}
}

window.onload = window.onpageshow = function () {
    console.log('Running script on a Facebook group page.');

    if (!$('#pagelet_group_').children().first().hasClass('form-style-6')) {
    	$('#pagelet_group_').prepend(inputBox);
    }
	
	window.names = '';
	$('#censor-on').on('click', function () {
		$('.reset').trigger('click');
        window.init(window.names);
    });

    $('#censor-off').on('click', function () {
        $('.reset').trigger('click');
    });

    $("#names").on('keyup', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
		$("form").submit(function(e){
            return false;
		});
        var text = $('#names').val();
		window.names = text;
	});
};
