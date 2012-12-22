"use strict"
jQuery(document).ready(function() {
	var analyse = function() { 
		var tags = ['a', 'h1', 'h2', 'h3', 'p', 'div', 'li', 'span', 'b'];
		
		var lists = {};
		
		jQuery.each(tags, function(key, tag) {
			lists[tag] = jQuery(tag).map(function(index, elem) {
				var e = jQuery(elem),
					text = jQuery.trim(e.clone().children().remove().end().text());
				var result = {
					elem: e,
					text: text,
				};
				return result.text.length > 20 ? result : undefined;
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
		jQuery.each(links, function(idx, link) {
			if (Math.random() > 0.5) {
				link.elem.append(' - ' + choice(FEFE_LINK_WARNINGS));
			}
		});
	}

	function augment_storys(storys) {
		jQuery.each(storys, function(idx, story) {
			if (Math.random() > 0.3) {
				jQuery(jQuery(story.elem).contents().filter(function() {
					return 3 == this.nodeType;
				}).first()).replaceWith(function() {
					if (Math.random() > 0.8) {
						return choice(FEFE_PREFIX_QUOTES) + jQuery(this).text();
					}
					else
						return jQuery(this).text() + choice(FEFE_POSTFIX_QUOTES);
				});
			}
		});
	}
	
	jQuery.each(results, function(key, val) {
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
	jQuery('body').append('<div align="right" style="position:relative;bottom:-100px;clear:both;z-index:9001;padding:6px;">Proudly made without PHP, Java, Perl, MySQL and Postgres...<br>...dafür mit dietlibc, libowfat, unter gatling laufend und mit einem tinyldap-Backend.</div>');
});
