(function($, ls) {
	"use strict";

	/*
	 * Only gets called when we're using $('$el').flightStatus format
	 */
	var FlightStatus = function(el, customOptions) {
		var _ = this;
		_.$el = $(el).addClass('flight-status');
		_.defaults = defaults;

		document.body.addEventListener('flightQuerySuccess');

		_.async(customOptions, _.makeWidget);
	};

	/*
	 * Default Values
	 */
	var defaults = {
		urls: {
			arriving: 'https://flysmartapp.com/***/flight/SearchNextArrivingFlights',
			departing: 'https://flysmartapp.com/***/flight/SearchNextDepartingFlights'
		},
		airport: null,
		cacheTime: 30,
		count: 10,
		serverSideScript: 'curl.php'
	};

	/*
	 * Async calls to API, broadcast customEvent 'flightQuerySuccess' when completed
	 */
	FlightStatus.prototype.async = function(customOptions, callback) {
		// start requesting
		var _ = this,
			options = $.extend(defaults, customOptions);
		_.requests = {
			arriving: null,
			departing: null
		};
		_.listen(callback);
		_.pollAPI(customOptions, _.broadcast, 'arriving');
		_.pollAPI(customOptions, _.broadcast, 'departing');
	};

	/*
	 * Listen for 'flightQuerySuccess' events. If we have successfully retrieved
	 * data for each search term, make widget
	 */
	FlightStatus.prototype.listen = function(callback) {
		var _ = this;
		document.body.addEventListener('flightQuerySuccess', function() {
			var requestsComplete;
			for(var direction in _.requests) {
				if(_.requests.hasOwnProperty(direction)) {
					requestsComplete = _.requests[direction] ? true : false;
				}
			}
			if(requestsComplete)
				callback.call(_, _.requests);
		});
	};

	FlightStatus.prototype.broadcast = function() {
		document.body.dispatchEvent(new CustomEvent('flightQuerySuccess'));
	};

	/*
	 * Main API polling function
	 */
	FlightStatus.prototype.pollAPI = function(customOptions, callback, direction) {
		var _ = this,
			options = $.extend(defaults, customOptions),
			url = _.makeURL(options, direction),
			data = ls ? ls.get(url, options.cacheTime) : false;
		_.options = options;

		if(data) {
			_.requests[direction] = data;
			callback.call(_, data);
			return false;
		}
		
		$.ajax({
			url: options.serverSideScript,
			data: $.param({
				url:url,
				type:'json'
			}),
			success: function(data) {
				if(data.error) {
					console.log('Error querying API: ', data.error);
					return false;
				}
				data = JSON.parse(data);
				if(ls)
					ls.set(url, data);
				if(callback) {
					_.requests[direction] = data;
					callback.call(_, data);
				}
			},
			error: function(e) {
				console.log(e);
			}
		});
	};

	FlightStatus.prototype.makeURL = function(options, direction) {
		return options.urls[direction].replace('***', options.airport);
	};

	FlightStatus.prototype.makeWidget = function() {
		var _ = this,
			data = _.requests,
			$widget = $('<div></div>'),
			$header = $('<div class="toggles"></div>');

		for(var direction in _.requests) {
			if(_.requests.hasOwnProperty(direction)) {
				var arriving = direction == 'arriving';
				$header.append($('<span data-toggle="' + direction + '">' + direction + '</span>'));
				var $current = $('<div data-type="' + direction + '"></div>');
				if (!data[direction]) return false;
				var flights = data[direction].List;
				for(var i = 0; i < _.options.count; i++) {

					var airport = !arriving ? flights[i].ArrivalAirportCode : flights[i].DepartureAirportCode,
						number = flights[i].FlightNumber,
						status = flights[i].Status == 'Delayed' ? 'delayed' : 'on-time',
						arr = flights[i].Time.split(':'),
						ampm = ' AM';
						if(arr[0] > 12) {
							arr[0] = arr[0] - 12;
							ampm = ' PM';
						}
					var time = arr.join(':') + ampm;

					$current
						.append($(
							'<div class="flight">' +
								'<span class="time">' + time + '</span>' +
								'<span class="number ' + status + '">' + number + '</span>' +
								'<span class="airport">' + airport + '</span>' +
							'</div>'
						));
				}
				$widget.append($current);
			}
		}
		$header.prependTo($widget);
		$widget.find('[data-type]').eq(0).addClass('active');
		$widget.find('[data-toggle]').eq(0).addClass('active');
		
		$widget.find('[data-toggle]').click(function() {
			var $_ = $(this);
			$widget.find('.active').removeClass('active');
			var toggle = $_.addClass('active').data('toggle');
			$widget.find('[data-type="' + toggle + '"]').addClass('active');
		});

		_.$el.append('<p class="title">Flight Status</p>').append($widget);
	};

	FlightStatus.prototype.poll = function(options, callback) {
		FlightStatus.prototype.async(options, callback);
	};

	// Extend JQuery fn for $('$id').flightStatus()
	$.fn.flightStatus = function(options) {
		return this.each(function() {
			(new FlightStatus(this, options));
		});
	};

	// Extend JQuery for $.flightStatus()
	// ONLY prototype(static) methods
	$.extend({
		flightStatus: FlightStatus.prototype
	});

})(jQuery, typeof lsLite != 'undefined' ? lsLite : null);