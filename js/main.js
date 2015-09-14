$(document).ready(function(){
    // Open a database
    var request = indexedDB.open('customermanager',1);
    
    request.onupgradeneeded = function(e){
        var db = e.target.result;
        
        if(!db.objectStoreNames.contains('customers')){
			var os = db.createObjectStore('customers',{keyPath: "id", autoIncrement:true});
        
            //Create Index for Name
    			os.createIndex('name','name',{unique:false});
    		}
	    };
        
        //Success
    	request.onsuccess = function(e){
    		console.log('Success: Opened Database...');
    		db = e.target.result;
    		showCustomers();
    	};
    	
    	//Error
    	request.onerror = function(e){
    		console.log('Error: Could Not Open Database...');
    	};
});


// Add customer
function addCustomer(){
    var name = $('#name').val();
	var email = $('#email').val();
	
	var transaction = db.transaction(["customers"],"readwrite");
	
	// Ask for objectstore
	var store = transaction.objectStore("customers");
	
	// Define customer
	var customer = {
		name: name,
		email: email
	};
	
	// Perform the customer addition
	var request = store.add(customer);
	
	//Success
	request.onsuccess = function(e){
		window.location.href="index.html";
	};
	
	//Error
	request.onerror = function(e){
		alert("Sorry, the customer was not added");
		console.log('Error', e.target.error.name);
	};
	
}


// Display customers
function showCustomers(e){
    var transaction = db.transaction(["customers"],"readonly");
    
    // Ask for objectstore
    var store = transaction.objectStore("customers");
	var index = store.index('name');
	
	var output = '';
	
	index.openCursor = function(e){
	    var cursor = e.target.result;
	    
	    if(cursor){
			output += "<tr id='customer_"+cursor.value.id+"'>";
			output += "<td>"+cursor.value.id+"</td>";
			output += "<td><span class='cursor customer'>"+cursor.value.name+"</span></td>";
			output += "<td><span class='cursor customer'>"+cursor.value.email+"</span></td>";
			output += "<td><a href=''>Delete</a></td>";
			output += "</tr>";
			cursor.continue();
		}
		
		$('#customers').html(output);
	};
}