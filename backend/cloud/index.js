// Expects: Query string API:
// https://app.kpnc.io/locale/cloud/

async function handleRequest(request) {
	let address = request.headers.get('cf-connecting-ip');

	const { searchParams } = new URL(request.url);
  	if (searchParams.get('limited')) {
		return new Response(address, {
			headers: {
				'Access-Control-Allow-Headers': '*',
				'Access-Control-Allow-Origin': '*',
				'content-type': 'text/plain; charset=UTF-8',
				'status': 200
			},
		});
	}

	let regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;

	let version = regex.test(address) ? '4' : '6';

	let values = {
		'provided': {
			'version': version,
			'address': address,
			'ray': request.headers.get('cf-ray')
		}, 'found': {
			'zone': request.cf.timezone,
			'country': request.cf.country,
			'region': request.cf.region,
			'city': request.cf.city,
			'zip': request.cf.postalCode,
			'latitude': request.cf.latitude,
			'longitude': request.cf.longitude,
			'cidr': '',
			'asn': request.cf.asn.toString(),
			'isp': request.cf.asOrganization
		}, 'proxy': {
			'detected': false,
			'provider': '',
			'type': '',
			'usage': '',
			'threat': ''
		}
	};

	return new Response(JSON.stringify(values), {
		headers: {
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Origin': '*',
			'content-type': 'application/json; charset=UTF-8',
			'status': 200
		},
	});
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})
