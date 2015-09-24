#Yelp Widget
Creates a yelp widget

## Getting Started

Include using Bower (all scripts are located within bower_components directory):

```sh
bower install yelp-widget
```

OR, download zip and include scripts manually. All production-ready scripts are in the dist/ directory.

```html
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
<!-- These are optional scripts -->
<!-- <script src="bower_components/local-storage-lite/ls.js"></script> -->
<!-- <script src="bower_components/geo-lite/geo-lite.js"></script> -->
<script src="yelp-widget.js"></script>
```

### OAuth
Yelp requires requests to their API to be authenticated via OAuth. Unfortunately, we can't successfully query the API without using a server side script. You can include [these two PHP scripts](https://github.com/BlueBiteLLC/OAuth-Lite) in your root directory (or preferably a directory above) and point the Yelp-Widget at the script using the `serverSideScript` option. Make sure to fill out the `.keys.php` file with your API credentials.


### Local Storage
In order for Yelp-Widget to take advantage of Local Storage functionality, use Local-Storage-Lite at https://github.com/BlueBiteLLC/Local-Storage-Lite
* This is automatically included as a bower dependency

Be sure to include the local storage lite script before yelp-widget.js. This enables browser caching. Custom cache times can be configured by specifying a cacheTime value as an option.

### Geolocating
In order for Yelp-Widget to take advantage of Geolocation functionality, use Geolocate-Lite at https://github.com/BlueBiteLLC/Geolocate-Lite
* This is automatically included as a bower dependency

As with local-storage-lite, include this before yelp-widget.js. This will automatically poll the user for their coordinates on page load. For additional configuration options visit the repo page stated above.

**Note: The Yelp Widget will function just fine without either of these scripts.**

### Styles
Include css file in head:

```html
<link rel="stylesheet" href="yelp-widget.css">
```


### Set Up the Widget

```html
<div class="my-class"></div>
```


```javascript
<script>
$('.my-class').yelpWidget({
    cacheTime: 20,
    lat: 40.748441,
    lon: -73.985793,
    searchTerms: ['bowling','movie','sports']
});
</script>
```

Option | Type | Default | Description
------ | ---- | ------- | -----------
lat|float|null|Latitude
lon|float|null|Longitude
searchTerms|array|['breakfast','lunch','dinner','bars']|Accepts an array of search terms
serverSideScript|string|'oauth.php'|Server-side script for authenticating using OAuth
count|int|5|Number of results (Limted to 20 or less)
cacheTime|int|30|How long we should cache the API results in minutes. Not applicable if local-storage-lite script is included
geoLocate|bool|true|Whether or not we should attempt to geolocate. Not applicable if geolocate-lite script is not included


### Make bare requests without widget
Currently only accepts a single search term as the third parameter.

```javascript
<script>
  $.yelpWidget.pollAPI({
      cacheTime: 20,
      lat: 40.748441,
      lon: -73.985793
  }, function(data) {
      console.log('here\'s some data: ', data);
  },
  'Bowling');
</script>
```

