<?php

// Expects: Query string API:
// https://app.kpnc.io/locale/local/?ip=1.1.1.1

require "ip.inc.php";
require "2l.inc.php";

$address = ip()[0];
$errored = ip()[1];
$version = v6($address, true);
$number = v6($address, false);
$decimal = dc($address, $number);

if(!empty($_GET["limited"])) {
    header("Content-Type: text/plain; charset=UTF-8");
    header("Status: 200");

    echo $address;
} else {
    $ip2l = all($number, $decimal);

    header("Content-Type: application/json; charset=UTF-8");
    header("Status: 200");

    if ($decimal >= $ip2l[1][0] && $decimal <= $ip2l[1][1]) {
        $values = array(
            "provided" => array(
                "version" => $errored ? '0' : $version,
                "address" => $address,
                "ray" => $_SERVER["HTTP_CF_RAY"]
            ), "found" => array(
                "zone" => $ip2l[0][9],
                "country" => $ip2l[0][2],
                "region" => $ip2l[0][4],
                "city" => $ip2l[0][5],
                "zip" => $ip2l[0][8],
                "latitude" => $ip2l[0][6],
                "longitude" => $ip2l[0][7],
                "cidr" => $ip2l[2][2],
                "asn" => $ip2l[2][3],
                "isp" => $ip2l[2][4]
            ), "proxy" => array(
                "detected" => true,
                "provider" => $ip2l[1][7],
                "type" => $ip2l[1][2],
                "usage" => $ip2l[1][9],
                "threat" => $ip2l[1][13]
            )
        );
    } else {
        $values = array(
            "provided" => array(
                "version" => $errored ? '0' : $version,
                "address" => $address,
                "ray" => $_SERVER["HTTP_CF_RAY"]
            ), "found" => array(
                "zone" => $ip2l[0][9],
                "country" => $ip2l[0][2],
                "region" => $ip2l[0][4],
                "city" => $ip2l[0][5],
                "zip" => $ip2l[0][8],
                "latitude" => $ip2l[0][6],
                "longitude" => $ip2l[0][7],
                "cidr" => $ip2l[2][2],
                "asn" => $ip2l[2][3],
                "isp" => $ip2l[2][4]
            ), "proxy" => array(
                "detected" => false,
                "provider" => "",
                "type" => "",
                "usage" => "",
                "threat" => ""
            )
        );
    }

    echo json_encode($values);
}