<?php

function ip() {
    if(!empty($_GET["ip"])) {
        if (filter_var($_GET["ip"], FILTER_VALIDATE_IP,  FILTER_FLAG_IPV4)) {
            return [$_GET["ip"], false];
        } elseif (filter_var($_GET["ip"], FILTER_VALIDATE_IP,  FILTER_FLAG_IPV6)) {
            return [$_GET["ip"], false];
        } else {
            return ["0.0.0.0", true];
        }
    } else {
        $keys = array("HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR", "HTTP_X_FORWARDED", "HTTP_FORWARDED_FOR", "HTTP_FORWARDED", "REMOTE_ADDR");

        foreach($keys as $k)
        {
            if (!empty($_SERVER[$k]) && filter_var($_SERVER[$k], FILTER_VALIDATE_IP))
            {
                return [$_SERVER[$k], false];
            }
        }
    }

    return "unknown";
}

function dc($ip, $ipv6): string {
    if (!$ipv6) {
        $nums = explode(".", $ip);

        $dec = ($nums[0] * 16777216) + ($nums[1] * 65536) + ($nums[2] * 256) + ($nums[3] * 1);

        return strval($dec);
    } else {
        $dec = "";

        foreach (unpack("C*", inet_pton($ip)) as $byte) {
            $dec .= str_pad(decbin($byte), 8, "0", STR_PAD_LEFT);
        }

        $dec = ltrim($dec, "0");

        if (function_exists("bcadd")) {
            $num = 0;

            for ($i = 0; $i < strlen($dec); $i++) {
                $right  = base_convert($dec[$i], 2, 10);
                $num = bcadd(bcmul($num, 2), $right);
            }

            $dec = $num;
        } else {
            $dec = base_convert($dec, 2, 10);
        }

        return $dec;
    }
}

function v6($ip, $str) {
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
        $v6 = true;
    } else {
        $v6 = false;
    }

    if (!$v6) {
        if ($str) {
            return "4";
        } else {
            return false;
        }
    } else {
        if ($str) {
            return "6";
        } else {
            return true;
        }
    }
}