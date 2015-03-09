app.directive('visualization', function() {

    var controller = ['$scope', function($scope){

      	init();

    	  function init() {

    		  $scope.root = { "nodes": [] };
      	};

      	$scope.syncData = function() {

      		$scope.root.nodes = [];
      		var scaling = $scope.props.scaling;

      		var groupKey, labelKey, radiusKey;
      		if ($scope.props !== undefined) {
      			groupKey = $scope.props.group;
      			labelKey = $scope.props.label;
      			radiusKey = $scope.props.radius;
      		}
      		else {
      			groupKey = "group";
      			labelKey = "label";
      			radiusKey = "radius";
      		}

      		var i;
      		var len = $scope.items.length;
      		for (i=0; i<len; i++) {
      			var item = $scope.items[i];
      			var node = {};
      			node.id = item.id;
      			node.group = item[groupKey];
      			node.label = item[labelKey];
      			node.radius = item[radiusKey]*scaling;
      			node.radius2 = node.radius;
      			$scope.root.nodes.push(node);
      		}
      	};

      	$scope.addData = function(item) {

      		var nodes = $scope.root.nodes;
      		var scaling = $scope.props.scaling;

      		var groupKey, labelKey, radiusKey;
      		if ($scope.props !== undefined) {
      			groupKey = $scope.props.group;
      			labelKey = $scope.props.label;
      			radiusKey = $scope.props.radius;
      		}
      		else {
      			groupKey = "group";
      			labelKey = "label";
      			radiusKey = "radius";
      		}

      		var node = {};
      		node.id = item.id;
      		node.group = item[groupKey];
      		node.label = item[labelKey];
      		node.radius = item[radiusKey]*scaling;
      		node.radius2 = node.radius;
      	    nodes.push(node);
    	  };

      	$scope.updateData = function(item) {

      		var nodes = $scope.root.nodes;
      		scaling = $scope.props.scaling;

      		var groupKey, labelKey, radiusKey;
      		if ($scope.props !== undefined) {
      			groupKey = $scope.props.group;
      			labelKey = $scope.props.label;
      			radiusKey = $scope.props.radius;
      		}
      		else {
      			groupKey = "group";
      			labelKey = "label";
      			radiusKey = "radius";
      		}

      		var updateID = -1;
      		var i = 0;
      		while (i < nodes.length) {
      			var node = nodes[i];
      			updateID = node.id;
      			if (updateID === item.id) {
      				node.group = item[groupKey];
      				node.label = item[labelKey];
      				node.radius = item[radiusKey]*scaling;
      				node.radius2 = node.radius;
      				break;
      			}
      			i++;
      		}
      	};

      	$scope.deleteData = function(item) {

      		var nodes = $scope.root.nodes;

      		var deleteID = -1;
      		var i = 0;
      		while (i < nodes.length) {
      			var node = nodes[i];
      			deleteID = node.id;
      			if (deleteID === item.id) {
      				nodes.splice(i,1);
      				break;
      			}
      			i++;
      		}
      	};

      	$scope.getColor = function(group) {

      		var colorMap = $scope.colorMap;
      		var i = 0;
      		while (i < colorMap.length) {
      			var grp = colorMap[i].group;
      			if (grp === group) {
      				var color = colorMap[i].color;
      				return(color);
      			}
      			i++;
      		}
      		return(false);
      	}

    }];

    var link = function(scope, elem, attrs) {

      	var svg, circle, textLabel, clusters, nodes;
      	var width, height, scaleFactor;
      	var maxRadius = 200;
      	var padding = 4;
      	var clusterPadding = 24;

      	init();

      	function init() {

      		width = scope.width;
      		height = 100;
      		scaleFactor = 1;

      		svg = d3.select("#"+elem[0].id).append("svg")
    		    .attr("width", width)
    		    .attr("height", height);
      	}

      	// Watches items for changes directly
      	scope.$watch('items', function() {
      	           scope.syncData();
    	 	       redraw();
    	   }, true);

    	scope.$watch('width', function(newVal,oldVal) {

      		if (newVal !== oldVal) {

      			width = scope.width;
      			var dims = scope.resizeAction();
      			height = dims.height;
      			scaleFactor = dims.responsiveScale;

      			svg.remove();

      			svg = d3.select("#"+elem[0].id).append("svg")
      		    	.attr("width", width)
      		    	.attr("height", height);

      	 		redraw();
      		}
    	});

      	function redraw() {

      		var numClusters = scope.colorMap.length;

      		// The largest node for each cluster
      		clusters = new Array(numClusters);

      		svg.selectAll("circle").remove();
      		svg.selectAll("text").remove();

      		nodes = scope.root.nodes;

      		for(var i=0; i<nodes.length; i++) {
      		  var node = nodes[i];
    		  	var g = node.group;
    		  	node.radius = node.radius2*scaleFactor;
    		  	var r = node.radius;
    		  	var cluster = clusters[g];
    		  	if (!cluster || (r > cluster.radius)) {
    		  		clusters[g] = node;
    		  	}
      		}

      		d3.layout.pack()
    	    	.sort(null)
    	    	.size([width, height])
    	    	.children(function(d) { return d.values; })
    	    	.value(function(d) { return d.radius*d.radius; })
    	    	.nodes({values: d3.nest()
    	        .key(function(d) { return d.group; })
    	        .entries(nodes)});

      		var force = d3.layout.force()
    		    .nodes(nodes)
    		    .size([width, height])
    		    .gravity(0.02)
    		    .charge(0)
    		    .on("tick", tick)
    		    .start();

      		circle = svg.selectAll("circle")
    		    .data(nodes)
    		    .enter()
    		    .append("circle")
    		    .attr("r", function(d) { return d.radius ; })
    		    .style("fill", function(d) { return scope.getColor(d.group ); })
    		    .on("click", function(d) {
    		    	toggleLabel(svg.selectAll("text."+d.group));
    		    })
    		    .on("dblclick", function(d) {
    		    	scope.dClick({"id":d.id,"apply":true});
    		    })
    		    .call(force.drag);

      		circle.transition()
        		.duration(750)
        		.delay(function(d, i) { return i * 5; })
        		.attrTween("r", function(d) {
         			var i = d3.interpolate(0, d.radius );
          			return function(t) { return d.radius = i(t); };
        	  });

      		textLabel = svg.selectAll("text")
      			.data(nodes)
      			.enter()
      			.append("text")
      			.attr("y",function(d){ return d.y; })
      			.attr("x",function(d){ return d.x; })
      			.attr("class", function(d){ return "node-label "+d.group; })
      			.attr("text-anchor", "middle")
      			.call(force.drag);

      		textLabel.on("click", function(d) {
                toggleLabel(svg.selectAll("text."+d.group));
      		})
      		.on("dblclick", function(d) {
      		  scope.dClick({"id":d.id,"apply":true});
      		});

      		textLabel.each(function(d) {
      			labelSplits = splitLabel(d.label, d.radius/3);
      			var split = labelSplits[0];
      			d3.select(this).append("tspan")
      			.attr("x", d.x)
      			.attr("y", d.y)
      			.text(split.label)
      			.attr("dy", split.dy);

      			for(var i=1; i<labelSplits.length; i++) {
      				var split = labelSplits[i];
      				d3.select(this).append("tspan")
      				.text(split.label)
      				.attr("x", d.x)
      				.attr("y", d.y)
      				.attr("dy", split.dy);
      			}
    		});

    	}

        function toggleLabel(selection) {

            if (selection.style('opacity')==0) {
                selection.style('opacity',1);
            }
            else {
                selection.style('opacity',0);
            }
        }

      	function getNearestSpace(ind, string) {

      		var winningInd = string.indexOf(" ");
      		var winningDiff = Math.abs(winningInd-ind);
      		for(var i=winningInd+1; i<string.length; i++) {
          	    if ((string[i] === " ") && (Math.abs(i-ind) < winningDiff )) {
          		   winningInd = i;
          		   winningDiff = Math.abs(i-ind);
          	    }
      		}
      		return winningInd;
      	}

      	function splitLabel(label,radius) {

      		var splits = [];
      		var label = label.trim();
      		var labelLen = label.length;

      		if (labelLen <= radius || label.indexOf(" ") == -1) {
      			splits.push({"label":label.trim(),"dy":0});
      			return splits;
      		}

      		var l = getNearestSpace(Math.round(labelLen/2 - radius/2), label);
      		var r = getNearestSpace(Math.round(labelLen/2 + radius/2), label);
      		if (l===r) { l = 0; }

      		var split = label.substring(l,r+1).trim();
      		splits.push({"label":split,"dy":0});

      		label_left = label.substring(0,l).trim();
      		label_right = label.substring(r,label.length).trim();

      		var span_left = radius*2+1;
      		var len_left = label_left.length;
      		var i = 0;
      		while (len_left > 0) {
      			i++;
      			span_left = Math.round(span_left/1.1);
      			l = Math.max(getNearestSpace(len_left-span_left,label_left),0);
      			split = label_left.substring(l,len_left);
      			split = split.trim();
      			splits.unshift({"label":split,"dy":-12*i});
      			label_left = label_left.substring(0,l);
      			len_left = label_left.length;
      		}

      		var span_right = radius*2+1;
      		var len_right = label_right.length;
      		var i = 0;
      		while (len_right > 0) {
      			i++;
      			span_right = Math.round(span_right/1.1);
      			r = getNearestSpace(span_right,label_right);
      			if (r === -1) {
      				r = len_right;
      			}
      			split = label_right.substring(0, r);
      			split = split.trim();
      			splits.push({"label":split,"dy":12*i});
      			label_right = label_right.substring(r+1,len_right);
      			len_right = label_right.length;
      		}

      		return splits;
      	}

      	function tick(e) {

            circle
      	        .each(cluster(10 * e.alpha * e.alpha))
      	        .each(collide(0.5))
      	        .attr("cx", function(d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));})
      	        .attr("cy", function(d) { return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y)); });

      	    textLabel
      	  	    .attr("x", function(d) { return d.x })
      	        .attr("y", function(d) { return d.y });

      	    textLabel.selectAll("tspan")
      	  		.attr("x", function(d) { return d.x })
      	     	.attr("y", function(d) { return d.y });
      	}

      	// Move d to be adjacent to the cluster node.
      	function cluster(alpha) {
          	return function(d) {
          	    var cluster = clusters[d.group],
          	        k = 1;

          	    // For cluster nodes, apply custom gravity.
          	    if (cluster === d) {
          	      cluster = {x: width / 2, y: height / 2, radius: - d.radius};
          	      k = .1 * Math.sqrt(d.radius);
          	    }

          	    var x = d.x - cluster.x,
          	        y = d.y - cluster.y,
          	        l = Math.sqrt(x * x + y * y),
          	        r = d.radius + cluster.radius;
          	    if (l != r) {
          	      l = (l - r) / l * alpha * k;
          	      d.x -= x *= l;
          	      d.y -= y *= l;
          	      cluster.x += x;
          	      cluster.y += y;
          	    }
          	};
      	}

      	// Resolves collisions between d and all other circle.
      	function collide(alpha) {
          	var quadtree = d3.geom.quadtree(nodes);
          	return function(d) {
          	    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
          	        nx1 = d.x - r,
          	        nx2 = d.x + r,
          	        ny1 = d.y - r,
          	        ny2 = d.y + r;
          	    quadtree.visit(function(quad, x1, y1, x2, y2) {
              	    if (quad.point && (quad.point !== d)) {
              	        var x = d.x - quad.point.x,
              	            y = d.y - quad.point.y,
              	            l = Math.sqrt(x * x + y * y),
              	            r = d.radius + quad.point.radius + (d.group === quad.point.group ? padding : clusterPadding);
              	        if (l < r) {
              	          l = (l - r) / l * alpha;
              	          d.x -= x *= l;
              	          d.y -= y *= l;
              	          quad.point.x += x;
              	          quad.point.y += y;
              	        }
              	    }
          	        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          	    });
          	};
  	    }

    };

  return {
        restrict: 'EA',
        scope: {
            width: '@vWidth',
            resizeAction: '&vResizeAction',
            props: '=vProps',
            items: '=vItems',
            filter: '=vFilter',
            colorMap: '=vColormap',
            dClick: '&vDclick',
            reset: '&vReset'
        },
        template: '<div class="vizualization"></div>',
        replace: true,
        controller: controller,
        link: link
    }

});

