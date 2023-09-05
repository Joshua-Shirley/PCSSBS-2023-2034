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
    	if( this.list.includes( date ) )
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
    		dates.forEach( date => {
    			this.push( date );
    		});
    		this.sort();
    	}
    }

    save() {   
    	this.sort();
        localStorage.setItem(this.season, JSON.stringify( this.list) );
    }
}