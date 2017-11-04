var express = require('express');
var app = express();

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM employees ORDER BY id ASC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('employees/list', {
					title: 'Employees List', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('employees/list', {
					title: 'Employees List', 
					data: rows
				})
			}
		})
	});
});

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('employees/add', {
		title: 'Add New Employee',
		first_name: '',
		last_name: '',
		email: '',
		bonus: '',
		amount: ''		
	});
});

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('first_name', 'First Name is required').notEmpty();           //Validate name
	req.assert('last_name', 'Last Name is required').notEmpty();             //Validate age
    req.assert('email', 'A valid email is required').isEmail();  //Validate email

    var errors = req.validationErrors();
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var employee = {
			first_name: req.sanitize('first_name').escape().trim(),
			last_name: req.sanitize('last_name').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			bonus: req.sanitize('bonus').escape().trim(),
			amount: req.sanitize('amount').escape().trim()
		};
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO employees SET ?', employee, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('employees/add', {
						title: 'Add New Employee',
						first_name: employee.first_name,
						last_name: employee.last_name,
						email: employee.email,
						bonus: employee.bonus,	
						amount: employee.amount				
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('employees/add', {
						title: 'Add New Employee',
						first_name: '',
						last_name: '',
						email: '',
						bonus: '',	
						amount: ''					
					})
				}
			})
		});
	}
	else {   //Display errors to user
		var error_msg = '';
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		});				
		req.flash('error', error_msg);	
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('employees/add', { 
            title: 'Add New Employee',
            first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			bonus: req.body.bonus,	
			amount: req.body.amount	
        });
    };
});

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM employees WHERE id = ' + req.params.id, function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/employees')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('employees/edit', {
					title: 'Edit User', 
					//data: rows[0],
					id: rows[0].id,
					name: rows[0].name,
					age: rows[0].age,
					email: rows[0].email					
				})
			}			
		});
	});
});

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty();           //Validate name
	req.assert('age', 'Age is required').notEmpty();             //Validate age
    req.assert('email', 'A valid email is required').isEmail();  //Validate email

    var errors = req.validationErrors();
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			age: req.sanitize('age').escape().trim(),
			email: req.sanitize('email').escape().trim()
		};
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('employees/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						age: req.body.age,
						email: req.body.email
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.render('employees/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						age: req.body.age,
						email: req.body.email
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('employees/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			age: req.body.age,
			email: req.body.email
        });
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM employees WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/employees')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/employees')
			}
		});
	});
});

module.exports = app;
