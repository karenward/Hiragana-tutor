<?php

        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "Hiragana";

        $con = mysqli_connect($servername, $username, $password, $dbname);

        if (mysqli_connect_errno()) {
           echo ("Failed to connect to MySQL: " . mysqli_connect_error());
        }

        $newuser = $_POST['userName'];
        $newpassword = $_POST['userPassword'];
      
        //Check if userName already exists
        $sql = "SELECT userName FROM users where userName = '$newuser'";
        $result = mysqli_query($con,$sql);
        $rowCount = mysqli_num_rows($result);
        
        if($rowCount == 1){
            echo 1;        
        } else {
            //Register new user
            $sql = "INSERT INTO users (userName, userPassword) VALUES ('$newuser', '$newpassword')";
            
            if(mysqli_query($con,$sql)){
                echo "registered";
            } else {
                echo "error";
            }
           
        }
          
        mysqli_free_result($result);
        mysqli_close($con);
        
   
    ?>