//Setup the Controllers object
//This contains all controllers
oControllers = {};

//-----Controller context menu-----
oControllers.contextMenu = function(){
	$("body").on("contextmenu", function(){
       renderView(oViews.contextMenu);
       oControllers.contextMenu();
       oControllers.menu();
       return false;
    });
}

//-----Controller setup-----
oControllers.setup = function(){
	//Setup button functionality
	$("#btn-setup").on("click", function(e){
		//Prevent form submission
		e.preventDefault();
		//Get the data from the form
		var sRequestData = getFormData(".setup");
		//Build request data
		var jRequest = {"request_data":sRequestData};
		//Set POST URL
		var sURL = "api/api-create-super-admin.php";
		//Perform ajax post request to api
		$.post(sURL, jRequest, function(jResponse){
			//If status ok show login screen
			if(jResponse.status == "ok"){
				renderView(oViews.login);
				oControllers.login();
			}else{
				//Status wasn't ok, reset client
				startClient();
			}
		}, "json");
	});
}

//-----Controller register-----
oControllers.register = function(){
	//Register button functionality
	$("#btn-register").on("click", function(e){
		//Prevent form submission
		e.preventDefault();
		//Get form data, build request and set post URL
		var sRequestData = getFormData(".register");
		var jRequest = {"request_data":sRequestData};
		var sURL = "api/api-register.php";

		//Get values
		sPassword = $("#password").val();
		sEmail = $("#email").val();
		sFirstName = $("#first-name").val();
		sLastName = $("#last-name").val();

		//Check inputs
		bPassword = checkLength(sPassword, 3, 64);
		bEmail = checkEmail(sEmail);
		bFirstName = checkLength(sFirstName, 3, 64);
		bLastName = checkLength(sLastName, 3, 64);

		if(bPassword && bEmail && bFirstName && bLastName){
			//Perform an ajax post request to the api
			$.post(sURL, jRequest, function(jResponse){
				//If status ok show success message
				if(jResponse.status == "ok"){
					var sTempView = oViews.registrySuccess;
					sTempView = sTempView.replace("{{message}}", "Proceed to login");
					//Render the success view and add controller
					renderView(sTempView);
					oControllers.registrySuccess();
				}else{
					//Registering failed, shake window
					$(".register").shake();
					//Display error message
					var sErrorMessage = '<i class="fa fa-lg fa-window-close"></i> ' + jResponse.error;
					$("#error").html(sErrorMessage);
					$("#error").show();
				}
			}, "json");
		}else{
			//Show an error, shake the form
			var sMessage;

			//Display email error
			if(!bEmail){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, valid email must be provided";
			}

			//Display password error
			if(!bPassword){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, password must be between 3 and 64 characters long";
			}

			//Display address error
			if(!bLastName){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, last name must be between 3 and 64 characters long";
			}

			//Display price error
			if(!bFirstName){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, first name must be between 3 and 64 characters long";	
			}

			$(".register").shake();
			$("#error").html(sMessage);
			$("#error").show();
		}
	});
	//Back button functionality
	$("#btn-back").on("click", function(e){
		//Prevent form submission
		e.preventDefault();
		//Show login view + add login controller
		renderView(oViews.login);
		oControllers.login();
	});
}

//-----Controller success-----
oControllers.registrySuccess = function(){
	//Proceed button functionality
	$("#btn-proceed").on("click", function(e){
		//Prevent form submission
		e.preventDefault();
		//Show login view + add login controller
		renderView(oViews.login);
		oControllers.login();
	});
}

