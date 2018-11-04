	//Functions
	//Check user type
	function checkUserLevel(sType){
		if(sType == "user" || sType == "admin" || sType == "super"){
			return true;
		}
		return false;
	}

	//Check property type
	function checkPropertyType(sType){
		if(sType == "house" || sType == "appartment"){
			return true;
		}
		return false;
	}

	//Show a desktop notification
	function displayDekstopNotification(sAddress, iPrice, sType){
		//Make a message string
		var sMessage = "A new " + sType + " property at " + sAddress + " priced " + iPrice + " has been posted.";

		//Check if browser supports notifications
		if(!("Notification" in window)){
			console.log("Notifications not supported by this browser");
		}

		// Let's check whether notification permissions have already been granted
		else if(Notification.permission === "granted"){
			// If it's okay let's create a notification
			var notification = new Notification(sMessage);
			var oSound = new Audio("notification.wav");
			oSound.play();
		}

		// Otherwise, we need to ask the user for permission
		else if(Notification.permission !== "denied"){
			Notification.requestPermission(function(permission){
				// If the user accepts, let's create a notification
				if(permission === "granted") {
					var notification = new Notification(sMessage);
					var oSound = new Audio("notification.wav");
					oSound.play();
				}
			});
		}
	}

	//Get the last property id
	function getLastPropertyId(){
		//Get last property id from api
		var sURL = 'api/api-get-last-property-id.php';
		$.get(sURL, function(jResponse){
			//Store the last property id
			oClient.iLastPropertyId = jResponse.last_property_id;
		}, "json");
	}
	
	//Kill the check properties interval
	function stopCheckingForNewProperties()
	{
		clearInterval(oClient.tPropertiesInterval);
	}

	//Check if a new property was added
	function checkNewProperties(){
		//Create a new interval
		oClient.tPropertiesInterval = setInterval(function(){
			//Get last property id from api
			var sURL = 'api/api-get-last-property-id.php?data=1';
			$.get(sURL, function(jResponse){
				//If there is a new property blink the title
				if(jResponse.last_property_id > oClient.iLastPropertyId){
					//Store the last property id
					oClient.iLastPropertyId = jResponse.last_property_id;
					var sAddress = jResponse.address;
					var iPrice = jResponse.price;
					var sType = jResponse.type;
					//Blink the title and alert the user
					//that a new property has been added
					blinkTitle();

					//Show a notification to the user
					//that a new property has been added
					displayDekstopNotification(sAddress, iPrice, sType);
				}
			}, "json");
		}, 2000);
	}

	//Blink title function
	function blinkTitle(){
		//Set variables
		var iIterator = 0;
		//Store original document title
		var sOriginalTitle = document.title;

		//Start an interval
		var tInterval = setInterval(function(){
			if(iIterator % 2 == 0){
				document.title = "..:A new property was added:..";
			}else{
				document.title = sOriginalTitle;
			}

			//Iterate
			iIterator++;

			if(iIterator == 4){
				clearInterval(tInterval);
			}
		}, 2000);
	}

	//Email validation function
	function checkEmail(sEmail){
		sRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		return sRegex.test(sEmail);
	}

	//Blink efect function
	function blinkElement(sTarget){
		//Run the fading loop function
		for(var i=0;i<3;i++){
			//Fade animation
			$(sTarget).fadeTo('fast', 0.5).fadeTo('fast', 1.0);
		}
	}

	//Check lengths
	function checkLengths(jValues, iMinLength, iMaxLength){
		//Variable containing information of how many variables passed the check
		var iPassed = 0;
		var iNumberOfValues = 0;

		//Iterate over objects
		$.each(jValues, function(key, value){
			//Get length
			var iLength = value.length;

			//Check length
			if(iLength >= iMinLength && iLength <= iMaxLength){
				iPassed++;
			}

			//Count the number of values
			iNumberOfValues++;
		});

		//Check how many variables passed the check
		if(iNumberOfValues == iPassed){
			return true;
		}
		return false;
	}

	//Length check function
	function checkLength(value, iMinLength, iMaxLength){
		//Length variable
		var iLength = value.length;

		//Check min and max length and return true if checking passes
		if(iLength >= iMinLength && iLength <= iMaxLength){
			return true;
		}

		//Checking didn't pass return false
		return false;
	}

	//Client initialization function
	function startClient(){
		oClient = {};

		var sURL = "api/api-system-status.php";

		$.post(sURL, function(jResponse){
			if(jResponse.status == "ok"){
				renderView(oViews.login);
				oControllers.login();
			}else{
				renderView(oViews.setup);
				oControllers.setup();
			}
		}, "json");
	}

	//Hides admin and super admin links
	function menuPermissions(){
		if(oClient.sUserLevel == "user"){
			$(".super-admin").hide();
			$(".admin").hide();
		}

		if(oClient.sUserLevel == "admin"){
			$(".super-admin").hide();
		}
	}

	function crudPermissions(){
		if(oClient.sUserLevel == "user"){
			$(".fa-trash").addClass("fa-close").css("color","red");
			$(".fa-edit").addClass("fa-close").css("color","red");
			$(".fa-trash").removeClass("fa-trash");
			$(".fa-edit").removeClass("fa-edit");
			$(".fa-close").off();
		}
	}

	//Renders a view into the browser
	function renderView(sView){
		$("body").html("");
		$("body").append(sView);
	}

	//Render menu partial
	function renderMenu(){
		$(".wdw").prepend(oViews.partials.menu);
	}

	//Returns form data by id, class, etc.
	function getFormData(sForm){
		var aForm = $(sForm).serializeArray();
		var jFormObject = {};
		var sFormData;

		$.each(aForm, function(i, v) {
	        jFormObject[v.name] = v.value;
	    });

		sFormData = JSON.stringify(jFormObject);

	    return sFormData;
	}