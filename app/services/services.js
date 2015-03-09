app.service('oscars', function() {

	var items = [
			{"id":0, "category":"Adventure", "content":"Ben-Hur", "rating":11, "date":"1959"},
			{"id":1, "category":"Adventure", "content":"The Lord of the Rings: The Return of the King", "rating":11, "date":"2003"},
			{"id":2, "category":"Romance", "content":"Titanic", "rating":11, "date":"1997"},
			{"id":3, "category":"Musical", "content":"West Side Story", "rating":10, "date":"1961"},
			{"id":4, "category":"Romance", "content":"The English Patient", "rating":9, "date":"1996"},
			{"id":5, "category":"Musical", "content":"Gigi", "rating":9, "date":"1958"},
			{"id":6, "category":"Biography", "content":"The Last Emperor", "rating":9, "date":"1987"},
			{"id":7, "category":"Biography", "content":"Amadeus", "rating":8, "date":"1984"},
			{"id":8, "category":"Romance", "content":"From Here to Eternity", "rating":8, "date":"1953"},
			{"id":9, "category":"Biography", "content":"Gandhi", "rating":8, "date":"1982"},
			{"id":10, "category":"Romance", "content":"Gone with the Wind", "rating":8, "date":"1939"},
			{"id":11, "category":"Musical", "content":"My Fair Lady", "rating":8, "date":"1964"},
			{"id":12, "category":"Crime", "content":"On the Waterfront", "rating":8, "date":"1954"},
			{"id":13, "category":"Romance", "content":"Slumdog Millionaire", "rating":8, "date":"2008"},
			{"id":14, "category":"Romance", "content":"The Best Years of Our Lives", "rating":7, "date":"1946"},
			{"id":15, "category":"Adventure", "content":"The Bridge on the River Kwai", "rating":7, "date":"1957"},
			{"id":16, "category":"Adventure", "content":"Dances with Wolves", "rating":7, "date":"1990"},
			{"id":17, "category":"Comedy", "content":"Going My Way", "rating":7, "date":"1944"},
			{"id":18, "category":"Biography", "content":"Lawrence of Arabia", "rating":7, "date":"1962"},
			{"id":19, "category":"Biography", "content":"Out of Africa", "rating":7, "date":"1985"},
			{"id":20, "category":"Biography", "content":"Patton", "rating":7, "date":"1970"},
			{"id":21, "category":"Biography", "content":"Schindler's List", "rating":7, "date":"1993"},
			{"id":22, "category":"Comedy", "content":"Shakespeare in Love", "rating":7, "date":"1998"},
			{"id":23, "category":"Comedy", "content":"The Sting", "rating":7, "date":"1973"},
			{"id":24, "category":"Drama", "content":"All About Eve", "rating":6, "date":"1950"},
			{"id":25, "category":"Musical", "content":"An American in Paris", "rating":6, "date":"1951"},
			{"id":26, "category":"Musical", "content":"Chicago", "rating":6, "date":"2002"},
			{"id":27, "category":"Romance", "content":"Forrest Gump", "rating":6, "date":"1994"},
			{"id":28, "category":"Crime", "content":"The Godfather Part II", "rating":6, "date":"1974"},
			{"id":29, "category":"Thriller", "content":"The Hurt Locker", "rating":6, "date":"2009"},
			{"id":30, "category":"Biography", "content":"A Man for All Seasons", "rating":6, "date":"1966"},
			{"id":31, "category":"Romance", "content":"Mrs. Miniver", "rating":6, "date":"1942"},
			{"id":32, "category":"Drama", "content":"American Beauty", "rating":5, "date":"1999"},
			{"id":33, "category":"Comedy", "content":"The Apartment", "rating":5, "date":"1960"},
			{"id":34, "category":"Adventure", "content":"Around The World in 80 Days", "rating":5, "date":"1956"},
			{"id":35, "category":"Comedy", "content":"The Artist", "rating":5, "date":"2011"},
			{"id":36, "category":"Action", "content":"Braveheart", "rating":5, "date":"1995"},
			{"id":37, "category":"Drama", "content":"The Deer Hunter", "rating":5, "date":"1978"},
			{"id":38, "category":"Action", "content":"The French Connection", "rating":5, "date":"1971"},
			{"id":39, "category":"Action", "content":"Gladiator", "rating":5, "date":"2000"},
			{"id":40, "category":"Drama", "content":"How Green Was My Valley", "rating":5, "date":"1941"},
			{"id":41, "category":"Comedy", "content":"In the Heat of the Night", "rating":5, "date":"1967"},
			{"id":42, "category":"Comedy", "content":"It Happened One Night", "rating":5, "date":"1934"},
			{"id":43, "category":"Drama", "content":"Kramer vs. Kramer", "rating":5, "date":"1979"},
			{"id":44, "category":"Musical", "content":"Oliver!", "rating":5, "date":"1968"},
			{"id":45, "category":"Drama", "content":"One Flew Over the Cuckoo's Nest", "rating":5, "date":"1975"},
			{"id":46, "category":"Thriller", "content":"The Silence of the Lambs", "rating":5, "date":"1991"},
			{"id":47, "category":"Biography", "content":"The Sound of Music", "rating":5, "date":"1965"},
			{"id":48, "category":"Comedy", "content":"Terms of Endearment", "rating":5, "date":"1983"},
			{"id":49, "category":"Comedy", "content":"Annie Hall", "rating":4, "date":"1977"},
			{"id":50, "category":"Biography", "content":"A Beautiful Mind", "rating":4, "date":"2001"},
			{"id":51, "category":"Comedy", "content":"Chariots of Fire", "rating":4, "date":"1981"},
			{"id":52, "category":"Comedy", "content":"The Departed", "rating":4, "date":"2006"},
			{"id":53, "category":"Comedy", "content":"Driving Miss Daisy", "rating":4, "date":"1989"},
			{"id":54, "category":"Musical", "content":"Hamlet", "rating":4, "date":"1948"},
			{"id":55, "category":"Biography", "content":"The King's Speech", "rating":4, "date":"2010"},
			{"id":56, "category":"Drama", "content":"The Lost Weekend", "rating":4, "date":"1945"},
			{"id":57, "category":"Romance", "content":"Marty", "rating":4, "date":"1955"},
			{"id":58, "category":"Drama", "content":"Million Dollar Baby", "rating":4, "date":"2004"},
			{"id":59, "category":"Crime", "content":"No Country for Old Men", "rating":4, "date":"2007"},
			{"id":60, "category":"Drama", "content":"Ordinary People", "rating":4, "date":"1980"},
			{"id":61, "category":"Drama", "content":"Platoon", "rating":4, "date":"1986"},
			{"id":62, "category":"Drama", "content":"Rain Man", "rating":4, "date":"1988"},
			{"id":63, "category":"Adventure", "content":"Tom Jones", "rating":4, "date":"1963"},
			{"id":64, "category":"Western", "content":"Unforgiven", "rating":4, "date":"1992"},
			{"id":65, "category":"Biography", "content":"12 Years a Slave", "rating":3, "date":"2013"},
			{"id":66, "category":"Drama", "content":"All the King's Men", "rating":3, "date":"1949"},
			{"id":67, "category":"Romance", "content":"Casablanca", "rating":3, "date":"1943"},
			{"id":68, "category":"Romance", "content":"Cavalcade", "rating":3, "date":"1933"},
			{"id":69, "category":"Western", "content":"Cimarron", "rating":3, "date":"1931"},
			{"id":70, "category":"Drama", "content":"Crash", "rating":3, "date":"2005"},
			{"id":71, "category":"Romance", "content":"Gentleman's Agreement", "rating":3, "date":"1947"},
			{"id":72, "category":"Crime", "content":"The Godfather", "rating":3, "date":"1972"},
			{"id":73, "category":"Biography", "content":"The Great Ziegfeld", "rating":3, "date":"1936"},
			{"id":74, "category":"Biography", "content":"The Life of Emile Zola", "rating":3, "date":"1937"},
			{"id":75, "category":"Drama", "content":"Midnight Cowboy", "rating":3, "date":"1969"},
			{"id":76, "category":"Drama", "content":"Rocky", "rating":3, "date":"1976"},
			{"id":77, "category":"Drama", "content":"All Quiet on the Western Front", "rating":2, "date":"1930"},
			{"id":78, "category":"Romance", "content":"The Greatest Show on Earth", "rating":2, "date":"1952"},
			{"id":79, "category":"Thriller", "content":"Rebecca", "rating":2, "date":"1940"},
			{"id":80, "category":"Romance", "content":"Wings", "rating":2, "date":"1927"},
			{"id":81, "category":"Comedy", "content":"You Can't Take It with You", "rating":2, "date":"1938"},
			{"id":82, "category":"Musical", "content":"The Broadway Melody", "rating":1, "date":"1929"},
			{"id":83, "category":"Romance", "content":"Grand Hotel", "rating":1, "date":"1932"},
			{"id":84, "category":"Adventure", "content":"Mutiny on the Bounty", "rating":1, "date":"1935"}
	];

	var colors = [
			{"group": "Drama", "color": "#9A12B3", "count": 0},
			{"group": "Romance", "color": "#FF1493", "count": 0},
			{"group": "Crime", "color": "#FF1919", "count": 0},
			{"group": "Biography", "color": "#4183D7", "count": 0},
			{"group": "Adventure", "color": "#009933", "count": 0},
			{"group": "Action", "color": "#2C3E50", "count": 0},
			{"group": "Thriller", "color": "#16a085", "count": 0},
			{"group": "Western", "color": "#F39C12", "count": 0},
			{"group": "Musical", "color": "#DC143C", "count": 0},
			{"group": "Comedy", "color": "#FE5800", "count": 0}

	];

	var countColors = function() {
		var i, j;
		var len = items.length;
		var len2 = colors.length;
		var grp = null;
		for (i=0; i<len; i++) {
			grp = items[i].category;
			for (j=0; j<len2; j++) {
				if (grp == colors[j].group) {
					items[i].color = colors[j].color;
					colors[j].count = colors[j].count+1;
					break;
				}
			}
		}
	};

	countColors();

	this.getItems = function() {
		return angular.copy(items);
	};

	this.getColors = function() {
		return angular.copy(colors);
	};

});

