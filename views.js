//Views object, contains all views
var oViews = {};
//Partials object, contains partial views
oViews.partials = {};

//-------View context menu-------
oViews.contextMenu = '<div id="wdw-setup" class="wdw">\
						<div id="box-setup">\
						<div class="link no-margin super-admin" data-go-to="createUser"><i class="fa fa-plus fa-green"></i>Create user</div>\
						<div class="link super-admin" data-go-to="users">Users <i class="fa fa-users"></i></div>\
						<div class="link no-margin admin" data-go-to="createProperty"><i class="fa fa-plus fa-green"></i>Create property</div>\
						<div class="link" data-go-to="properties">Properties <i class="fa fa-home"></i></div>\
						<div class="link" data-go-to="logout">Logout <i class="fa fa-sign-out"></i></div>\
						</div>\
					</div>';

//-------View login-------
oViews.login = '<div id="wdw-setup" class="wdw">\
					<form id="box-setup" class="login">\
						<h2>User login</h2>\
						<p>Use your credentials to log in</p>\
						<input type="email" id="email" name="email" placeholder="Email">\
						<input type="password" id="password" name="password" placeholder="Password">\
						<button id="btn-login">Login</button>\
						<button id="btn-register">Register</button>\
					</form>\
				</div>';

//-------View setup-------
oViews.setup = '<div id="wdw-setup" class="wdw">\
					<form id="box-setup" class="setup">\
						<h2>CMS Setup</h2>\
						<p>Please set up a super admin user to begin using the system</p>\
						<input type="text" name="first_name" placeholder="Name">\
						<input type="text" name="last_name" placeholder="Last name">\
						<input type="email" name="email" placeholder="Email">\
						<input type="password" name="password" placeholder="Password">\
						<button id="btn-setup">Setup</button>\
					</form>\
				</div>';

//-------View register-------
oViews.register = '	<div id="wdw-setup" class="wdw">\
						<form id="box-setup" class="register">\
							<h2>Register user</h2>\
							<p>Please fill out the fields below to register</p>\
							<input type="text" name="first_name" id="first-name" placeholder="Name">\
							<input type="text" name="last_name" id="last-name" placeholder="Last name">\
							<input type="email" name="email" id="email" placeholder="Email">\
							<input type="password" name="password" id="password" placeholder="Password">\
							<h3 id="error"></h3>\
							<button id="btn-register">Register</button>\
							<button id="btn-back">Back</button>\
						</form>\
					</div>';

//-------View success-------
oViews.registrySuccess = '	<div id="wdw-setup" class="wdw">\
								<div id="box-setup" class="register">\
									<h2>Success!</h2>\
									<i class="fa fa-check fa-2x fa-green"></i>\
									<p>{{message}}</p>\
									<button id="btn-proceed">Proceed</button>\
								</div>\
							</div>';

//-------View post success-------
oViews.postSuccess = '	<div id="wdw-setup" class="wdw">\
							<div id="box-setup" class="post">\
								<h2>Success!</h2>\
								<i class="fa fa-check fa-2x fa-green"></i>\
								<p>{{message}}</p>\
								<button id="btn-proceed">Proceed</button>\
							</div>\
						</div>';

//-------View welcome-------
oViews.welcome = '	<div class="wdw">\
						<div id="wdw-welcome">\
							<h2>Welcome to the system, {{first_name}}</h2>\
						</div>\
					</div>';
//-------View users-------
oViews.users = '<div class="wdw">\
					<div id="wdw-properties">\
						<table>\
							<tr>\
								<td>#</td>\
								<td>First name</td>\
								<td>Last name</td>\
								<td>User level</td>\
								<td>Email</td>\
								<td>Send mail</td>\
								<td>Delete</td>\
								<td>Edit</td>\
							</tr>\
						</table>\
					</div>\
				</div>\
				<div id="mail-form">\
				</div>';

//-------View properties-------
oViews.properties = '<div class="wdw">\
						<div id="wdw-properties">\
							<table>\
								<tr>\
									<td>#</td>\
									<td>Address</td>\
									<td>Price</td>\
									<td>Type</td>\
									<td>Delete</td>\
									<td>Edit</td>\
									<td>Details</td>\
								</tr>\
							</table>\
						</div>\
					</div>';

//-------View create user-------
oViews.createUser = '	<div class="wdw">\
							<div id="wdw-create-user">\
								<form id="box-setup" class="create-user">\
									<h2>Create new user</h2>\
									<p>Please fill out the fields below to create a new user</p>\
									<input type="text" name="first_name" id="first-name" placeholder="First Name">\
									<input type="text" name="last_name" id="last-name" placeholder="Last name">\
									<input type="email" name="email" id="email" placeholder="Email">\
									<input type="password" name="password" id="password" placeholder="Password">\
									<select name="user_level">\
										<option value="user">User</option>\
										<option value="admin">Admin</option>\
										<option value="super">Super admin</option>\
									</select>\
									<h3 id="error"></h3>\
									<button id="btn-create-user">Create</button>\
								</form>\
							</div>\
						</div>';

