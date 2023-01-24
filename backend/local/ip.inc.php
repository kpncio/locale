<?php

function os(): string {
    $user_agent = $_SERVER["HTTP_USER_AGENT"];

    $platform = "unknown";

    $os_array = array(
        "/windows nt 10/i"      =>  "Windows 10",
        "/windows nt 6.3/i"     =>  "Windows 8.1",
        "/windows nt 6.2/i"     =>  "Windows 8",
        "/windows nt 6.1/i"     =>  "Windows 7",
        "/windows nt 6.0/i"     =>  "Windows Vista",
        "/windows nt 5.2/i"     =>  "Windows 2003",
        "/windows nt 5.1/i"     =>  "Windows XP",
        "/windows xp/i"         =>  "Windows XP",
        "/windows nt 5.0/i"     =>  "Windows 2000",
        "/windows me/i"         =>  "Windows ME",
        "/win98/i"              =>  "Windows 98",
        "/win95/i"              =>  "Windows 95",
        "/win16/i"              =>  "Windows 3.1",
        "/macintosh|mac os x/i" =>  "Mac OS X",
        "/mac_powerpc/i"        =>  "Mac OS 9",
        "/linux/i"              =>  "Linux",
        "/ubuntu/i"             =>  "Ubuntu",
        "/iphone/i"             =>  "iPhone",
        "/ipod/i"               =>  "iPod",
        "/ipad/i"               =>  "iPad",
        "/android/i"            =>  "Android",
        "/blackberry/i"         =>  "Blackberry",
        "/webos/i"              =>  "WebOS"
    );

    foreach ( $os_array as $regex => $value ) {
        if ( preg_match($regex, $user_agent ) ) {
            $platform = $value;
        }
    }
    return $platform;
}

function br(): string {
    $user_agent = $_SERVER["HTTP_USER_AGENT"];

    $browser = "unknown";

    $browser_array = array(
        "/msie/i"       =>  "Internet Explorer",
        "/firefox/i"    =>  "Firefox",
        "/safari/i"     =>  "Safari",
        "/chrome/i"     =>  "Chrome",
        "/edge/i"       =>  "Edge",
        "/opera/i"      =>  "Opera",
        "/netscape/i"   =>  "Netscape",
        "/maxthon/i"    =>  "Maxthon",
        "/konqueror/i"  =>  "Konqueror",
        "/mobile/i"     =>  "Mobile"
    );

    foreach ( $browser_array as $regex => $value ) {
        if ( preg_match( $regex, $user_agent ) ) {
            $browser = $value;
        }
    }

    return $browser;
}

function ip(): string {
    if(!empty($_GET["ip"])) {
        if (filter_var($_GET["ip"], FILTER_VALIDATE_IP,  FILTER_FLAG_IPV4)) {
            return $_GET["ip"];
        } else {
            if (filter_var($_GET["ip"], FILTER_VALIDATE_IP,  FILTER_FLAG_IPV6)) {
                return $_GET["ip"];
            } else {
                return "0.0.0.0";
            }
        }
    } else {
        $keys = array("HTTP_CLIENT_IP", "HTTP_X_FORWARDED_FOR", "HTTP_X_FORWARDED", "HTTP_FORWARDED_FOR", "HTTP_FORWARDED", "REMOTE_ADDR");

        foreach($keys as $k)
        {
            if (!empty($_SERVER[$k]) && filter_var($_SERVER[$k], FILTER_VALIDATE_IP))
            {
                return $_SERVER[$k];
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