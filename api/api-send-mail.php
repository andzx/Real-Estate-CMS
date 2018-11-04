<?php
    require_once 'class-authorize.php';

    //Start session
    $authorize = new authorize;
    $authorize->is_user_authorized();

    //Check if user has permission to perform the requested operation
    if($_SESSION["user_level"] == "user")
    {
      exit('{"status":"fail", "error":"Insufficient permissions"}');
    }

    //Check if request data was sent
    if(!isset($_POST["email"]) ||
       !isset($_POST["message"]) ||
       !isset($_POST["subject"]))
    {
      exit('{"status":"fail", "error":"Invalid request data"}');
    }

    //Get email address and message
    $email_address = $_POST["email"];
    $email_message = htmlspecialchars($_POST["message"]);
    $email_subject = htmlspecialchars($_POST["subject"]);

    //Check subject and message length
    if(strlen($email_subject) > 255 ||
      strlen($email_subject) < 3 ||
      strlen($email_message) > 2000 ||
      strlen($email_message) < 3)
    {
      print('{"status":"fail", "error":"Invalid data length"}');
    }

    //Check the email address validity
    if(!filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
        exit('{"status":"fail", "error":"Invalid email address"}');
    }

    //Include pear email function
    require_once 'Mail.php';
    
    //Set up credentials and email headers
    $headers = ['From' => 'exam.mail.andris.greidans@gmail.com',
                'To' => $email_address,
                'Subject' => $email_subject,
                'Reply-to' => 'exam.mail.andris.greidans@gmail.com'];
    
    //Set up the SMTP & mail factory class
    $smtp = Mail::factory('smtp', ['host' => 'ssl://smtp.gmail.com',
                                   'port' => '465',
                                   'auth' => true,
                                   'username' => 'exam.mail.andris.greidans@gmail.com',
                                   'password' => 'blasphemy'
                                  ]
                          );

    //Send the email
    $mail = $smtp->send($email_address, $headers, $email_message);

    //Check if the mail was successfully sent
    if(PEAR::isError($mail)){
      echo('{"status":"fail", "error":"Mail failed to send"}');
    }
    else
    {
      echo('{"status":"ok"}');
    }
?>