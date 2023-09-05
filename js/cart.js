let cart = {
	objects : new Array(),
	
	init() {		
		this.organize();
		console.log("cart organize complete");
		
		this.sort();
		console.log("cart sort complete");

		this.moveElements();
		console.log("cart rows moved - complete");
		//this.binding();
		
		// rectify the schedule object list
		this.cartRectify();
		console.log("cart schedule is rectified");
	},

	resort: function(direction) {
		console.log("resort " + direction);
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
    },

	sortButton: function() {
		var buttonAsc = document.createElement("button");
		buttonAsc.classList.add("btn");
		buttonAsc.innerText = "Sort List - Ascending";
		//buttonAsc.onclick = function() { console.log("ascending") };
		buttonAsc.addEventListener("click", cart.resort("ascending"));
		
		var buttonDesc = document.createElement("button");
		buttonDesc.classList.add("btn");
		buttonDesc.innerText = "Sort List - Descending";
		//buttonDesc.onclick = function() {console.log("descending")};
		buttonDesc.addEventListener("click", cart.resort("descending"));


		var container = document.querySelector("div.cart-container");
		var parent = container.parentElement;
		parent.insertBefore( buttonAsc , container );
		parent.insertBefore( buttonDesc , container );
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