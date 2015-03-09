app.controller("VizController", ['$scope', '$window', function($scope, $window){

	var vizCtrl = this;

	var init = function(){

		vizCtrl.width = null;
  	}

  	vizCtrl.calcDimensions = function() {

    	var dims = {};

    	if (vizCtrl.width>1920) {
    		dims.height = 600;
    		dims.responsiveScale = 3.2;
    	}
    	else if (vizCtrl.width>1020 && vizCtrl.width<=1919) {
    		dims.height = $window.innerHeight-40;
    		dims.responsiveScale = 3.2;
    	}
    	else if (vizCtrl.width>600 && vizCtrl.width<=1019) {
    		dims.height = $window.innerHeight-40;
    		dims.responsiveScale = 2.2;
    	}
    	else {
    		dims.height = $window.innerHeight-40;
    		dims.responsiveScale = 1.4;
    	}
      	return dims;
    };

    init();

} ]);

app.controller("CrudController", [ '$scope', '$filter', 'oscars', function($scope, $filter, oscars){

	var crudCtrl = this;
	var id = -1;
	var radiusScaling = 2;

	var edit = false;
	var editID = -1;

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

	crudCtrl.togglePanel = function() {

		crudCtrl.showPanel =!crudCtrl.showPanel;
	}

	crudCtrl.syncColor = function() {

		var color = getColor(crudCtrl.entry.category);
		if (color) {
			crudCtrl.entry.color = color;
		}
	};

	crudCtrl.hoveringOverStar = function(value){
		crudCtrl.overStar = value;
	};

	crudCtrl.create = function() {

		id=id+1;
		crudCtrl.entry.id = id;
    crudCtrl.items.push(crudCtrl.entry);
    incrementCategoryColor(crudCtrl.entry.category, crudCtrl.entry.color);
    crudCtrl.clearFilter();
    crudCtrl.clearForm();
	};

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

	crudCtrl.edit = function(id) {

		getItem(id, function(item){
			$scope.$apply(function(){
        		crudCtrl.entry = {"id": item.id, "category": item.category, "color": getColor(item.category), "content": item.content, "rating": item.rating, "date": item.date };
        		crudCtrl.createState = false;
        		crudCtrl.showPanel = true;
        	});
		});
	};

	crudCtrl.update = function(id) {

		getItem(id, function(item) {

      decrementCategoryColor(item.category,item.color);
			incrementCategoryColor(crudCtrl.entry.category,crudCtrl.entry.color);

			item.id = crudCtrl.entry.id;
			item.category = crudCtrl.entry.category;
			item.color = crudCtrl.entry.color;
			item.content = crudCtrl.entry.content;
			item.rating = crudCtrl.entry.rating;
			item.date = crudCtrl.entry.date;
		});

		crudCtrl.clearFilter();
		crudCtrl.clearForm();

	};

	crudCtrl.delete = function(id,apply) {

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
		else {
			getItem(id, function(item,i){
				decrementCategoryColor(item.category,item.color);
				crudCtrl.items.splice(i,1);
				crudCtrl.clearFilter();
				crudCtrl.clearForm();
			});
		}
	};

	crudCtrl.clearForm = function() {

  	var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
		crudCtrl.entry = {"category":"", "color":randomColor, "content":"", "rating":Math.ceil(crudCtrl.maxRating/2), "date":""};
		crudCtrl.createState = true;
	};

	crudCtrl.loadDemoData = function() {

		crudCtrl.categoryColors = oscars.getColors();
		crudCtrl.items = oscars.getItems();
		var len = crudCtrl.items.length;
		id = crudCtrl.items[len-1].id;

		crudCtrl.demoOn = true;

		crudCtrl.clearFilter();
		crudCtrl.clearForm();
	};

	crudCtrl.clearAll = function() {

		id = -1;
		crudCtrl.items = [];
		crudCtrl.filteredItems = "";
		crudCtrl.categoryColors = [];
		crudCtrl.demoOn = false;
		crudCtrl.clearForm();
	};

	crudCtrl.filterDate = function(items, filterText) {

		crudCtrl.filteredItems = $filter('filter')(items, { "date" : filterText });
	};

	crudCtrl.clearFilter = function() {

		crudCtrl.filteredItems = crudCtrl.items;
		crudCtrl.filter = "";
	}

	init();

} ]);