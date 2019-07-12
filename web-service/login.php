<?php
    session_start();
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "Hiragana";

    $con = mysqli_connect($servername, $username, $password, $dbname);

    if (mysqli_connect_errno()) {
       echo ("Failed to connect to MySQL: " . mysqli_connect_error());
    }

    $uname = $_POST['userName'];
    $pword = $_POST['userPassword'];

    //Check if match exists for userName & userPassword
    $sql = "select * from users where userName='$uname' and userPassword='$pword'";
  
    $result = mysqli_query($con,$sql);
    $rowCount = mysqli_num_rows($result);

    if($rowCount > 0){
        //update session id
        $_SESSION["id"] = $uname;
        echo 1;
    } else {
        echo 0;
    }
    
    mysqli_free_result($result);
    mysqli_close($con);
?>   


