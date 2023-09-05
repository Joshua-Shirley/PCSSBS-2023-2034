let calendar = {
	
	list: new Array(),
	grid: null,
	
	init: function() {
		this.collectBlocks();
		this.addContainer();
		this.rewrite();
		this.buttonText();
		this.blankDays();
		this.calendarHeader();
		this.highlight();
		this.binding();
	},
	
	collectBlocks: function() {
		this.list = document.querySelectorAll(".sqs-block-product");
	},
	
	rewrite: function() {
		this.list.forEach(function(item) {
			var linkElement = item.querySelector("a");
			var href = linkElement.href;
			var rawDate = href.substring( href.search(/\d{2}-\d{2}/) , href.length);
			var dateArray = rawDate.split('-');
			var year = 2023;
			if( parseInt(dateArray[0]) < 6 ){
				year = 2024;
			}
			var date = new Date(year,dateArray[0]-1,dateArray[1]);
			linkElement.innerText = date.toDateString();
			
			item.querySelector("h2").innerText = date.getDate();
			item.setAttribute("datetime", date.toISOString());
			item.classList.add("grid-item");
			item.classList.add("grid-date");
		});
	},
	
	addContainer: function() {
		var id = this.list[0].parentElement.id;
		var container = this.list[0].parentElement.parentElement;
		
		// Add in an full span column
		var col = document.createElement("div");
		col.classList.add("col");
		col.classList.add("sqs-col-12");
		col.classList.add("span-12");
		col.id = id;
		
		// Create a grid container
		var grid = document.createElement("div");
		grid.classList.add("grid-container");
		
		this.grid = grid;
	
		container.prepend(col);
		col.prepend(grid);
		
		// Move all the product blocks into the new grid container
		this.list.forEach(function(item){
			grid.append(item);	
		});
		
		//remove extra columns
		var columns = container.querySelectorAll(":scope > div:not(.sqs-col-12)");
		columns.forEach( function(item) {
			item.remove();	
		});
	},
	
	buttonText: function() {
		var buttons = document.querySelectorAll("div.sqs-block-product div.sqs-add-to-cart-button-inner");
		buttons.forEach( function(button) {
		    if( button.innerText.toLowerCase() == "add to schedule") {
		        button.innerText = "Add" ;
		        button.parentElement.setAttribute("data-original-label","Add");
		    }
		});
	},
	
	blankDays: function() {
		var date = new Date(this.list[0].getAttribute("datetime"));
		var clone = this.list[0].cloneNode(false);
		clone.removeAttribute('id');
		clone.classList.remove("grid-date");
		clone.classList.add("blank-block");
		clone.removeAttribute("datetime");
		for( var i = 0 ; i < date.getDay(); i++ ) {
			this.grid.prepend(clone.cloneNode(false));
		}
	},
	
	calendarHeader: function() {
		const weekdays = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
		var header = this.list[0].cloneNode(false);
		header.removeAttribute("data-block-type");
		header.removeAttribute("datetime");
		header.classList.remove("blank-block");
		header.classList.remove("grid-date");
		header.classList.add("grid-header");
		 
	    var span1 = document.createElement("span");
	    span1.classList.add("abbreviated");
	    
	    var span2 = document.createElement("span");
	    span2.classList.add("full");   
	    
	    header.append(span1);
	    header.append(span2);
	    
	   	// Calendar Weekday Headings
	    for( var i = 6 ; i >= 0; i-- ) {
	    	
	    	var weekday = weekdays[i].toUpperCase();
	    	
	    	span1.innerText = weekday.substring(0,3);
	    	span2.innerText = weekday.substring(3, weekday.length);
	    	
	    	header.append(span1);
	    	header.append(span2);
	    	
	    	this.grid.prepend(header.cloneNode(true));
	    }	
	},
	
	highlight: function() {
		var valid = document.querySelectorAll("div.grid-item.grid-date");
		for(var i = 0; i < valid.length; i++) {
		    var date = new Date(valid[i].getAttribute("datetime"));
		    if( startup.schedule.list.includes(date.toISOString()) ) {
		        valid[i].classList.add("scheduled");
		        valid[i].querySelector("div.sqs-add-to-cart-button-inner").innerText = "Scheduled";
		    }
		}
	},
	
	binding: function() {
		for(var i = 0; i < this.list.length; i++){
			var button = this.list[i].querySelector("div.sqs-add-to-cart-button");
			button.addEventListener("click", function() {
				calendar.addToCalendar(this);
			})
		}
	},
	
	addToCalendar: function(element) {
		const text = "SCHEDULED";
		var datetime = new Date( element.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("datetime") );
		startup.schedule.newEvent(datetime.toISOString());
		this.highlight();
		element.setAttribute("data-original-label", text);
		
		stats.update();
	}
}