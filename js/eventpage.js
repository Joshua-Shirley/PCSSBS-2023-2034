let startup = {
	schedule : null,
	menu : null,
	
	init: function() {
		//console.clear();
		var page = window.location.href;
		this.schedule = new Schedule();

		this.schedule.List
		
		if ( page.search(/schedule\/\w*\/ft\/\w{3}/) > -1 ){
			calendar.init();
			peak.init();
			// highlight the scheduled days
			stats.block();			
			stats.update();
        }
        else if (page.search(/pick40/) > -1){
            console.log("Pick 40");
            calendar.init();
            peak.init();
            stats.block();
            stats.update();
            var d = document.querySelectorAll("div.grid-date");
            d.forEach(function(item) {
                var date = new Date( item.getAttribute("datetime") );
                item.querySelector("h2").innerText = date.getMonth() + 1 + '/' + date.getDate();
            });            
		}        
		else if ( page.search(/cart/) > -1){
			cart.cartMenu();
			cart.init();						
		}
	}	
}

window.addEventListener( "DOMContentLoaded", startup.init() );