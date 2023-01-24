<?php

// Expects: Query string API:
// https://app.kpnc.io/geolocater/local/?ip=1.1.1.1

require "ip.inc.php";
require "2l.inc.php";

$version = v6(ip(), true);
$address = ip();
$decimal = dc(ip(), v6(ip(), false));
$system = os();
$browser = br();

$ip2l = all(v6(ip(), false), dc(ip(), v6(ip(), false)));

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Origin: *");
header("Status: 200");

if ($decimal >= $ip2l[1][0] && $decimal <= $ip2l[1][1]) {
	$values = array(
        "provided" => array(
            "version" => $version,
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
            "version" => $version,
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