app.filter('offset', function() {
	return function(input, start) {
		start = parseInt(start, 10);
		return input.slice(start);
	};
});

// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
// adapted from angular's $timeout code
app.factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler', function($rootScope,   $browser,   $q,   $exceptionHandler) {

  var deferreds = {},
      methods = {},
      uuid = 0;

  function debounce(fn, delay, invokeApply) {

      var deferred = $q.defer(),
          promise = deferred.promise,
          skipApply = (angular.isDefined(invokeApply) && !invokeApply),
          timeoutId, cleanup,
          methodId, bouncing = false;

      // check we dont have this method already registered
      angular.forEach(methods, function(value, key) {
          if(angular.equals(methods[key].fn, fn)) {
              bouncing = true;
              methodId = key;
          }
      });

      // not bouncing, then register new instance
      if(!bouncing) {
          methodId = uuid++;
          methods[methodId] = {fn: fn};
      } else {
          // clear the old timeout
          deferreds[methods[methodId].timeoutId].reject('bounced');
          $browser.defer.cancel(methods[methodId].timeoutId);
      }

      var debounced = function() {
          // actually executing? clean method bank
          delete methods[methodId];

          try {
              deferred.resolve(fn());
          } catch(e) {
              deferred.reject(e);
              $exceptionHandler(e);
          }

          if (!skipApply) $rootScope.$apply();
      };

      timeoutId = $browser.defer(debounced, delay);

      // track id with method
      methods[methodId].timeoutId = timeoutId;

      cleanup = function(reason) {
          delete deferreds[promise.$$timeoutId];
      };

      promise.$$timeoutId = timeoutId;
      deferreds[timeoutId] = deferred;
      promise.then(cleanup, cleanup);

      return promise;
  }

  // similar to angular's $timeout cancel
  debounce.cancel = function(promise) {
      if (promise && promise.$$timeoutId in deferreds) {
          deferreds[promise.$$timeoutId].reject('canceled');
          return $browser.defer.cancel(promise.$$timeoutId);
      }
      return false;
  };

  return debounce;

}]);