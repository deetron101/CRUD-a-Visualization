/*
* Directive that renders the D3.js visualization and connects it with CRUD operations
*/
app.directive('visualization', function() {

  /*
  * Controller for the directive
  */
  var controller = ['$scope', function($scope){

    function init() {
      // At the beginning, there are no nodes in the visualisation
      $scope.root = { "nodes": [] };
    };

    init();

    /*
    * Synchronizes the nodes in the visualization with the data items
    */
    $scope.syncData = function() {

      // Resets the nodes for D3.js
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

      // Adds each node item by item
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

    /*
    * Add a new node for a single item
    */
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

    /*
    * Update a node for an updated item
    */
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

    /*
    * Delete a node for a deleted item
    */
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

    /*
    * Get the color a node should be drawn in based on the group (a.k.a. category) to which it belongs
    */
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

  /*
  * Link function for the directive
  */
  var link = function(scope, elem, attrs) {

    var svg, circle, textLabel, clusters, nodes;
    var width, height, scaleFactor;
    // Some default params for drawing and clustering nodes
    var maxRadius = 200;
    var padding = 4;
    var clusterPadding = 24;

    function init() {

      // Default dimensions
      width = scope.width;
      height = 100;
      scaleFactor = 1;

      // Add the svg needed for drawing circles
      svg = d3.select("#"+elem[0].id).append("svg")
          .attr("width", width)
          .attr("height", height);
    }

    init();

    // Watches items for changes directly, and redraw the visualization every time
    scope.$watch('items', function() {
        scope.syncData();
        redraw();
     }, true);

    // Watches the width of the container/window and adjust dimensions of the visualizaton acrodingly
    scope.$watch('width', function(newVal,oldVal) {

      if (newVal !== oldVal) {
        width = scope.width;
        var dims = scope.resizeAction();
        height = dims.height;
        scaleFactor = dims.responsiveScale;

        // Remove the SVG and add it back again
        svg.remove();

        svg = d3.select("#"+elem[0].id).append("svg")
            .attr("width", width)
            .attr("height", height);
        // Redraw all the nodes again
        redraw();
      }
    });

    /*
    * Redraw function for the visualization
    */
    function redraw() {

      var numClusters = scope.colorMap.length;

      // The largest node for each cluster
      clusters = new Array(numClusters);

      // Remove all the circles and the text boxes
      svg.selectAll("circle").remove();
      svg.selectAll("text").remove();

      // Redraw the D3 force cluster diagram
      nodes = scope.root.nodes;

      for(var i=0; i<nodes.length; i++) {
        var node = nodes[i];
        var g = node.group;
        // Needed for responsive scaling
        node.radius = node.radius2*scaleFactor;
        var r = node.radius;
        // Arrange into clusters by group, and the largest node is the cluster center
        var cluster = clusters[g];
        if (!cluster || (r > cluster.radius)) {
          clusters[g] = node;
        }
      }

      // Do D3 pack layout
      d3.layout.pack()
        .sort(null)
        .size([width, height])
        .children(function(d) { return d.values; })
        .value(function(d) { return d.radius*d.radius; })
        .nodes({values: d3.nest()
          .key(function(d) { return d.group; })
          .entries(nodes)});

      // Do D3 force diagram
      var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(0.02)
        .charge(0)
        .on("tick", tick)
        .start();

      // Clock for timing long-presses
      var clock = false;
      // Draw the nodes as circles on the SVG
      circle = svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", function(d) { return d.radius ; })
        .style("fill", function(d) { return scope.getColor(d.group ); })
        // Add click event
        .on("click", function(d) {
          toggleLabel(svg.selectAll("text."+d.group));
        })
        // Add doubleclick event
        .on("dblclick", function(d) {
          svg.selectAll("text."+d.group).style("opacity",1);
          scope.dClick({"id":d.id,"apply":true});
        })
        // Add touchstart event
        .on("touchstart", function(d) {
          clock = true;
          setTimeout(function(){
              clock = false;
          },600);
        })
        // Add touchend event
        .on("touchend", function(d) {
          if (!clock) {
            scope.dClick({"id":d.id,"apply":true});
          }
          clock = false;
        })
        // Make the circles draggable
        .call(force.drag);

      // Make a nice pop when the circles are first drawn
      circle.transition()
        .duration(750)
        .delay(function(d, i) { return i * 5; })
        .attrTween("r", function(d) {
          var i = d3.interpolate(0, d.radius );
            return function(t) { return d.radius = i(t); };
        });

      // Add the text boxes and labels for each node
      textLabel = svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y",function(d){ return d.y; })
        .attr("x",function(d){ return d.x; })
        .attr("class", function(d){ return "node-label "+d.group; })
        .attr("text-anchor", "middle")
        // Make them draggable
        .call(force.drag);

      // Add click event
      textLabel.on("click", function(d) {
            toggleLabel(svg.selectAll("text."+d.group));
      })
      // Add doubleclick event
      .on("dblclick", function(d) {
        svg.selectAll("text."+d.group).style("opacity",1);
        scope.dClick({"id":d.id,"apply":true});
      })
      // Add touchstart event
      .on("touchstart", function(d) {
        clock = true;
        setTimeout(function(){
            clock = false;
        },600);
      })
      // Add touchend event
      .on("touchend", function(d) {
        if (clock==false) {
          scope.dClick({"id":d.id,"apply":true});
        }
        clock = false;
      });

      // Arrange labels so they fit in the circle
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

    /*
    * Toggle the label of a selected circle/node
    */
    function toggleLabel(selection) {

        if (selection.style('opacity')==0) {
            selection.style('opacity',1);
        }
        else {
            selection.style('opacity',0);
        }
    }

    /*
    * Main function for splitting and arranging the label in the shape of a cicle
    */
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

    /*
    * Helper function for splitting and arranging the label in the shape of a cicle
    */
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

    /*
    * Moves the nodes, labels and interior tspans around the screen on each tick
    */
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

    // Resolves collisions between d and all other circles/nodes
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

  /*
  * Return function for the directive
  */
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

/*
* Small directive for creating the vizualisation color legend
*/
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

/*
* Small directive for detecting window resizes with debounce
*/
app.directive('debounceResize', ['$window', '$debounce', function($window, $debounce) {

  var link = function(scope, elem, attrs) {

    // Saves the width when a resize is detected
    scope.onResize = function() {
      scope.$apply(function(){
        scope.width = elem[0].clientWidth;
      });
    };

    // Resize function is filtered for debounce
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

/*
* Small directive for preventing the bubbling of events in the visualization
*/
app.directive('noBubble', function() {
    return function(scope, el, attrs) {
        el.bind(attrs.noBubble, function(e) {
            e.stopPropagation();
        });
    };
});

/*
* Pagination Directive that works with AJAX data
*/
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
