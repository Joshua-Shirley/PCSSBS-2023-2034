class Schedule {
    constructor() {
        this.season = 'winter20232024'
        this.list = new Array(); 
        this.load();
    }
    
    newEvent( date ) {
        // use to create a new workEvent object that can be passed to other functions
        // this doesn't save the event to the file.
        this.push( date );
        return date;
    }

    remove( date ) {
    	var dt = new Date(date);
    	var index = this.list.indexOf(dt.toISOString());
    	this.list.splice(index, 1);
    	this.save();
    	console.log( date + ' removed');
    }

    push(eventDate) {
    	if ( !this.exists( eventDate )  )
    	{
	        // use this to push to the array                
	        this.list.push(eventDate);
    	}
    	this.save();
    }
    
    exists(date) {
    	if( this.list.contains( date ) )
    	{
    		return true;
    	}
    	return false;
    }
    
    sort() 
    { 
    	
    	// day bucket
    	var day_array = new Array(31);        
        for( var d = 1; d <= 31; d++){
            day_array[d] = new Array();
            var days = this.list.filter( date => new Date(date).getDate() == d );
            days.forEach( obj => {
                day_array[d].push(obj);
            });
        }
        this.list = day_array.flat();
    	
    	// month bucket
        var month_array = new Array(12);        
        for( var m = 0; m < 12; m++){
            month_array[m] = new Array();
            var month = this.list.filter( date => new Date(date).getMonth() == m);
            month.forEach( obj => {
                month_array[m].push(obj);
            });
        }
        this.list = month_array.flat();
    	    	
    	// year bucket
        var year_array = new Array(10);        
        for( var y = 0; y < 10; y++){
            year_array[y] = new Array();
            var year = this.list.filter( date => new Date(date).getFullYear() % 10 == y );
            year.forEach( obj => {
                year_array[y].push( obj );
            });
        }
    	this.list = year_array.flat();	
    }

    load() {
    	if( localStorage.hasOwnProperty(this.season) ) {
    		this.list = [];
    		var dates = JSON.parse(localStorage.getItem(this.season));
    		dates.forEach( shift => {
    			this.push( shift );
    		});
    		this.sort();
    	}
    }

    save() {   
    	this.sort();
        localStorage.setItem(this.season, JSON.stringify( this.list) );
    }
}