//-----Controller login-----
oControllers.login = function(){
	//Login button functionality
	$("#btn-login").on("click", function(e){
		//Prevent form submission
		e.preventDefault();

		//Get form data, build request and set post URL
		var sRequestData = getFormData(".login");
		var jRequest = {"credentials":sRequestData};
		var sURL = "api/api-login.php";

		//Get data variables
		var sEmail = $("#email").val();
		var sPassword = $("#password").val();

		//Validate password length and email
		var bEmail = checkEmail(sEmail);
		var bPassword = checkLength(sPassword, 3, 64);

		if(bEmail && bPassword){
			//Perform ajax post request to the api
			$.post(sURL, jRequest, function(jResponse){
				//If response ok save First name and user level
				if(jResponse.status == "ok"){
					oClient.sFirstName = jResponse.first_name;
					oClient.sUserLevel = jResponse.user_level;
					//Make a copy of the view welcome
					var sTempView = oViews.welcome;
					//Replace placeholder with users first name
					sTempView = sTempView.replace("{{first_name}}", oClient.sFirstName);
					//Add view to the page
					renderView(sTempView);
					renderMenu();
					oControllers.menu();
					oControllers.contextMenu();

					//Get the last property id
					getLastPropertyId();

					//Add an interval to check for new properties
					checkNewProperties();
				}else{
					//If login failed notify user by shaking
					//the login form
					$(".login").shake();
				}
			}, "json");
		}else{
			$(".login").shake();
		}
	});
	//Register button functionality
	$("#btn-register").on("click", function(e){
		//Prevent form submission
		e.preventDefault();
		//Render the register view and add register controller
		renderView(oViews.register);
		oControllers.register();
	});
}

//-----Controller menu-----
oControllers.menu = function(){
	$(".wdw").on("click", ".link", function(e){
		//Prevent submission
		e.preventDefault();
		//Get the page that user is requesting
		var sLocation = $(this).attr("data-go-to");
		//Case users page
		if(sLocation == "users"){
			renderView(oViews.users);
			renderMenu();
			oControllers.users();
			oControllers.menu();
			oControllers.contextMenu();
		}
		//Case create user page
		if(sLocation == "createUser"){
			renderView(oViews.createUser);
			renderMenu();
			oControllers.createUser();
			oControllers.menu();
	        oControllers.contextMenu();
		}
		//Case properties page
		if(sLocation == "properties"){
			renderView(oViews.properties);
			renderMenu();
			oControllers.properties();
			oControllers.menu();
			oControllers.contextMenu();
		}
		//Case create property page
		if(sLocation == "createProperty"){
			renderView(oViews.createProperty);
			renderMenu();
			oControllers.createProperty();
			oControllers.menu();
			oControllers.contextMenu();
		}
		//Case logout
		if(sLocation == "logout"){
			oControllers.logout();
		}
	});

	//Hide the pages that the user is not supposed to see
	//based on user permissions
	menuPermissions();
}

//Logout controller
oControllers.logout = function(){
	var sURL = "api/api-logout.php";
	//Perform a post request the api
	$.post(sURL, function(jResponse){
		if(jResponse.status == "ok"){
			//Reset the client
			startClient();
		}
	},"json");
	//Stop listening to new properties
	stopCheckingForNewProperties();
}

