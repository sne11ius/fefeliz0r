"use strict"
var values = {};

jQuery(document).ready(function() {

	var analyse = function() { 
		//var tags = ['a'];
		var tags = ['a', 'h1', 'h2', 'h3', 'p', 'div', 'li', 'span', 'b'];
		
		var lists = {};
		
		jQuery.each(tags, function(key, tag) {
			lists[tag] = $(tag).map(function(index, elem) {
				var e = $(elem),
					text = $.trim(e.clone().children().remove().end().text()),
					area = e.outerWidth() * e.outerHeight();
				var result = {
					elem: e,
					width: e.outerWidth(),
					height: e.outerHeight(),
					top: e.offset().top,
					left: e.offset().left,
					offset: e.offset(),
					position: e.position(),
					area: area, 
					text: text,
					ratio: text.length / area,
				};
				return isFinite(result.ratio) && result.text.length > 20 && 0 != result.ratio ? result : undefined;
			}).get();
		});
		
		var storyThreshold = 60;
		var storys = [];
		var headlines = [];
		var links = [];
		
		for (var j = 0; j < tags.length; ++j) {
			var tag = tags[j];
			var list = lists[tag];
			for (var i = 0; i < list.length; ++i) {
				if (list[i].text.length > storyThreshold)
					storys.push(list[i]);
				else
					if ('a' == tag)
						links.push(list[i]);
					else
						headlines.push(list[i]);
			}
		}
		
		return {
			'storys': storys,
			'headlines': headlines,
			'links': links
		};
	}
	
	var results = analyse();
	
	function choice(array) {
		return array[Math.floor(Math.random() * array.length)];
	}
	
	function show(elem, header) {
		elem.elem.css('border', '1px dashed red');
	}
	
	function augment_links(links) {
		$.each(links, function(idx, link) {
			if (Math.random() > 0.5) {
				link.elem.append(' - ' + choice(FEFE_LINK_WARNINGS));
				//show(link, 'link');
			}
		});
	}

	function augment_storys(storys) {
		$.each(storys, function(idx, story) {
			if (Math.random() > 0.3) {
				$($(story.elem).contents().filter(function() {
					return 3 == this.nodeType;
				}).first()).replaceWith(function() {
					return $(this).text() + choice(FEFE_POSTFIX_QUOTES);
				});
				//show(story, 'story');
			}
		});
	}
	
	$.each(results, function(key, val) {
		switch(key) {
		case 'storys':
			augment_storys(val);
			break;
		case 'headlines':
			augment_links(val);
			break;
		case 'links':
			augment_links(val);
			break;
		}
	});
});
