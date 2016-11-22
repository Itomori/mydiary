$category:entries-card;name:card;imports:date,dayofweek,time,title,summary
<div class="mui-card entry">
	<div class="date-wrapper fnt-hg cstyle-c"><p class="date">${date}</p><p class="dayofweek">${dayofweek}</p></div>
	<div class="time fnt-hg cstyle-c">${time}<div class="icons">${weather}</div>
	</div>
	<div class="title cstyle-c">${title}</div>
	<div class="summary">${summary}</div>
</div>
$end
$category:entries-card;name:month;imports:month
<p class="tshadow entries-month fnt-hg cstyle-bw-inv">${month}</p>
$end