//Users view controller
oControllers.users = function(){
	//Set get request URL
	var sURL = "api/api-get-users.php";
	//Get the users from the api via ajax get request
	$.get(sURL, function(jResponse){
		//Iterate through the data that was retrieved
		for(var i=0; i<jResponse.response_data.length; i++){
			//Create a copy of the view
			var sTempView = oViews.partials.user;
			//Make short variables
			var iId = jResponse.response_data[i].id;
			var sFirstName = jResponse.response_data[i].first_name;
			var sLastName = jResponse.response_data[i].last_name;
			var sUserLevel = jResponse.response_data[i].user_level;
			var sEmail = jResponse.response_data[i].email;
			//Insert values into the temp view
			sTempView = sTempView.replace(/{{id}}/g, iId);
			sTempView = sTempView.replace(/{{first_name}}/g, sFirstName);
			sTempView = sTempView.replace(/{{last_name}}/g, sLastName);
			sTempView = sTempView.replace("{{user_level}}", sUserLevel);
			sTempView = sTempView.replace(/{{email}}/g, sEmail);
			//Add view to dom
			$("table").append(sTempView);
		}

		//Send mail form functionality
		$(".fa-mail-forward").on("click", function(e){
			//Prevent submission
			e.preventDefault();

			//Kill mail form in case it was already clicked on
			$("#mail-form").html("");

			//Get the users data
			var sEmail = $(this).attr("data-email");
			var sFirstName = $(this).attr("data-first-name");
			var sLastName = $(this).attr("data-last-name");

			//Create a view copy
			var sTempView = oViews.partials.mail;

			//Insert data
			sTempView = sTempView.replace("{{first_name}}", sFirstName);
			sTempView = sTempView.replace("{{last_name}}", sLastName);
			sTempView = sTempView.replace(/{{email}}/g, sEmail);

			//Append the mail form
			$("#mail-form").append(sTempView);

			//Sow the form
			$("#mail-form").show();

			//Close functionality
			$("#cancel-mail").on("click", function(e){
				//Prevent submission
				e.preventDefault();

				//Hide the mail form
				$("#mail-form").html("");
				$("#mail-form").hide();
			});

			//Send button functionality
			$("#send-mail").on("click", function(e){
				//Prevent submission
				e.preventDefault();

				//Get the data
				var sEmail = $(this).attr("data-email-address");
				var sMessage = $("#message").val();
				var sSubject = $("#subject").val();

				//Pack the data
				var sRequest = {"email":sEmail,
								"message":sMessage,
								"subject":sSubject};

				//Send a request to the mail api
				var sURL = "api/api-send-mail.php";

				//Validate the data
				var bEmail = checkEmail(sEmail);
				var bMessage = checkLength(sMessage, 3, 2000);
				var bSubject = checkLength(sSubject, 3, 255);

				if(bEmail && bMessage && bSubject){
					//Add a loading animation
					//It takes a while to send the mail
					$("#error").html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom"></i>');
					
					//Send a post request to the api
					$.post(sURL, sRequest, function(jResponse){
						if(jResponse.status == "ok"){
							//Change mail form view
							$("#mail-form").html(oViews.partials.mailSuccess);

							//Add mail form close functionality
							$("#close-mail-form").on("click", function(e){
								//Prevent submission
								e.preventDefault();
								//Remove the mail form
								$("#mail-form").html("");
								$("#mail-form").hide();
							});
						}else{
							$("#error").html(jResponse.error);
							$("#error").show();
							blinkElement("#mail-form");
						}
					}, "json");
				}else{
					//Set up a message
					var sMessage;

					if(!bEmail){
						sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, valid email must be provided";
					}

					if(!bMessage){
						sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, the message length must be between 3 and 2000 characters";
					}

					if(!bSubject){
						sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, the subject length must be between 3 and 255 characters";
					}

					//Display error
					$("#error").html(sMessage);
					$("#error").show();
				}
			});
		});
		
		//User delete functionality
		$(".fa-trash").on("click", function(){
			//Get rid of edit in case it was open for
			//the same property that is being delete
			$(".edit-error").remove();
			$(".edit").remove();

			var iRowId = $(this).attr("data-id");
			var sURL = "api/api-delete-user.php";
			var sRequest = {"id": iRowId};
			//Send the user delete request
			$.post(sURL, sRequest, function(jResponse){
				//Delete data from dom
				if(jResponse.status == "ok"){
					$("#user" + iRowId).remove();
				}
			}, "json");
		});
		
		//Edit functionality
		$(".fa-edit").on("click", function(){
			$(".edit-error").remove();
			$(".edit").remove();

			//Get id
			var iRowId = $(this).attr("data-id");
			
			//Create temp view
			var sTempView = oViews.partials.editUser;

			//Make short variables
			var iId = $("#user"+iRowId+"> td:nth-of-type(1)").text();
			var sFirstName = $("#user"+iRowId+" > td:nth-of-type(2)").text();
			var sLastName = $("#user"+iRowId+" > td:nth-of-type(3)").text();
			var sUserLevel = $("#user"+iRowId+" > td:nth-of-type(4)").text();
			var sEmail = $("#user"+iRowId+" > td:nth-of-type(5)").text();

			//Insert variables into the temp view
			sTempView = sTempView.replace(/{{id}}/g, iId);
			sTempView = sTempView.replace("{{first_name}}", sFirstName);
			sTempView = sTempView.replace("{{last_name}}", sLastName);
			sTempView = sTempView.replace("{{user_level}}", sUserLevel);
			sTempView = sTempView.replace("{{email}}", sEmail);

			//Add view to dom
			$(sTempView).insertAfter("#user" + iRowId);

			//Select user level in the edit menu
			$("#user_level").val(sUserLevel);

			//Close functionality
			$(".fa-close").on("click", function(){
				$("#editUser"+iRowId).remove();
				$(".edit-error").remove();
			});

			//Save functionality
			$(".fa-save").on("click", function(){
				//Get data & make short variables
				var iId = $(".edit").attr("data-id");
				var sFirstName = $(".edit > td:nth-of-type(2) > input").val();
				var sLastName = $(".edit > td:nth-of-type(3) > input").val();
				var sUserLevel = $("option:selected").val();
				var sEmail = $(".edit > td:nth-of-type(5) > input").val();
				
				//Build request data
				var sRequestData = JSON.stringify({
					"id": iId,
					"first_name":sFirstName,
					"last_name":sLastName,
					"user_level":sUserLevel,
					"email":sEmail
				});
				
				//Build request
				var jRequest = {"request_data":sRequestData};
				var sURL = "api/api-edit-user.php";

				//Validate data
				bFirstName = checkLength(sFirstName, 3, 64);
				bLastName = checkLength(sLastName, 3, 64);
				bUserLevel = checkUserLevel(sUserLevel);
				bEmail = checkEmail(sEmail);

				//Validate the data
				if(bFirstName && bLastName && bUserLevel && bEmail){
					//Send request
					$.post(sURL, jRequest, function(jResponse){
						//Check response
						if(jResponse.status == "ok"){
							//Get the new data for dom
							var sFirstName = $(".edit > td:nth-of-type(2) > input").val();
							var sLastName = $(".edit > td:nth-of-type(3) > input").val();
							var sUserLevel = $("option:selected").val();
							var sEmail = $(".edit > td:nth-of-type(5) > input").val();
							
							//Change the data in the dom
							$("#user"+ iId +" > td:nth-of-type(2)").text(sFirstName);
							$("#user"+ iId +" > td:nth-of-type(3)").text(sLastName);
							$("#user"+ iId +" > td:nth-of-type(4)").text(sUserLevel);
							$("#user"+ iId +" > td:nth-of-type(5)").text(sEmail);
						
							//Get rid of edit
							$(".edit").remove();
							$(".edit-error").remove();
						}else{
							$("#error").html('<i class="fa fa-lg fa-window-close"></i> ' + jResponse.error);
							$("#error").show();
							blinkElement(".edit");
						}
					}, "json");
				}else{
					//Alert the user to an error
					var sMessage;
					
					//Make the error message
					if(!bFirstName){
						sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, name must be between 3 and 64 characters long";
					}

					if(!bLastName){
						sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, last name must be between 3 and 64 characters long";
					}

					if(!bUserLevel){
						sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, price must be between 3 and 64 numerals long";
					}

					if(!bEmail){
						sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, valid email must be provided";
					}

					//Display error

					//Blink the edit menu to alert the user to the error
					$("#error").html(sMessage);
					$("#error").show();
					blinkElement(".edit");
				}
			});
		});
	}, "json");
}