/* Pagination Directive that works with AJAX data */

app.directive('ngPaginatedTable', function() {

    var controller = ['$scope', '$filter', function($scope, $filter){

    	$scope.init = function() {
    	  	$scope.filteredItems = $scope.items;
    	  	$scope.currentPage = 0;
    	  	$scope.pageRange();
      	};

    	$scope.filter = function(){
    	  	$scope.filteredItems = $filter('filter')($scope.items, { content: $scope.searchText});
    	  	$scope.currentPage = 0;
    	  	$scope.pageRange();
    	};

    	$scope.pageCount = function() {
    		return Math.ceil($scope.filteredItems.length/$scope.itemsPerPage);
    	};

    	$scope.pageRange = function() {
    		$scope.range = [];
    		var rangeSize = 1;
    		var start = $scope.currentPage - rangeSize;
    		var end = $scope.currentPage + rangeSize + 1;
    		if ( start < 0 ) {
    			start = 0;
    		}
    		if (end > $scope.pageCount() ) {
    			end = $scope.pageCount() ;
    		}
    		for (var i=start; i<end; i++) {
    			$scope.range.push(i);
    		}
    	};

    	$scope.prevPage = function() {
    		if ($scope.currentPage > 0) {
    			$scope.currentPage--;
    		}
    	};

    	$scope.prevPageDisabled = function() {
    		return $scope.currentPage === 0 ? "disabled" : "";
    	};

    	$scope.nextPage = function() {
    		if ($scope.currentPage < $scope.pageCount()-1) {
    			$scope.currentPage++;
    		}
    	};

    	$scope.nextPageDisabled = function() {
    		return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
    	};

    	$scope.setPage = function(n) {
    		$scope.currentPage = n;
    		$scope.pageRange();
    	};
    }];

    var link = function(scope, elem, attrs) {
      	scope.filteredItems = [];
      	scope.init();
      	scope.$watch('items', function(newVal,oldVal) {
    	 	if (newVal.length>0) {
    	 		scope.init();
    	    }
        });
    }

    return {
        restrict: 'EA',
        scope: {
            items: '=pItems',
            itemsPerPage: '@pItemsPerPage'
        },
        templateUrl: 'app/directives/templates/paginatedTable.html',
        controller: controller,
        link: link
    }

});

app.directive('debounceResize', ['$window', '$debounce', function($window, $debounce) {

	var link = function(scope, elem, attrs) {

        scope.onResize = function() {
        	scope.$apply(function(){
        		scope.width = elem[0].clientWidth;
        	});
        };

        angular.element($window).bind('resize', function() {
        	$debounce(scope.onResize, scope.interval);
        });

        scope.width = elem[0].clientWidth;

    };

    return {
    	restrict: 'EA',
    	scope: {
        	width: '=drWidth',
        	interval: '@drInterval'
        },
    	link: link
    }

} ]);

app.directive('colorlegend', function() {
    return {
    	restrict: 'EA',
    	scope: {
        	items: '=lMap',
        },
        templateUrl: 'app/directives/templates/colorLegend.html',
        replace: true
    }
});

app.directive('noBubble', function() {
    return function(scope, el, attrs) {
        el.bind(attrs.noBubble, function(e) {
            e.stopPropagation();
        });
    };
})