window.DiaryTemplate = {};

var entriesContainerId = "#entries";
var entriesHeader = '', entriesFooter = '';
var initialData = {
	"category": "default",
	"type": "entries",
	"data": {
		"2013": {
			"9": [
				{
					"timestamp": 0,
					"timezone": 9,
					"date": 12,
					"dayOfWeek": 4,
					"time": "--:--",
					"title": "ド田舎生活4",
					"content": "",
					"summary": ""
				},
				{
					"timestamp": 0,
					"timezone": 9,
					"date": 9,
					"dayOfWeek": 1,
					"time": "--:--",
					"title": "ド田舎生活3",
					"content": "",
					"summary": ""
				},
				{
					"timestamp": 0,
					"timezone": 9,
					"date": 7,
					"dayOfWeek": 6,
					"time": "--:--",
					"title": "ド田舎生活2",
					"content": "",
					"summary": ""
				},
				{
					"timestamp": 0,
					"timezone": 9,
					"date": 5,
					"dayOfWeek": 4,
					"time": "--:--",
					"title": "ド田舎生活",
					"content": "",
					"summary": ""
				}
			]
		}
	}
};
var templates = {
	/* exported: date, dow, time, wi-icons, title, summary */
	entry: '<div class="mui-card entry"><div class="date-wrapper fnt-hg cstyle-c"><p class="date">${date}</p><p class="dayofweek">${dow}</p>' + 
		'</div><div class="time fnt-hg cstyle-c">${time}<div class="icons">${wi-icons}</div>' + 
		'</div><div class="title cstyle-c">${title}</div><div class="summary">${summary}</div></div>',
	/* exported: month */
	month: '<p class="tshadow entries-month fnt-hg cstyle-bw-inv">${month}</p>',
}

DiaryTemplate = {
	loadEntries: function( data ) {
		
	},
	loadCategories: function( data ) {
		
	}
}