//View property controller
oControllers.viewProperty = function(iId, sAddress, iPrice, sType, aImages){
	//Display the property images
	for(var i=0;i<aImages.length;i++){
		var sSource = "/images/" + aImages[i];
		var iImage = i+1;
		$("#property-image-"+iImage).attr("src", sSource);
	}

	//Reformat map address variable for google maps API
	//Replace spaces with + signs
	var sURLMapAddress = sAddress.replace(/ /g, "+");

	//Set google maps API URL, restrict country to Denmark with country code DK
	var sURL = "https://maps.googleapis.com/maps/api/geocode/json?address="+ sURLMapAddress +",+DK&key=AIzaSyDC4vZI18p4OfviF3AIJFMmVy0PsrktS7E"; 

	//Get map coordinates
	$.get(sURL, function(jResponse){
		if(jResponse.status != "ZERO_RESULTS"){
			//Store
			fLatitude = jResponse.results[0].geometry.location.lat;
			fLongitude = jResponse.results[0].geometry.location.lng;
			sPlaceId = jResponse.results[0].place_id;

			//Create the map
			map = new google.maps.Map(document.querySelector('.map'), {
				center: {lat: fLatitude, lng: fLongitude},
				zoom: 16
			});

			//Create the map marker
	        var marker = new google.maps.Marker({
	            position: new google.maps.LatLng(fLatitude, fLongitude),
	            map: map,
	            title: sAddress
	        });

	        //Create a balloon tooltip
	        var contentString = '<div id="content" style="width: auto; height: auto;"><h1>'+ sAddress +'</h1><h2>'+ iPrice +' DKK</h2></div>';
	        var infowindow = new google.maps.InfoWindow({
	            content: contentString
	        });

	        //Create the map
	        google.maps.event.addListener(marker, 'click', function() {
	         	infowindow.open(map,marker);
	        });

	        //To add the marker to the map, call setMap();
	        marker.setMap(map);
    	}else{
    		$(".map").html('<h3><i class="fa fa-lg fa-window-close"></i> Error, Address not found!</h3>');
    	}
	});
}

