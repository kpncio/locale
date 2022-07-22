// Expects: Query strings API and IP:
// https://app.kpnc.io/ip/ip2location?api=true&ip=1.1.1.1

var bigInt = require("big-integer");

async function handleRequest(request) {
	const { searchParams } = new URL(request.url);
	let api = searchParams.get('api');
	let ip = searchParams.get('ip');

	let address = null;
	if (ip != null) {
		address = ip;
	} else {
		address = request.headers.get("cf-connecting-ip");
	}

	let ipv4_regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;
	let ipv6_regex = /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/gm;

	let version = null;
	let decimal = null;
	if (ipv4_regex.test(address)) {
		version = 4;

		decimal = address.split('.').reduce(function(ipInt, octet) {
			return (ipInt<<8) + parseInt(octet, 10)
		}, 0) >>> 0;
	} else if (ipv6_regex.test(address)) {
		version = 6;

		var parts = [];
		address.split(':').forEach(function(it) {
			var bin = parseInt(it, 16).toString(2);
			while (bin.length < 16) {
				bin = '0' + bin;
			}
			parts.push(bin);
		})
		var bin = parts.join('');

		decimal = bigInt(bin, 2).toString();
	} else {
		version = error;
		decimal = error;
	}

	if (api) {
		let text = `
{
	"generated": {
		"version": "${version}",
		"address": "${address}",
		"decimal": "${decimal}"
	}, "extracted": {
		"zone": "${'**'}",
		"country": "${'**'}",
		"region": "${'**'}",
		"city": "${'**'}",
		"zip": "${'**'}",
		"latitude": "${'**'}",
		"longitude": "${'**'}",
		"cidr": "${'**'}",
		"asn": "${'**'}",
		"isp": "${'**'}"
	}
}
		`;

		return new Response(text, {
			headers: { 'content-type': 'application/json;charset=UTF-8', 'status' : 200 },
		})
	} else {
		let html = `
			<!DOCTYPE html>
			<html lang='en'>
				<head>
					<title>KPNC Geolocater (IP2Location)</title>
					<meta charset='UTF-8'>
					<meta name='theme-color' content='#1472FC'>
					<meta name='author' content='KPNC Technology'>
					<meta name='description' content='KPNC Technology: Geolocater: IP Address Lookup...'>
					<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1.0'>
					<meta http-equiv='X-UA-Compatible' content='ie=edge'>
					<link href='https://content.kpnc.io/' rel='preconnect'>
					<link href='https://content.kpnc.io/css/addresser.css' rel='stylesheet'>
					<link href='https://content.kpnc.io/css/roboto-mono.css' rel='stylesheet'>
					<link href='https://content.kpnc.io/img/kpnc/geolocater.png' rel='icon'>
					<link href='https://content.kpnc.io/lib/leaflet/leaflet.css' rel='stylesheet'>
					<script src='https://content.kpnc.io/lib/leaflet/leaflet.js'></script>
				</head>
				<body>
					<main>
						<header>
							<a href='https://www.kpnc.io'>
								<img src='https://content.kpnc.io/img/kpnc/logodark.webp' alt='~KPNC~'>
							</a>
			
							<small>2022 &copy; KPNC Technology // Geolocater: <a href='https://github.com/kpncio/geolocater' target='_blank'>GitHub</a></small>
						</header>
			
						<div class='container'>
							<p><strong>Generated Data:</strong></p><br>
			
							<table>
								<tbody>
									<tr>
										<td><p>&rtrif; IP Version</p></td>
										<td><input type='text' class='data' value='${version}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; IP Address</p></td>
										<td><input type='text' class='data' value='${address}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; IP Decimal</p></td>
										<td><input type='text' class='data' value='${decimal}'/></td>
									</tr>
								</tbody>
							</table>
						</div>
			
						<br>
						<div class='container'>
							<p><strong>Provider Data:</strong></p><br>
			
							<table>
								<tbody>
									<tr>
										<td><p>&rtrif; CIDR</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; ISP</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; ASN</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
								</tbody>
							</table>
						</div>
			
						<br>
						<div class='container'>
							<p><strong>Location Data:</strong></p><br>
			
							<table>
								<tbody>
									<tr>
										<td><p>&rtrif; Time Zone</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; Country</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; Region</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; City</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; ZIP</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; Latitude</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
									<tr>
										<td><p>&rtrif; Longitude</p></td>
										<td><input type='text' class='data' value='${'**'}'/></td>
									</tr>
								</tbody>
							</table>
						</div>
			
						<br>
						<div class='container'>
							<p><strong>Mapped Visualization:</strong></p><br>
							<div id='map' style='height: 250px; font-size: 11px; text-align: center;'>*Map loading...</div>
						</div>
			
						<br>
						<div class='container'>
							<small>*Raw JSON will be sent if no browser is detected or the query string 'api' equals true...</small>
						</div>
					</main>
			
					<script>
						var map = L.map('map').setView([${'**'}, ${'**'}], 11);
								
						var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
							maxZoom: 18,
							attribution: "Map Data & Imagery &copy; <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> & <a href='https://www.mapbox.com/' target='_blank'>Mapbox</a>",
							id: 'mapbox/dark-v10',
							tileSize: 512,
							zoomOffset: -1,
							accessToken: 'pk.eyJ1IjoiYWxiaWU2NTQ0IiwiYSI6ImNsMjV1YmdmMTJkcTMza3BkZTdmbnY1bTcifQ.YpT_p-H1WckYccV8_HoLHg'
						}).addTo(map);
			
						var circle = L.circle([${'**'}, ${'**'}], {
							color: '#1472FC',
							fillColor: '#1472FC',
							fillOpacity: 0.5,
							radius: 5000
						}).addTo(map);
					</script>
				</body>
			</html>
		`;

		return new Response(html, {
			headers: { 'content-type': 'text/html;charset=UTF-8', 'status' : 200 },
		});
	}
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})
