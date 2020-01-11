
/*
 * GET users listing.
 */
 var mysql = require('mysql');

 
 
 var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
		database:'bidding'
    });
 
 
 
 
 
 

exports.list = function(req, res){

  
       
        var query = connection.query('SELECT * FROM user',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('customers',{page_title:"Customers",data:rows});
                
           
         });
         
         //console.log(query.sql);
   
  
};

exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers"});
};

exports.edit = function(req, res){
    
    var id = req.params.id;
    
  
       
        var query = connection.query('SELECT * FROM user WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_customer',{page_title:"Edit Customers",data:rows});
                
           
         });
         
         //console.log(query.sql);
   
};

/*Save the customer*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    
        
        var data = {
            
            username    : input.username,
            project:input.projectname,
            email   : input.email
             
        
        };
        
        var query = connection.query("INSERT INTO user set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/customers');
          
        });
        
       // console.log(query.sql); get raw query
    
  
};

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    
    
        
        var data = {
            
            username    : input.username,
            project:input.projectname,
            email   : input.email
        
        };
        
        connection.query("UPDATE user set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/customers');
          
        });
    
    
};


exports.delete_customer = function(req,res){
          
     var id = req.params.id;
    
        
        connection.query("DELETE FROM user  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/customers');
             
        });
        
  
};