//Properties view controller
oControllers.properties = function(){
	//Set URL
	var sURL = "api/api-get-properties.php";
	//Get users via api with ajax get request
	$.get(sURL, function(jResponse){
		//Iterate through the data that was retrieved
		for(var i=0; i<jResponse.response_data.length; i++){
			//Create a copy of the view
			var sTempView = oViews.partials.property;
			//Make short variables
			var iId = jResponse.response_data[i].id;
			var sAddress = jResponse.response_data[i].address;
			var iPrice = jResponse.response_data[i].price;
			var sType = jResponse.response_data[i].type;
			var aImages = jResponse.response_data[i].images;
			var sTypeOnly = sType;

			//Select an icon
			if(sType == "house"){
				sType = '<i class="fa fa-home"></i>House';
			}else{
				sType = '<i class="fa fa-building"></i>Appartment';
			}

			//Insert values into the 
			sTempView = sTempView.replace(/{{id}}/g, iId);
			sTempView = sTempView.replace(/{{address}}/g, sAddress);
			sTempView = sTempView.replace(/{{price}}/g, iPrice);
			sTempView = sTempView.replace("{{type}}", sType);
			sTempView = sTempView.replace("{{type_only}}", sTypeOnly);
			//Add view to dom
			$("table").append(sTempView);

			//Store last property id
			oClient.iLastPropertyId = iId;
		}

		//Hide edit and delete buttons from user with userlevel users
		crudPermissions();

		//View property functionality
		$(".view-property").on("click", function(){
			//Get the property data
			var iId = $(this).attr("data-id");
			var sAddress = $(this).attr("data-address");
			var iPrice = $(this).attr("data-price");
			var sType = $(this).attr("data-type");

			if(sType == "house"){
				sType = '<i class="fa fa-home"></i>House';
			}else{
				sType = '<i class="fa fa-building"></i>Appartment';
			}

			//Make a copy of the view
			sTempView = oViews.viewProperty;
			sTempView = sTempView.replace("{{address}}", sAddress);
			sTempView = sTempView.replace("{{price}}", iPrice);
			sTempView = sTempView.replace("{{type}}", sType);

			//Render the view property view and menu and add controllers
			renderView(sTempView);
			oControllers.viewProperty(iId, sAddress, iPrice, sType, aImages);
			renderMenu();
			oControllers.menu();
		});
		
		//User delete functionality
		$(".fa-trash").on("click", function(){
			var iRowId = $(this).attr("data-id");
			var sURL = "api/api-delete-property.php";
			var sRequest = {"id": iRowId};
			//Send the user delete request
			$.post(sURL, sRequest, function(jResponse){
				//Delete data from dom
				if(jResponse.status == "ok"){
					$("#property" + iRowId).remove();
				}
			}, "json");
		});
		
		//Edit functionality
		$(".fa-edit").on("click", function(){
			//Kill existing instances of edit
			$(".edit-error").remove();
			$(".edit").remove();

			//Get id
			var iRowId = $(this).attr("data-id");
			
			//Create temp view
			var sTempView = oViews.partials.editProperty;

			//Make short variables
			var iId = $("#property"+iRowId+"> td:nth-of-type(1)").text();
			var sAddress = $("#property"+iRowId+" > td:nth-of-type(2)").text();
			var iPrice = $("#property"+iRowId+" > td:nth-of-type(3)").text();
			var sType = $("#property"+iRowId+" > td:nth-of-type(4)").text();

			//Insert variables into the temp view
			sTempView = sTempView.replace(/{{id}}/g, iId);
			sTempView = sTempView.replace("{{address}}", sAddress);
			sTempView = sTempView.replace("{{price}}", iPrice);

			//Add view to dom
			$(sTempView).insertAfter("#property" + iRowId);

			//Select home or appartment
			$("#type").val(sType);

			//Close functionality
			$(".fa-close").on("click", function(){
				$("#editProperty"+iRowId).remove();
			});

			//Save functionality
			$(".fa-save").on("click", function(){
				//Get data & make short variables
				var iId = $(".edit").attr("data-id");
				var sAddress = $(".edit > td:nth-of-type(2) > input").val();
				var iPrice = $(".edit > td:nth-of-type(3) > input").val();
				var sType = $("option:selected").text();

				//Build request data
				var sRequestData = JSON.stringify({
					"id": iId,
					"address":sAddress,
					"price":iPrice,
					"type":sType
				});
				
				//Build request
				var jRequest = {"request_data":sRequestData};
				var sURL = "api/api-edit-property.php";

				//Validate inputs
				bAddress = checkLength(sAddress, 3, 64);
				bPrice = checkLength(iPrice, 3, 64);
				bType = checkPropertyType(sType);

				//Check if address is a valid location in Denmark
				var bValidAPIAddress;

				//Reformat map address variable for google maps API
				//Replace spaces with + signs
				var sURLMapAddress = sAddress.replace(/ /g, "+");

				//Set google maps API URL, restrict country to Denmark with country code DK
				var sMapURL = "https://maps.googleapis.com/maps/api/geocode/json?address="+ sURLMapAddress +",+DK&key=AIzaSyDC4vZI18p4OfviF3AIJFMmVy0PsrktS7E"; 

				//****************************************************//
				//Bug here, some odd addresses will get validated also//
				//Even dispite being outside Denmark range************//
				//****************************************************//

				//Validate address via google Maps API
				$.get(sMapURL, function(jResponse){
					if(jResponse.status == "ZERO_RESULTS"){
						bValidAPIAddress = false;
					}else{
						bValidAPIAddress = true;
					}

					if(bAddress && bPrice && bType && bValidAPIAddress){
						//Hide error if one was shown
						$("#error").hide();

						//Send request
						$.post(sURL, jRequest, function(jResponse){
							if(jResponse.status == "ok"){
								//Get the new data for dom
								var sAddress = $(".edit > td:nth-of-type(2) > input").val();
								var iPrice = $(".edit > td:nth-of-type(3) > input").val();
								var sType = $("option:selected").text();
								
								//Select an icon
								if(sType == "house"){
									sType = '<i class="fa fa-home"></i>House';
								}
								if(sType == "appartment"){
									sType = '<i class="fa fa-building"></i>Appartment';
								}

								//Change the data in the dom
								$("#property"+iId+" > td:nth-of-type(2)").text(sAddress);
								$("#property"+iId+" > td:nth-of-type(3)").text(iPrice);
								$("#property"+iId+" > td:nth-of-type(4)").html(sType);
							}
						}, "json");
					}else{
						blinkElement(".edit");

						//Make an error message
						var sMessage;

						if(!bAddress){
							sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, address must be between 3 and 64 characters long";
						}

						if(!bValidAPIAddress){
							sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, invalid address";
						}

						if(!bType){
							sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, type must be appartment or house";
						}

						if(!bPrice){
							sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "error, price must be between 3 and 64 numerals long";
						}

						$("#error").html(sMessage);
						$("#error").show();
					}
				});
			});
		});
	}, "json");
}

