"use strict"
var values = {};

jQuery(document).ready(function() {
	//var tags = ['a'];
	var tags = ['a', 'h1', 'h2', 'h3', 'p', 'div', 'li', 'span'];
	
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
				ratio: area / text.length
			};
			return isFinite(result.ratio) && 0 != result.text.length && 0 != result.ratio ? result : undefined;
		}).get();
	});
	
	lists.a.sort(function(a, b) {
		return b.ratio - a.ratio;
	});
	
	console.log(lists);

	for (var j = 0; j < tags.length; ++j) {
		var tag = tags[j];
		var list = lists[tag];
		for (var i = 0; i < 20 && i < list.length; ++i) {
			var e = list[i];
			console.log(e);
			var div = '<div style="position:absolute;border:1px solid black;width:' + e.width
					+ 'px;height:' + e.height
					+ 'px;top:' + e.top
					+ 'px;left:' + e.left
					+ 'px;background-color:rgba(255,0,0,0.2);z-index:' + e.ratio + ';">' + tag + ' -> ' + e.ratio + '</div>';
			var insertedDiv = $('body').append(div);
		}
	}
});
