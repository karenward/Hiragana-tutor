<?php
    session_start();
    //check if logged in
    if(isset($_SESSION["id"]) && !empty($_SESSION["id"])){
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "Hiragana";

        $con = mysqli_connect($servername, $username, $password, $dbname);

        if (mysqli_connect_errno()) {
        echo ("Failed to connect to MySQL: " . mysqli_connect_error());
        }

        $scoresToAdd = $_POST['progressed'];
        $romIndexes = $_POST['romajiIndex'];

        $uname = $_SESSION["id"];
        $sql = "SELECT * FROM users WHERE userName='$uname'";
        $result=mysqli_query($con,$sql);
        $row=mysqli_fetch_assoc($result);

        $newResults = explode(",", $row['scores']); //existing scores into array
        $scores = explode(",",$scoresToAdd);        //new scores into array
        $indexes = explode(",",$romIndexes);        //indexes of existing scores to be updated
        $arrlength = count($indexes);               //count of updates to be completed

        //add new scores to existing stored scores
        for ($i = 0; $i < $arrlength; $i+=1) {
            $j = $indexes[$i];
            $updated = $newResults[$j]+ $scores[$i];
            $newResults[$j] = $updated;
        };

        //implode updated scores back into string
        $finalScores = implode(",",$newResults);

        $sql = "UPDATE users SET scores = '$finalScores' WHERE userName='$uname'";
        if(mysqli_query($con, $sql)){
            echo 0;
        } else {
            echo 1;
        };
        mysqli_free_result($result);
        mysqli_close($con);

    //if not logged in
    } else {
        echo 2;
    }


?>