oControllers.createUser = function(){
	$("#btn-create-user").on("click", function(e){
		//Prevent submission
		e.preventDefault();
		//Get user type
		var sType = $("option:selected").text();
		//Set request URL and pack form data
		sURL = "api/api-create-user.php";
		sRequestData = getFormData(".create-user");
		sRequestData.type = sType;
		jRequest = {"request_data":sRequestData};

		//Get variables for validation
		sFirstName = $("#first-name").val();
		sLastName = $("#last-name").val();
		sEmail = $("#email").val();
		sPassword = $("#password").val();

		//Check variables
		bFirstName = checkLength(sFirstName, 3, 64);
		bLastName = checkLength(sLastName, 3, 64);
		bEmail = checkEmail(sEmail);
		bPassword = checkLength(sPassword, 3, 64);

		if(bFirstName && bLastName && bEmail && bPassword){
			//Perform an ajax post request to the api
			$.post(sURL, jRequest, function(jResponse){
				//If response is ok show success view
				if(jResponse.status == "ok"){
					//Make a view copy
					var sTempView = oViews.postSuccess;
					sTempView = sTempView.replace("{{message}}", "User has been created.");				
					//Render the view
					renderView(sTempView);
					oControllers.postSuccessUser();
				}else{
					$(".create-user").shake();
					var sErrorMessage = '<i class="fa fa-lg fa-window-close"></i> ' + jResponse.error;
					$("#error").html(sErrorMessage);
					$("#error").show();
				}
			}, "json");
		}else{
			//Show an error, shake the form
			var sMessage;

			//Display password error
			if(!bPassword){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, password must be between 3 and 64 characters long";
			}

			//Display email error
			if(!bEmail){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, valid email must be provided";
			}

			//Display address error
			if(!bLastName){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, last name must be between 3 and 64 characters long";
			}

			//Display price error
			if(!bFirstName){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, first name must be between 3 and 64 characters long";	
			}

			$("#box-setup").shake();
			$("#error").html(sMessage);
			$("#error").show();
		}
	});
}

