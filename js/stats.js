let stats = {
	
	init: function() {
		this.block();
		this.update();
	},
	
	block: function() {
		var statsBlock = document.createElement("div");
		statsBlock.id = "schedule-stats";
		statsBlock.classList.add("stats");
		document.body.append(statsBlock);
		
		var type = ["Summary" , "Total Days", "Peak Days" , "Full Time Days"];
		var ids = ["Current" , "totalValue", "peakValue", "fullTimeValue"];
		var req = ["Required" , "90+" , "40" , "90" ]
		for( var i = 0 ; i < type.length; i++ ){
			var row = document.createElement("div");
			row.classList.add("stats-row");
			if ( i == 0 ) {
				row.classList.add("header");
			}
			statsBlock.append(row);
			
			var col1 = document.createElement("div");
			col1.classList.add("col-6");
			col1.classList.add("key");
			col1.innerText = type[i] + ":";
			row.append(col1);
			
			var col2 = document.createElement("div");
			col2.classList.add("col-3");
			col2.classList.add("value");
			col2.id = ids[i];
			if ( i == 0) {
				col2.innerText = "Current";
			}
			row.append(col2);
			
			var col3 = document.createElement("div");
			col3.classList.add("col-3");
			col3.classList.add("requred");
			col3.id = ids[i] + "req";
		
			col3.innerText = req[i];
			row.append(col3);
		}		
	},
	
	update: function() {
		var peakStat = startup.schedule.list.filter( date => peak.days.includes( date ) );
		var startDate = new Date(2023, 11, 10); // December 10 2023
		var endDate = new Date(2024, 3 , 7 ); // April 7 2023
		var fulltime = startup.schedule.list.filter ( date => new Date(date) > startDate && new Date(date) < endDate );
		
		document.querySelector("div#totalValue").innerText = startup.schedule.list.length;
		document.querySelector("div#peakValue").innerText = peakStat.length;
		document.querySelector("div#fullTimeValue").innerText = fulltime.length;		
	}
}