//-------View view property-------
oViews.viewProperty = ' <div class="wdw">\
							<div class="data">Address: {{address}} Type: {{type}} Price: {{price}} DKK</div>\
							<div class="map">\
							</div>\
							<div id="images">\
								<img src="" id="property-image-1" alt="property-image-one">\
								<img src="" id="property-image-2" alt="property-image-two">\
								<img src="" id="property-image-3" alt="property-image-three">\
							</div>\
						</div>';

//-------View create property-------
oViews.createProperty = '	<div class="wdw">\
								<div id="wdw-create-user">\
									<form id="box-setup" class="create-property" method="post" enctype="multipart/form-data">\
										<h2>Create new property</h2>\
										<p>Please fill out the fields below to create a new property</p>\
										<input type="text" name="address" id="address" placeholder="Address">\
										<input type="text" name="price" id="price" placeholder="Price">\
										<select name="type">\
											<option value="House">house</option>\
											<option value="Appartment">appartment</option>\
										</select>\
										<div><h4>Please slect 3 images (required)</h4></div>\
										<input type="file" name="image_1" id="image-one">\
										<input type="file" name="image_2" id="image-two">\
										<input type="file" name="image_3" id="image-three">\
										<h3 id="error"></h3>\
										<button id="btn-create-property">Create</button>\
									</form>\
								</div>\
							</div>';

//-------View partials-------
//-------View users partial menu-------
oViews.partials.menu = '<div id="menu">\
							<div class="link no-margin super-admin" data-go-to="createUser"><i class="fa fa-plus fa-green"></i></div>\
							<div class="link super-admin" data-go-to="users">Users <i class="fa fa-users"></i></div>\
							<div class="link no-margin admin" data-go-to="createProperty"><i class="fa fa-plus fa-green"></i></div>\
							<div class="link" data-go-to="properties">Properties <i class="fa fa-home"></i></div>\
							<div class="link" data-go-to="logout">Logout <i class="fa fa-sign-out"></i></div>\
						</div>';

//-------User partial-------
oViews.partials.user = '<tr id=user{{id}}>\
							<td>{{id}}</td>\
							<td>{{first_name}}</td>\
							<td>{{last_name}}</td>\
							<td>{{user_level}}</td>\
							<td>{{email}}</td>\
							<td><i class="fa fa-mail-forward" data-email="{{email}}" data-first-name="{{first_name}}" data-last-name="{{last_name}}"></i></td>\
							<td><i class="fa fa-trash" data-id={{id}}></i></td>\
							<td><i class="fa fa-edit" data-id={{id}}></i></td>\
						</tr>';

//------Edit user view------
oViews.partials.editUser = '<tr id=editUser{{id}} data-id={{id}} class="edit">\
								<td><i class="fa fa-caret-right"></i></td>\
								<td><input type="text" name="first_name" value="{{first_name}}"></td>\
								<td><input type="text" name="last_name" value="{{last_name}}"></td>\
								<td>\
									<select name="user_level" id="user_level">\
										<option value="user">user</option>\
										<option value="admin">admin</option>\
										<option value="super_admin">super_admin</option>\
									</select>\
								</td>\
								<td><input type="text" name="email" value="{{email}}"></td>\
								<td><i class="fa fa-close"></i></td>\
								<td><i class="fa fa-save"></i></td>\
							</tr>\
							<tr class="edit-error">\
								<td colspan="8"><h3 id="error"></h3></td>\
							</tr>';

//------Property partial------
oViews.partials.property = '<tr id=property{{id}}>\
								<td>{{id}}</td>\
								<td>{{address}}</td>\
								<td>{{price}}</td>\
								<td>{{type}}</td>\
								<td><i class="fa fa-trash" data-id={{id}}></i></td>\
								<td><i class="fa fa-edit" data-id={{id}}></i></td>\
								<td><div class="view-property" data-id="{{id}}" data-address="{{address}}" data-price="{{price}}" data-type="{{type_only}}"><i class="fa fa-folder"> See details</i></div></td>\
							</tr>';

//------Edit property view------
oViews.partials.editProperty = '<tr id=editProperty{{id}} data-id={{id}} class="edit">\
									<td><i class="fa fa-caret-right"></i></td>\
									<td><input type="text" name="address" id="address" value="{{address}}"></td>\
									<td><input type="text" name="price" id="price" value="{{price}}"></td>\
									<td>\
										<select name="type" id="type">\
											<option value="House">house</option>\
											<option value="Appartment">appartment</option>\
										</select>\
									</td>\
									<td><i class="fa fa-close"></i></td>\
									<td><i class="fa fa-save"></i></td>\
									<td><h3 id="error"></h3></td>\
								</tr>';

//-------View partial mail-------
oViews.partials.mail = '<h3 id="title">Enter a message and subject to send to {{first_name}} {{last_name}} @ {{email}}</h3>\
						<input type="text" id="subject" placeholder="Enter a subject...">\
						<textarea type="text" id="message" value="enter a message to send..." placeholder="Enter a message to send"></textarea>\
						<h3 id="error"></h3>\
						<div id="mail-buttons">\
							<button id="send-mail" data-email-address="{{email}}">Send mail</button>\
							<button id="cancel-mail">Cancel</button>\
						</div>';

//-------View partial mail success-------
oViews.partials.mailSuccess = '<h3>Mail sent!</h3>\
							  <button id="close-mail-form">Close form</button>';