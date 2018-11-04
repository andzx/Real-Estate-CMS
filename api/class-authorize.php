<?php
require_once "../dependencies/random/lib/random.php";

class authorize {
    var $file_data;
    var $filename = "../users.db";
    var $secret;
    var $user_level;
    var $users_data;
    var $save_data;
    var $response;
    var $logged_in;
    var $credentials;

    //Get users data from a text file
    private function get_users_data()
    {
        //Get file data
        $this->file_data = file_get_contents($this->filename);
        
        //Process file text string content into an array
        $this->users_data = json_decode($this->file_data);

        //Check if data from file is corrupt or not
        if(!$this->file_data){
            return false;
        }
        return true;
    }

    //Save users data to a text file
    private function save_users_data()
    {
        //Encode the data array into a text string
        $this->save_data = json_encode($this->users_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        //Save the text string to the database file
        file_put_contents($this->filename, $this->save_data);
    }

    //Generate a random string function
    private function random_str($length, $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    {
        //Generates a random string of given length
        $str = '';
        $max = mb_strlen($keyspace, '8bit') - 1;
        for ($i = 0; $i < $length; ++$i) {
            $str .= $keyspace[random_int(0, $max)];
        }
        return $str;
    }

    //Generate a secret
    private function generate_secret()
    {
        $this->secret = $this->random_str(64);
    }

    //Login function
    public function login($credentials)
    {
        //Store credentials
        $this->credentials = $credentials;

        //Decode the credentials string into JSON array
        $this->credentials = json_decode($this->credentials);

        //If users data was not retrieved respond with a fail JSON string
        if(!$this->get_users_data())
        {
            exit('{"status":"fail", "error":"authorization failure"}');
        }
        else
        {
            //Iterate through the users data and search for a matching email and password
            for($i=0;$i<sizeof($this->users_data);$i++)
            {
                if($this->users_data[$i]->email == $this->credentials->email &&
                   $this->users_data[$i]->password == $this->credentials->password)
                {
                    //Match found, generate secret
                    $this->generate_secret();

                    //Store the newly generated secret
                    $this->users_data[$i]->secret = $this->secret;

                    //Save users data
                    $this->save_users_data();

                    //Create response
                    $this->response = ["status" => "ok",
                                       "user_level" => $this->users_data[$i]->user_level,
                                       "first_name" => $this->users_data[$i]->first_name];

                    //Set user logged in
                    $this->logged_in = true;

                    //Start a session
                    session_start();

                    //Store users secret and users_level
                    $_SESSION["secret"] = $this->secret;
                    $_SESSION["user_level"] = $this->users_data[$i]->user_level;

                    //Break the loop, no more searching necessary since match found
                    break;
                }
            }

            //If no match was found while iterating through data display an error message
            if(!$this->logged_in)
            {
                $this->response = ["status" => "fail", "error" => "Authorization failed"];
            }
        }
    }

    //Logout function
    public function logout()
    {
        //Start session
        session_start();

        //Get session parameters/cookies
        if(ini_get("session.use_cookies"))
        {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        //Destroy the session
        session_destroy();
    }

    //Check if user is authorized
    public function is_user_authorized()
    {
        //Start a session
        session_start();

        if(!isset($_SESSION["user_level"]) || !isset($_SESSION["secret"]))
        {
            exit('{"status":"fail","error":"Authorization failure"}');
        }
    }

    //Get user level of the current user
    public function get_user_level()
    {
        return $this->user_level;
    }

    //Print a JSON string response
    public function print_response()
    {
        //Encode the response
        $this->response = json_encode($this->response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        //Output response
        print($this->response);
    }
}
?>