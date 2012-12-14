"use strict"
var values = {};

jQuery(document).ready(function() {

	function getStyle(el, styleProp) {
		if (el.currentStyle) {
			return el.currentStyle[styleProp];
		} else if (document.defaultView && document.defaultView.getComputedStyle) {
			var computedStyle = document.defaultView.getComputedStyle(el, null)
			if (computedStyle)
				return computedStyle.getPropertyValue(styleProp);
		} else {
			return el.style[styleProp];
		}
	}

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
				fontSize: getStyle(e, 'fontSize')
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
	
	lists = {
		'storys': storys,
		'headlines': headlines,
		'links': links
	};
	console.log(lists);
	tags = ['storys', 'headlines', 'links'];
	console.log(tags);
	
	for (var j = 0; j < tags.length; ++j) {
		var tag = tags[j];
		var list = lists[tag];
		list.sort(function(a, b) {
			return a.ratio - b.ratio;
		});
		var color = tag == 'headlines' ? '255,0,0,0.2' : '0,255,0,0.2';
		color = tag == 'links' ? '0,0,255,0.2' : color;
		for (var i = 0; i < 200 && i < list.length; ++i) {
			var e = list[i];
			//console.log(e);
			var div = '<div style="position:absolute;border:1px solid black;width:' + e.width
					+ 'px;height:' + e.height
					+ 'px;top:' + e.top
					+ 'px;left:' + e.left
					+ 'px;background-color:rgba(' + color + ');z-index:' + 1000 + ';">' + tag + ' ==> ' + e.text.length + '</div>';
			var insertedDiv = $('body').append(div);
		}
	}
});
