/*
* Controller for the Vizualization container
*/
app.controller("VizController", ['$scope', '$window', function($scope, $window){

	var vizCtrl = this;

	var init = function(){
		vizCtrl.width = null;
  }

  init();

  /*
  * Sets dimensions and responsive scaling factor based on the with of the vizualization
  */
  vizCtrl.calcDimensions = function() {

    var dims = {};

    // Large screen
  	if (vizCtrl.width>1920) {
  		dims.height = 600;
  		dims.responsiveScale = 3.2;
  	}
    // Medium screen
  	else if (vizCtrl.width>1020 && vizCtrl.width<=1919) {
  		dims.height = $window.innerHeight-40;
  		dims.responsiveScale = 3.2;
  	}
    // Small/Medium
  	else if (vizCtrl.width>600 && vizCtrl.width<=1019) {
  		dims.height = $window.innerHeight-40;
  		dims.responsiveScale = 2.2;
  	}
    // Small mobile screen
  	else {
  		dims.height = $window.innerHeight-40;
  		dims.responsiveScale = 1.4;
  	}
    return dims;
  };

} ]);

/*
* Controller for CRUD operations
*/
app.controller("CrudController", [ '$scope', '$filter', 'oscars', function($scope, $filter, oscars){

	var crudCtrl = this;
	var id = -1;
	var radiusScaling = 2;

	var edit = false;
	var editID = -1;

  /*
  * Initializes CRUD form values, etc
  */
	var init = function(){

		crudCtrl.maxRating = 12;
		crudCtrl.isReadonly = false;
		crudCtrl.showPanel = false;

		crudCtrl.props =  {"group":"category", "label":"content", "radius":"rating", "scaling":radiusScaling};

		crudCtrl.items = [];
		crudCtrl.categoryColors = [];

		crudCtrl.demoOn = false;

		crudCtrl.clearForm();
		crudCtrl.clearFilter();

		crudCtrl.togglePanel();
  }

  /*
  * Retrieves a color by category or "group"
  */
  var getColor = function(category) {

		var grp = null;
		var catCols = crudCtrl.categoryColors;
		var i = 0;
		while (i<catCols.length) {
			grp = catCols[i].group;
			if (grp === category) {
				return(catCols[i].color);
			}
			i++;
		}
		return(false);
	};

  /*
  * Increases the "count" of items with a specific category and changes the color if necessary
  */
	var incrementCategoryColor = function(category,color){

		var catCols = crudCtrl.categoryColors;
		var grp = null;
		var i = 0;
		while (i<catCols.length) {
			grp = catCols[i].group;
			var count = catCols[i].count;
			if (grp === category) {
				catCols[i] = {"group": category, "color": color, "count": count+1};
				break;
			}
			i++;
		}

		if (grp !== category) {
			catCols.push( {"group": category, "color": color, "count": 1} );
		}
	};

  /*
  * Decrements the "count" of items with a specific category
  */
	var decrementCategoryColor = function(category,color){

		var catCols = crudCtrl.categoryColors;
		var grp = null;
		var i = 0;
		while (i<catCols.length) {
			grp = catCols[i].group;
			if (grp === category) {
				var count = catCols[i].count;
				if (count === 1) {
					catCols.splice(i,1);
				}
				else {
					catCols[i] = {"group": category, "color": color, "count": count-1};
				}
				break;
			}
			i++;
		}
	};

  /*
  * Toggles the slide-down panel with CRUD form
  */
	crudCtrl.togglePanel = function() {

		crudCtrl.showPanel =!crudCtrl.showPanel;
	}

  /*
  * Synchronizes the color with the category currently selected on the CRUD form
  */
	crudCtrl.syncColor = function() {

		var color = getColor(crudCtrl.entry.category);
		if (color) {
			crudCtrl.entry.color = color;
		}
	};

  /*
  * Changes the star rating state on hover
  */
	crudCtrl.hoveringOverStar = function(value){
		crudCtrl.overStar = value;
	};

  /*
  * Create a new item
  */
	crudCtrl.create = function() {

		id=id+1;
		crudCtrl.entry.id = id;
    crudCtrl.items.push(crudCtrl.entry);
    incrementCategoryColor(crudCtrl.entry.category, crudCtrl.entry.color);
    // Reset the CRUD form and sorting filter
    crudCtrl.clearFilter();
    crudCtrl.clearForm();
	};

  /*
  * Get a current item buy id and apply a callback
  */
	var getItem = function(id, callback) {

		var item = null;
		var len = crudCtrl.items.length;
		var i = 0;
		while (i < len) {
			var testID = crudCtrl.items[i].id;
			if (testID === id) {
				item = crudCtrl.items[i];
				break;
			}
			i++;
		}

		if (testID !== null) {
			callback(item,i);
		}

		return(item);
	};

  /*
  * Edit an item
  */
	crudCtrl.edit = function(id,apply) {

		getItem(id, function(item){
      // if needs $scope.apply
      if (apply) {
        $scope.$apply(function(){
          crudCtrl.entry = {"id": item.id, "category": item.category, "color": getColor(item.category), "content": item.content, "rating": item.rating, "date": item.date };
          crudCtrl.createState = false;
          crudCtrl.showPanel = true;
        });
      }
      // otherwise
      else {
        crudCtrl.entry = {"id": item.id, "category": item.category, "color": getColor(item.category), "content": item.content, "rating": item.rating, "date": item.date };
        crudCtrl.createState = false;
        crudCtrl.showPanel = true;
      }

		});
	};

  /*
  * Update an item
  */
	crudCtrl.update = function(id) {

		getItem(id, function(item) {

      // Adjust the category and/or color
      decrementCategoryColor(item.category,item.color);
			incrementCategoryColor(crudCtrl.entry.category,crudCtrl.entry.color);

      // Update other params
			item.id = crudCtrl.entry.id;
			item.category = crudCtrl.entry.category;
			item.color = crudCtrl.entry.color;
			item.content = crudCtrl.entry.content;
			item.rating = crudCtrl.entry.rating;
			item.date = crudCtrl.entry.date;
		});

    // Reset the CRUD form and sorting filter
		crudCtrl.clearFilter();
		crudCtrl.clearForm();

	};

  /*
  * Delete an item
  */
	crudCtrl.delete = function(id,apply) {

    // if needs $scope.apply
		if (apply) {
			getItem(id, function(item,i){
				$scope.$apply(function(){
					decrementCategoryColor(item.category,item.color);
					crudCtrl.items.splice(i,1);
					crudCtrl.clearFilter();
					crudCtrl.clearForm();
				});
			});
		}
    //otherwise
		else {
			getItem(id, function(item,i){
				decrementCategoryColor(item.category,item.color);
				crudCtrl.items.splice(i,1);
				crudCtrl.clearFilter();
				crudCtrl.clearForm();
			});
		}
	};

  /*
  * Clear the CRUD form
  */
	crudCtrl.clearForm = function() {

    // Set a random HEX color
  	var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
		crudCtrl.entry = {"category":"", "color":randomColor, "content":"", "rating":Math.ceil(crudCtrl.maxRating/2), "date":""};
		crudCtrl.createState = true;
	};

  /*
  * Load the Oscar-related demo data
  */
	crudCtrl.loadDemoData = function() {

    // Get the data
		crudCtrl.categoryColors = oscars.getColors();
		crudCtrl.items = oscars.getItems();
		var len = crudCtrl.items.length;
		id = crudCtrl.items[len-1].id;

		crudCtrl.demoOn = true;

		crudCtrl.clearFilter();
		crudCtrl.clearForm();
	};

  /*
  * Clear all current items
  */
	crudCtrl.clearAll = function() {

		id = -1;
		crudCtrl.items = [];
		crudCtrl.filteredItems = "";
		crudCtrl.categoryColors = [];
		crudCtrl.demoOn = false;
		crudCtrl.clearForm();
	};

  /*
  * Filter items by date
  */
	crudCtrl.filterDate = function(items, filterText) {

		crudCtrl.filteredItems = $filter('filter')(items, { "date" : filterText });
	};

  /*
  * Clear filter on items
  */
	crudCtrl.clearFilter = function() {

		crudCtrl.filteredItems = crudCtrl.items;
		crudCtrl.filter = "";
	}

  init();

} ]);
