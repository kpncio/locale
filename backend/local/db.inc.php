<?php

function odb($database)
{
    $host = "localhost";
    $user = "root";
    $pass = "";
    $data = $database;
    $conn = new mysqli($host, $user, $pass, $data) or die("Connect failed: %s\n". $conn -> error);

    return $conn;
}

function cdb($conn)
{
    $conn -> close();
}