class CartItems {
	constructor(element, date) {
		this.element = element;
		this.date = date;
	}
}

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
		    if( startup.schedule.list.contains(date.toISOString()) ) {
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

let peak = {
	pick40 : JSON.parse('["2023-12-25T07:00:00.000Z","2024-01-01T07:00:00.000Z","2023-11-19T07:00:00.000Z","2023-11-20T07:00:00.000Z","2023-11-21T07:00:00.000Z","2023-11-22T07:00:00.000Z","2023-12-17T07:00:00.000Z","2023-12-18T07:00:00.000Z","2023-12-19T07:00:00.000Z","2023-12-20T07:00:00.000Z","2023-12-21T07:00:00.000Z","2023-12-22T07:00:00.000Z","2023-12-23T07:00:00.000Z","2023-12-24T07:00:00.000Z","2023-12-26T07:00:00.000Z","2023-12-27T07:00:00.000Z","2023-12-28T07:00:00.000Z","2023-12-29T07:00:00.000Z","2023-12-30T07:00:00.000Z","2023-12-31T07:00:00.000Z","2024-01-02T07:00:00.000Z","2024-02-09T07:00:00.000Z","2024-02-10T07:00:00.000Z","2024-02-15T07:00:00.000Z","2024-02-16T07:00:00.000Z","2024-02-17T07:00:00.000Z","2024-02-18T07:00:00.000Z","2024-02-19T07:00:00.000Z","2024-02-20T07:00:00.000Z","2024-02-21T07:00:00.000Z","2024-02-22T07:00:00.000Z","2024-02-23T07:00:00.000Z","2024-03-01T07:00:00.000Z","2024-03-02T07:00:00.000Z","2024-03-03T07:00:00.000Z","2024-03-04T07:00:00.000Z","2024-03-05T07:00:00.000Z","2024-03-07T07:00:00.000Z","2024-03-08T07:00:00.000Z","2024-03-09T07:00:00.000Z","2024-03-10T07:00:00.000Z","2024-03-11T06:00:00.000Z","2024-03-12T06:00:00.000Z","2024-03-13T06:00:00.000Z","2024-03-14T06:00:00.000Z","2024-03-15T06:00:00.000Z","2024-03-16T06:00:00.000Z","2024-03-17T06:00:00.000Z","2024-03-18T06:00:00.000Z","2024-03-19T06:00:00.000Z","2024-03-20T06:00:00.000Z","2024-03-21T06:00:00.000Z","2024-03-22T06:00:00.000Z","2024-03-23T06:00:00.000Z","2024-03-24T06:00:00.000Z"]'),
	
	days : new Array(),
	
	list : new Array(),
	
	init: function() {
		this.collectBlocks();
		this.match();
	},
	
	collectBlocks: function() {
		this.days = Array.from(this.pick40);
		this.list = document.querySelectorAll("div.grid-date")
	},
	
	match: function() {
		var days = this.days;
		this.list.forEach( function(element) {
			var date = new Date(element.getAttribute("datetime"));
			var isPeakDay = days.contains( date.toISOString());
			if( isPeakDay ) {
				element.classList.add("peak");
				peak.toolTip(element);
			}
		});
	},
	
	toolTip: function(element) {
		var toolTipSpan = document.createElement("span");
		toolTipSpan.classList.add("tooltiptext");
		toolTipSpan.innerText = "Peak Day";
		element.querySelector("div.sqs-add-to-cart-button").append(toolTipSpan);
	},
	
	
}

let cart = {
	objects : new Array(),
	
	init() {
		this.organize();
		
		this.sort();
		this.moveElements();
		this.binding();
		
		// rectify the schedule object list
		this.cartRectify();
	},
	
	cartRectify: function() {
		startup.schedule.list = new Array();
		this.objects.forEach( function(obj) {
			startup.schedule.newEvent( obj.date.toISOString() );	
		});
	},
	
	binding: function() {
		this.objects.forEach(function(item) {
			item.element.querySelector("button").addEventListener( "click" , function() { 
				startup.schedule.remove(item.date);
			});
		});
	},
	
	organize : function() {
		var rows = document.querySelectorAll("div.cart-row");
		rows.forEach(function(row) {
		    var arialabel = row.querySelector("button").getAttribute("aria-label");
		    var dateString = arialabel.substring( arialabel.search(/\d/) , arialabel.length );
		    var dateArray = dateString.split('\/');
		    var year = 2023;
		    var month = dateArray[0] - 1;
		    var day = dateArray[1];
		    if (month < 6 ) {
		        year = 2024;
		    }
		    var date = new Date( year , month, day );
		    cart.objects.push( new CartItems( row , date ) );
		});
	},
	
	moveElements : function() {
    	var container = document.querySelector("div.cart-container");
		this.objects.forEach(function(item){
		    item.element.remove();
		    container.append(item.element);
		});
	},
	
    sort() 
    { 
    	// day bucket
    	var day_array = new Array(31);        
		for( var d = 1; d <= 31; d++){
		    day_array[d] = new Array();
		    var days = this.objects.filter( obj => new Date(obj.date).getDate() == d );
		    days.forEach( obj => {
		        day_array[d].push(obj);
		    });
		}
        this.objects = day_array.flat();
    	
    	// month bucket
        var month_array = new Array(12);        
        for( var m = 0; m < 12; m++){
            month_array[m] = new Array();
            var month = this.objects.filter( obj => new Date(obj.date).getMonth() == m);
            month.forEach( obj => {
                month_array[m].push(obj);
            });
        }
        this.objects = month_array.flat();
    	    	
    	// year bucket
        var year_array = new Array(10);        
        for( var y = 0; y < 10; y++){
            year_array[y] = new Array();
            var year = this.objects.filter( obj => new Date(obj.date).getFullYear() % 10 == y );
            year.forEach( obj => {
                year_array[y].push( obj );
            });
        }
    	this.objects = year_array.flat();
    }
}

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
		var peakStat = startup.schedule.list.filter( date => peak.days.contains( date ) );
		var startDate = new Date(2023, 11, 10); // December 10 2023
		var endDate = new Date(2024, 3 , 7 ); // April 7 2023
		var fulltime = startup.schedule.list.filter ( date => new Date(date) > startDate && new Date(date) < endDate );
		
		document.querySelector("div#totalValue").innerText = startup.schedule.list.length;
		document.querySelector("div#peakValue").innerText = peakStat.length;
		document.querySelector("div#fullTimeValue").innerText = fulltime.length;		
	}
}


let startup = {
	schedule : null,
	menu : null,
	
	init: function() {
		//console.clear();
		var page = window.location.href;
		this.schedule = new Schedule();
		
		if ( page.search(/schedule\/\w*\/ft\/\w{3}/) > -1 ){
			calendar.init();
			peak.init();
			// highlight the scheduled days
			stats.block();
			console.clear();
			stats.update();
		}
		else if ( page.search(/cart/) > -1){
			setTimeout( function() {
				startup.cartMenu();
				cart.init();
				console.clear();
			}, 1200);
		}
	},
	
	cartMenu: function() {
		var div = document.createElement("div");
		div.classList.add("menu");
		
		const menuURI = [
			{ link : "/schedule/cyski/ft/pick40" , name : "Pick 40" },
			{ link : "/schedule/cyski/ft/nov" , name : "November" },
			{ link : "/schedule/cyski/ft/dec" , name : "December" },
			{ link : "/schedule/cyski/ft/jan" , name : "January" },
			{ link : "/schedule/cyski/ft/feb" , name : "Febuary" },
			{ link : "/schedule/cyski/ft/mar" , name : "March" },
			{ link : "/schedule/cyski/ft/apr" , name : "April" }
		];
		
		menuURI.forEach(function(obj) {
			
			var inline = document.createElement("div");
			inline.classList.add("item");
			
			var link = document.createElement("a");
			link.href = obj.link;
			link.innerText = obj.name;
			
			inline.append(link);
		
			div.append(inline);
		});
		
		var container = document.querySelector("div.cart-container");
		var parent = container.parentElement;
		parent.insertBefore( div , container );
	}
	
	
}

window.addEventListener( "DOMContentLoaded", startup.init() );
