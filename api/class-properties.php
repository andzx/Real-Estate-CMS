<?php
class properties {
    var $request;
    var $response;
    var $secret;
    var $working_data;
    var $filename = "../properties.db";
    var $errors = [];
    var $new_user;
    var $id;
    var $response_data = [];
    var $user_data = [];
    var $address;
    var $price;
    var $type;
    var $array_json = [];
    var $property_images = [];

    //Validate email
    public function validate_email($email)
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            exit('{"status":"fail", "error":"Invalid email address"}');
        }
    }

    //Validate length
    public function validate_length($value, $min_length, $max_length)
    {
        if(strlen($value) < $min_length || strlen($value) > $max_length){
            exit('{"status":"fail", "error":"Invalid value length"}');
        }
    }

    //Read data from properties text file
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

    //Save data to properties text file
    public function save_file()
    {
        //Encode the data array into a text string
        $this->save_data = json_encode($this->working_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        //Save the text string to the database file
        file_put_contents($this->filename, $this->save_data);
    }

    //Retrieve properties data as array
    public function get_properties()
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

    //Get last property id
    public function get_last_property_id($data = null)
    {
        for($i=0;$i<sizeof($this->working_data);$i++)
        {
            if($this->id < $this->working_data[$i]->id)
            {
                $this->id = $this->working_data[$i]->id;
                $this->address = $this->working_data[$i]->address;
                $this->price = $this->working_data[$i]->price;
                $this->type = $this->working_data[$i]->type;
                $this->property_images = $this->working_data[$i]->images;
            }
        }

        //Build response
        if($data)
        {
            $this->response = ["status" => "ok",
                               "last_property_id" => $this->id,
                               "address" => $this->address,
                               "price" => $this->price,
                               "type" => $this->type,
                               "images" => $this->property_images
                              ];
        }
        else
        {
            $this->response = ["status" => "ok", "last_property_id" => $this->id];
        }
    }

    //Creates a new user in the working_data array
    public function create_property($string_json, $image_names)
    {
        //Convert string json into array json
        if(!$this->array_json = json_decode($string_json))
        {
            $this->errors[] = "Invalid JSON given";
        }

        //Validate the input
        foreach($this->array_json as $key => $value)
        {
            if($key == "email")
            {
                $this->validate_email($value);
            }
            else
            {
                $this->validate_length($value, 3, 64);
            }
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

        //Create an image array
        $this->new_user->images = [];

        //Store the image name data
        foreach($image_names as $image_name)
        {
            $this->new_user->images[] = $image_name;
        }

        //Add the new element to the working data array
        array_push($this->working_data, $this->new_user);

        //Build response
        $this->response = ["status" => "ok"];

        //Reset variable
        $this->new_user = null;
    }

    //Delete the first element which matches a given id
    public function delete_property($id)
    {
        for($i=0;$i<sizeof($this->working_data);$i++)
        {
            if($this->working_data[$i]->id == $id)
            {
                //Delete the user
                array_splice($this->working_data, $i, 1);

                //Build response
                $this->response = ["status" => "ok"];
                break;
            }

            //Build response
            $this->response = ["status" => "fail"];
        }
    }

    //Update user data
    public function edit_property($user_data)
    {
        //Decode the JSON
        $this->user_data = json_decode($user_data);
        
        //Check if JSON was decoded successfully
        if(!$this->user_data)
        {
            $this->errors[] = "Invalid JSON";
            //Stop the function if JSON invalid
            return;
        }

        //Loop through existing data and look for a matching id
        for($i=0;$i<sizeof($this->working_data);$i++)
        { 
            //Check if id matches to anything in the text file
            if($this->working_data[$i]->id == $this->user_data->id)
            {
                //Validate the input
                foreach($this->user_data as $key => $value)
                {
                    if($key == "email")
                    {
                        $this->validate_email($value);
                    }
                    elseif($key == "id")
                    {
                        //Do nothing
                    }
                    else
                    {
                        $this->validate_length($value, 3, 64);
                    }
                }

                //Update element properties
                foreach($this->user_data as $key => $value)
                {
                    $this->working_data[$i]->{$key} = $value;
                }

                //Build response
                $this->response = ["status" => "ok"];

                //Id match found, kill the loop
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
        for($i=0;$i<sizeof($this->working_data);$i++)
        {
            if($this->id < $this->working_data[$i]->id)
            {
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