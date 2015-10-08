#Flight Status Widget
Creates a flight status widget using FlySmartApp.com

## Getting Started

Include using Bower (all scripts are located within bower_components directory):

```sh
bower install flight-status
```

OR, download zip and include scripts manually. All production-ready scripts are in the dist/ directory.

```html
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
<!-- These are optional scripts -->
<!-- <script src="bower_components/local-storage-lite/ls.js"></script> -->
<script src="flight-status.js"></script>
```

### Server-Side Requests
FlySmartApp.com does not allow for Cross Site Scripting(XSS.) You can include [the curl.php script here](https://github.com/BlueBiteLLC/OAuth-Lite/blob/master/curl.php) in your root directory and point the Flight Status Widget at the script using the `serverSideScript` option. Just use the relative path of the script from flight-status.js.


### Local Storage
In order for Flight Status Widget to take advantage of Local Storage functionality, use Local-Storage-Lite at https://github.com/BlueBiteLLC/Local-Storage-Lite
* This is automatically included as a bower dependency

Be sure to include the local storage lite script before flight-status.js. This enables browser caching. Custom cache times can be configured by specifying a cacheTime value as an option.

**Note: The Flight Status Widget will function just fine without this script.**

### Styles
Include css file in head:

```html
<link rel="stylesheet" href="flight-status.css">
```

### Set Up the Widget

```html
<div class="my-class"></div>
```

```javascript
$('.my-class').flightStatus({
    airport: 'EWR',
    count: 10
});
```

Option | Type | Default | Description
------ | ---- | ------- | -----------
airport|string|null|Shortcode for airport (ex: 'EWR' or 'LGA')
count|int|10|Number of flights we'd like to list
serverSideScript|string|'curl.php'|Server-side script for XSS
cacheTime|int|30|How long we should cache the API results in minutes. Not applicable if local-storage-lite script is included

### Make bare requests without widget
Currently only accepts a single search term as the third parameter.

```javascript
$.yelpWidget.flightStatus({
      airport: 'EWR',
      count: 10
    }, function(data) {
        if(data.arriving && data.departing)
            console.log('here\'s some data: ', data);
});
```

