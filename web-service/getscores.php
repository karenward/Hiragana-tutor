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

    $uname = $_SESSION["id"];
    $sql = "SELECT * FROM users WHERE userName='$uname'";
    
    $result=mysqli_query($con,$sql);
    $row=mysqli_fetch_assoc($result);
    $results = $row['scores'];

    echo($results);

    mysqli_free_result($result);
    mysqli_close($con);
?>