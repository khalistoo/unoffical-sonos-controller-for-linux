import Sonos from 'Sonos';

class Search {

	constructor (discoveryCallback) {

		var self = this;

		var encoder = new TextEncoder();
		var decoder = new TextDecoder();

		var PLAYER_SEARCH = encoder.encode(['M-SEARCH * HTTP/1.1',
		'HOST: 239.255.255.250:reservedSSDPport',
		'MAN: ssdp:discover',
		'MX: 1',
		'ST: urn:schemas-upnp-org:device:ZonePlayer:1'].join('\r\n'));

		chrome.sockets.udp.create({}, function (info) {

			chrome.sockets.udp.bind(info.socketId, "0.0.0.0", 0, function (bindResult) {

				if(bindResult < 0) {
					throw new Error('could not bind socket');
				}

				chrome.sockets.udp.send(info.socketId, PLAYER_SEARCH.buffer, '239.255.255.250', 1900, function socketResponse (sendInfo) {
					//console.log(sendInfo);
				});

			});

			chrome.sockets.udp.onReceive.addListener(function socketReceive(receiveInfo) {

				if(receiveInfo.socketId === info.socketId) {

					var buffer = decoder.decode(new DataView(receiveInfo.data));

					if(buffer.match(/.+Sonos.+/)) {
						var modelCheck = buffer.match(/SERVER.*\((.*)\)/);
						var model = (modelCheck.length > 1 ? modelCheck[1] : null);

						console.log(model, receiveInfo.remoteAddress);

						discoveryCallback(new Sonos(receiveInfo.remoteAddress))
					}
				}

			});

		});
	}
};