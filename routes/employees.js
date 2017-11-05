var express = require('express');
var app = express();
var fs = require('fs');

app.get('/latest', function(req, res, next) {
		fs.readFile('latest.txt', function(err, data) {
			if (err) throw err
    		console.log(data);

    		var object = JSON.parse(data);

    		res.render('employees/latest', {
				title: 'Trackeroo1984 - Latest Employees',
				data: data,
				object: object
			});

    	// res.writeHead(200, {'Content-Type': 'application/json'});
	});
});


// SHOW LIST OF EMPLOYEES
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM employees ORDER BY id ASC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('employees/list', {
					title: 'Trackeroo1984 - Employees List',
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('employees/list', {
					title: 'Trackeroo1984 - Employees List',
					data: rows
				})
			}
		})
	});
});

// SHOW EMPLOYEE USER FORM
app.get('/add', function(req, res, next){
	// render to views/user/add.ejs
	res.render('employees/add', {
		title: 'Trackeroo1984 - Add New Employee',
		first_name: '',
		last_name: '',
		email: '',
		bonus: '',
		amount: '',
		card_number: ''
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
			amount: req.sanitize('amount').escape().trim(),
			card_number: req.sanitize('card_number').escape().trim(),
			id_depart: req.sanitize('id_depart').escape().trim()
		};

		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO employees SET ?', employee, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err);

					// render to views/user/add.ejs
					res.render('employees/add', {
						title: 'Trackeroo1984 - Add New Employee',
						first_name: employee.first_name,
						last_name: employee.last_name,
						email: employee.email,
						bonus: employee.bonus,
						amount: employee.amount,
						card_number: employee.card_number,
						id_depart: employee.id_depart
					});
				} else {
					axios.get('http://raspberry024.local:8080/payout')
						.then(function (response) {
					    	console.log(response);
					  	})
					  	.catch(function (error) {
					    	console.log(error);
					});

					req.flash('success', 'Data added successfully!');

					// render to views/user/add.ejs
					res.render('employees/add', {
						title: 'Trackeroo1984 - Add New Employee',
						first_name: '',
						last_name: '',
						email: '',
						bonus: '',
						amount: '',
						card_number: '',
						id_depart: ''
					});
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
			amount: req.body.amount,
			card_number: req.body.card_number,
			id_depart: employee.id_depart
        });
    };
});
// Get employee by card
app.get('/by_card/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
        var card_number = req.params.id;
        //replace possible + signs from URLencoded values with spaces
        card_number = card_number.replace(/\+/g, ' ');
		conn.query('SELECT * FROM employees WHERE card_number = "' + card_number + '"', function(err, rows, fields) {
			if(err) throw err
            var json_response = {};
			// if user not found
			if (rows.length <= 0) {
                //json error
                json_response = { "success": false, "message": "The employee does not exist" };
			}
			else { // if user found
				// render to views/user/edit.ejs template file
                json_response = {
                    "success": true,
                    "message": "Welcome",
                    "name": rows[0].first_name,
                    "amount": rows[0].amount
                };
			}
			var data = JSON.stringify(json_response);
			fs.writeFile("latest.txt", data, function(err, data){
			    if (err) throw err
			    console.log('The file has been saved');
			});
            res.json(json_response);
		});
	});
});


// SHOW EDIT EMPLOYEE FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM employees WHERE id = ' + req.params.id, function(err, rows, fields) {
			if(err) throw err

			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'Employee not found with id = ' + req.params.id);
				res.redirect('/employees');
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('employees/edit', {
					title: 'Trackeroo1984 - Pay Employee',
					//data: rows[0],
					id: rows[0].id,
					first_name: rows[0].first_name,
					last_name: rows[0].last_name,
					email: rows[0].email,
					bonus: rows[0].bonus,
					amount: rows[0].amount,
					card_number: rows[0].card_number,
					id_depart: rows[0].id_depart
				});
			}
		});
	});
});

// EDIT EMPLOYEE POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	// req.assert('bonus', 'Bonus is required').notEmpty();           //Validate name
	// req.assert('amount', 'Amount is required').notEmpty();             //Validate age

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
			bonus: 0,
			amount: 0.00
		};

		req.getConnection(function(error, conn) {
			conn.query('UPDATE employees SET ? WHERE id = ' + req.params.id, employee, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err);

					// render to views/user/add.ejs
					res.render('employees/edit', {
						title: 'Trackeroo1984 - Pay Employee',
						id: req.params.id,
						first_name: req.body.first_name,
						last_name: req.body.last_name,
						email: req.body.email,
						bonus: req.body.bonus,
						amount: req.body.amount,
						card_number: req.body.card_number,
						id_depart: req.body.id_depart
					})
				} else {
					req.flash('success', 'Payment was made successfully!');

					// render to views/user/add.ejs
					res.render('employees/edit', {
						title: 'Trackeroo1984 - Pay Employee',
						id: req.params.id,
						first_name: req.body.first_name,
						last_name: req.body.last_name,
						email: req.body.email,
						bonus: req.body.bonus,
						amount: req.body.amount,
						card_number: req.body.card_number,
						id_depart: req.body.id_depart
					});
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg);

		/**
		 * Using req.body.name
		 * because req.param('name') is deprecated
		 */
        res.render('employees/edit', {
            title: 'Trackeroo1984 - Edit Employee',
			id: req.params.id,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			bonus: req.body.bonus,
			amount: req.body.amount,
			card_number: req.body.card_number
        });
    }
})

// DELETE EMPLOYEE
app.delete('/delete/(:id)', function(req, res, next) {
	var employee = { id: req.params.id }

	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM employees WHERE id = ' + req.params.id, employee, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err);
				// redirect to users list page
				res.redirect('/employees');
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id);
				// redirect to users list page
				res.redirect('/employees');
			}
		});
	});
});

module.exports = app;
