<?php
class users {
    var $request;
    var $response;
    var $secret;
    var $working_data;
    var $filename = "../users.db";
    var $errors = [];
    var $new_user;
    var $id;
    var $response_data = [];
    var $user_data = [];

    //Read the users text file
    public function read_file()
    {
        //Get file data
        $this->file_data = file_get_contents($this->filename);
        
        //Process file text string content into an array
        $this->working_data = json_decode($this->file_data);

        //Check if data from file is corrupt or not
        if(!$this->file_data){
            //Start a fresh array
            $this->working_data = [];
        }
    }

    //Check if a super admin exists in the database
    public function is_super_admin_setup()
    {
        if(sizeof($this->working_data) > 0){
            for($i=0;$i<$this->working_data;$i++)
            {
                if($this->working_data[$i]->user_level == "super_admin")
                {
                    //Super admin exists, return true
                    return true;
                }
            }
        }
        //Super admin does not exist, return false
        return false;
    }

    //Save users working data to a text file
    public function save_file()
    {
        //Encode the data array into a text string
        $this->save_data = json_encode($this->working_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        //Save the text string to the database file
        file_put_contents($this->filename, $this->save_data);
    }

    //Get a specific user's data
    public function get_user($id)
    {
        for($i=0;$i<sizeof($this->working_data);$i++)
        {
            if($this->working_data[$i]->id == $id)
            {
                foreach($this->working_data as $key => $value)
                {
                    $this->user_data[$key] = $value;
                }

                array_push($this->response_data, $this->working_data[$i]);

                //Clear the object
                $this->user_data = [];
            }
        }
    }

    //Retrieve users data from the text file and process into an array
    public function get_users()
    {
        for($i=0;$i<sizeof($this->working_data);$i++)
        {
            foreach($this->working_data[$i] as $key => $value)
            {
                $this->user_data[$key] = $value;
            }
            array_push($this->response_data, $this->user_data);

            //Clear the object
            $this->user_data = [];
        }
    }

    //Creates a new user in the working_data array
    public function create_user($string_json, $user_level = null)
    {
        //Convert string json into array json
        if(!$this->array_json = json_decode($string_json))
        {
            $this->errors[] = "Invalid JSON given";
        }

        //Create an array object
        $this->new_user = json_decode('{}');
        
        //Generate an id for the element
        $this->new_user->id = $this->generate_id();

        //Add given object properties to the new element
        foreach($this->array_json as $property => $value)
        {
            //Add object property to the element
            $this->new_user->{$property} = $value;
        }

        //If a hard user level was specified, use it
        if($user_level != null)
        {
            $this->new_user->user_level = $user_level;
        }

        //Check if email already exists and is taken
        for($i=0;$i<sizeof($this->working_data);$i++)
        {
            if($this->working_data[$i]->email == $this->new_user->email)
            {
                //Build response
                $this->response = ["status" => "fail",
                                   "error" => "Email already in use"];

                //Store the error
                $this->errors[] = "Email already in use";

                //Reset variable
                $this->new_user = null;

                //Break the loop, exit function
                return;
            }
        }

        //Add the new element to the working data array
        array_push($this->working_data, $this->new_user);

        //Build response
        $this->response = ["status" => "ok"];

        //Reset variable
        $this->new_user = null;
    }

    //Delete the first element which matches a given id
    public function delete_user($id){
        for($i=0;$i<sizeof($this->working_data);$i++){
            if($this->working_data[$i]->id == $id){
                //Delete the user
                array_splice($this->working_data, $i, 1);

                //Build response
                $this->response = ["status" => "ok"];
                return;
            }
        }

        //Build response
        $this->response = ["status" => "fail"];
    }

    //Update user data
    public function edit_user($user_data){
        //Decode the JSON
        $this->user_data = json_decode($user_data);
        
        //Check if JSON was decoded successfully
        if(!$this->user_data){
            $this->errors[] = "Invalid JSON";
            //Stop the function if JSON invalid
            return;
        }

        //Check if email already exists and is taken
        for($i=0;$i<sizeof($this->working_data);$i++)
        {
            if($this->working_data[$i]->email == $this->user_data->email)
            {
                //Build response
                $this->response = ["status" => "fail",
                                   "error" => "Email already in use"];

                //Store the error
                $this->errors[] = "Email already in use";

                //Reset variable
                $this->new_user = null;

                //Break the loop, exit function
                return;
            }
        }

        //Loop through existing data and look for a matching id
        for($i=0;$i<sizeof($this->working_data);$i++){ 
            //Check if id matches to anything in the text file
            if($this->working_data[$i]->id == $this->user_data->id){
                //Update element properties
                foreach($this->user_data as $key => $value){
                    $this->working_data[$i]->{$key} = $value;
                }

                //Build response
                $this->response = ["status" => "ok"];

                //Id match found, kill the loop, exit function
                return;
            }
        }

        //Build response
        $this->response = ["status" => "fail", "error" => "match not found"];
    }

    //Generate a new unique id for an element
    //that is larger than the largest present id
    private function generate_id(){
        //Loop through the data to find the highest id
        for($i=0;$i<sizeof($this->working_data);$i++){
            if($this->id < $this->working_data[$i]->id){
                $this->id = $this->working_data[$i]->id;
            }
        }

        //Make the newly generated id one number higher
        $this->id = $this->id+1;

        //Return id number
        return $this->id;
    }

    //Print response, secret is optional
    public function print_response($status_only = null)
    {
        //Build the response
        //If only status was requested status and error
        //will be sent, but not response data
        if($status_only == null)
        {
            $this->response = ["response_data" => $this->response_data];
        }     

        //Encode the response
        $this->response = json_encode($this->response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        //Output response
        print($this->response);
    }

    //Print errors
    public function print_errors()
    {
        print_r($this->errors);
    }

    //Dump working data
    public function dump_working_data()
    {
        echo "<pre style="."border:1px solid green;".">";
        print_r($this->working_data);
        echo "</pre>";
    }
}
?>