//Create property view controller
oControllers.createProperty = function(){
	$(".create-property").on("submit", function(e){
		//Prevent submission
		e.preventDefault();

		//Get form and selection data
		var sType = $("option:selected").val();
		sRequestData = getFormData(".create-property");
		sRequestData.type = sType;

		//Check if images have been selected
		var sImageOne = $("#image-one").val();
		var sImageTwo = $("#image-two").val();
		var sImageThree = $("#image-three").val();

		//Check the length of address and price
		var bValidAddress = checkLength($("#address").val(), 3, 64);
		var bValidPrice = checkLength($("#price").val(), 3, 64);

		//Check if address is a valid location in Denmark
		var bValidAPIAddress;

		//Reformat map address variable for google maps API
		//Replace spaces with + signs
		var sAddress = $("#address").val();
		var sURLMapAddress = sAddress.replace(/ /g, "+");

		//Set google maps API URL, restrict country to Denmark with country code DK
		var sMapURL = "https://maps.googleapis.com/maps/api/geocode/json?address="+ sURLMapAddress +",+DK&key=AIzaSyDC4vZI18p4OfviF3AIJFMmVy0PsrktS7E"; 

		//Validate address via API
		$.get(sMapURL, function(jResponse){
			if(jResponse.status == "ZERO_RESULTS"){
				bValidAPIAddress = false;
			}else{
				bValidAPIAddress = true;
			}
		});

		//*********************************//
		//----Bugg here, maps API disabled-//
		//*********************************//

		//Perform validation
		if(sImageOne && sImageTwo && sImageThree && bValidAddress == true && bValidPrice == true){
			//Pack the image data
			var formData = new FormData(this);
			//Add request data
			formData.append("request_data", sRequestData);

			//Send the images to the server
			$.ajax({
			        type: "POST",
			        url: 'api/api-create-property.php',
			        data: formData,
			        cache: false,
			        dataType: "json",
			        contentType: false,
			        processData: false,
			        timeout: 10000,
			        success: function(jResponse){
				    	if(jResponse.status == "ok"){
							//Make a view copy
							var sTempView = oViews.postSuccess;
							//Insert message
							sTempView = sTempView.replace("{{message}}", "Property has been created.");
							//Render the view and add controller to it
							renderView(sTempView);
							oControllers.postSuccessProperty();
				    	}else{
				    		$(".create-property").shake();
				    	}
			        }
			    });
		}else{
			//Show an error, shake the form
			var sMessage;

			//Display image selection error
			if(!sImageOne || !sImageTwo || !sImageThree){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, 3 images must be selected";
			}

			//Display price error
			if(!bValidPrice){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, price must be between 3 and 64 numerals long";	
			}

			//*********************************//
			//----Bugg here, maps API disabled-//
			//*********************************//

			//Display address error
			/*if(!bValidAddress){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, address must be between 3 and 64 numerals long";
			}*/

			//Display address error
			if(!bValidAPIAddress){
				sMessage = '<i class="fa fa-lg fa-window-close"></i> ' + "Error, invalid address";
			}

			$("#box-setup").shake();
			$("#error").html(sMessage);
			$("#error").show();
		}
	});
}

//User successfully posted controller
oControllers.postSuccessUser = function(){
	//Button proceed functionality
	$("#btn-proceed").on("click", function(e){
		//Prevent submission
		e.preventDefault();
		//Render views and add controllers
		renderView(oViews.users);
		renderMenu();
		oControllers.users();
		oControllers.menu();
	});
}

//Property successfully posted controller
oControllers.postSuccessProperty = function(){
	//Button proceed functionality
	$("#btn-proceed").on("click", function(e){
		//Prevent submission
		e.preventDefault();
		//Render views and add controllers
		renderView(oViews.properties);
		renderMenu();
		oControllers.properties();
		oControllers.menu();
	});
}