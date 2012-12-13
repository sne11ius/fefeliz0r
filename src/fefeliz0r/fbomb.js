"use strict"
var values = {};

jQuery(document).ready(function() {
	//var tags = ['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'];
	var tags = ['a', 'p', 'div'];
	//var tags = ['a'];//, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'];
	
	jQuery.each(tags, function(key, tag) {
		var elemList = [];
		$(tag).each(function(index) {
			var obj = $(this)
					, outerWidth = $(obj).outerWidth()
					, outerHeight = $(obj).outerHeight()
					, offset = $(obj).offset()
					, position = $(obj).position()
			elemList.push({
				'outerWidth': outerWidth,
				'outerHeight': outerHeight,
				'offset': offset,
				'position': position
			})
		});
		values[tag] = elemList;
	});
	console.log(values);
	
	var sums = {};
	
	for (var tag in tags) {
		var currentSums = [];
		for (var elem in values[tags[tag]]) {
			//console.log('[obj.outerWidth()] => ' + elem.outerWidth);
			//console.log('[obj.outerHeight()] => ' + elem.outerHeight);
			//console.log('[obj] => ' + values[tags[tag]][elem]);
			currentSums.push(values[tags[tag]][elem].outerWidth * values[tags[tag]][elem].outerHeight); 
		}
		sums[tags[tag]] = currentSums;
	}
	console.log(sums);
	
	for (var i = 0; i < tags.length; ++i) {
		var tag = tags[i];
		var sumList = sums[tag];
		var valuesList = values[tag];
		
		for (var j = 0; j < sumList.length; ++j) {
			var sum = sumList[j];
			var width = valuesList[j].outerWidth;
			var height = valuesList[j].outerHeight;
			var top = valuesList[j].offset.top + valuesList[j].position.top;
			var left = valuesList[j].offset.left + valuesList[j].position.left;
			var div = '<div style="position:absolute;border:1px solid black;width:' + width
						+ 'px;height:' + height
						+ 'px;top:' + top
						+ 'px;left:' + left
						+ 'px;background-color:red;z-index:' + j + ';">' + tag + '</div>';
						//+ ';background-color:' + sum + ';"></div>';
			$('body').append(div);
			console.log(j);
		}
	}
	
	function sortmyway(data_A, data_B) {
		return (data_A - data_B);
	}
	for (var i = 0; i < tags.length; ++i) {
		var tag = tags[i];
		var sumList = sums[tag];
		var valuesList = values[tag];
		
		
	}
	//var list =[ 39, 108, 21, 55, 18, 9]
	//list.sort(sortmyway) //[9, 18, 21, 39, 55, 108]
	
	

	
	/*
	for (var tag in tags) {
		var currentSums = sums[tags[tag]];
		$(body).append('<div>');
	}
	*/
	
});
