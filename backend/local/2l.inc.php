<?php

require "db.inc.php";

function sdb($ip6, $dec, $tbl) {
    $con = odb("ip2location");

    $response = "unknown";

    if (!$ip6) {
        $ver = "";
    } else {
        $ver = "_ipv6";
    }

    $query = "SELECT * FROM `ip2location_{$tbl}{$ver}` WHERE `ip_to` >= {$dec} LIMIT 1;";

    if ($result = $con -> query($query)) {
        $row = $result -> fetch_assoc();

        // This is fucking stupid...
        // "$response = $row[0]" didn"t work...
        $response = implode(",", $row);
        $response = explode(",", $response);

        $result -> free_result();
    }

    cdb($con);

    return $response;
}

function all($ip6, $dec) {
    $loc = sdb($ip6, $dec, "db11");
    $prx = sdb($ip6, $dec, "px11");
    $asn = sdb($ip6, $dec, "asn");

    return array($loc, $prx, $asn);
}