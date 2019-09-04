/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * General bootstrap of the application.
 */
angular.module('flowableModeler')
    .controller('EditorController', ['$rootScope', '$scope', '$http', '$q', '$routeParams', '$timeout', '$location', '$translate', '$modal', 'editorManager', 'FormBuilderService',
        function ($rootScope, $scope, $http, $q, $routeParams, $timeout, $location, $translate, $modal, editorManager, FormBuilderService) {

    $rootScope.editorFactory = $q.defer();

    $rootScope.forceSelectionRefresh = false;

    $rootScope.ignoreChanges = false; // by default never ignore changes
    
    $rootScope.validationErrors = [];

    $rootScope.staticIncludeVersion = Date.now();

    /**
     * Initialize the event bus: couple all Oryx events with a dispatch of the
     * event of the event bus. This way, it gets much easier to attach custom logic
     * to any event.
     */


    /* Helper method to fetch model from server (always needed) */
    function fetchModel() {

        var modelUrl;
        if ($routeParams.modelId) {
            modelUrl = FLOWABLE.URL.getModel($routeParams.modelId);

        } else {
            modelUrl = FLOWABLE.URL.newModelInfo();
        }

        $http({method: 'GET', url: modelUrl}).
            success(function (data, status, headers, config) {
                $rootScope.editor = new ORYX.Editor(data);
                $rootScope.modelData = angular.fromJson(data);
                $rootScope.editorFactory.resolve();
            }).
            error(function (data, status, headers, config) {
                $location.path("/processes/");
            });
    }


    function initScrollHandling() {
        var canvasSection = jQuery('#canvasSection');
        canvasSection.scroll(function() {

            // Hides the resizer and quick menu items during scrolling

            var selectedElements = editorManager.getSelection();
			var subSelectionElements = editorManager.getSubSelection();

            $scope.selectedElements = selectedElements;
            $scope.subSelectionElements = subSelectionElements;
            if (selectedElements && selectedElements.length > 0)
            {
            	$rootScope.selectedElementBeforeScrolling = selectedElements[0];
            }

            jQuery('.Oryx_button').each(function(i, obj) {
                  $scope.orginalOryxButtonStyle = obj.style.display;
                  obj.style.display = 'none';
            });
            jQuery('.resizer_southeast').each(function(i, obj) {
                  $scope.orginalResizerSEStyle = obj.style.display;
                  obj.style.display = 'none';
            });
            jQuery('.resizer_northwest').each(function(i, obj) {
                  $scope.orginalResizerNWStyle = obj.style.display;
                  obj.style.display = 'none';
            });
            editorManager.handleEvents({type:ORYX.CONFIG.EVENT_CANVAS_SCROLL});
        });

        canvasSection.scrollStopped(function(){

            // Puts the quick menu items and resizer back when scroll is stopped.

            editorManager.setSelection([]); // needed cause it checks for element changes and does nothing if the elements are the same
            editorManager.setSelection($scope.selectedElements, $scope.subSelectionElements);
            $scope.selectedElements = undefined;
            $scope.subSelectionElements = undefined;

            function handleDisplayProperty(obj) {
                if (jQuery(obj).position().top > 0) {
                    obj.style.display = 'block';
                } else {
                    obj.style.display = 'none';
                }
            }

            jQuery('.Oryx_button').each(function(i, obj) {
                handleDisplayProperty(obj);
            });
            jQuery('.resizer_southeast').each(function(i, obj) {
                handleDisplayProperty(obj);
            });
            jQuery('.resizer_northwest').each(function(i, obj) {
                handleDisplayProperty(obj);
            });

        });
    }

    /**
     * Initialize the Oryx Editor when the content has been loaded
     */
    if (!$rootScope.editorInitialized) {
    
        var paletteHelpWrapper = jQuery('#paletteHelpWrapper');
		var paletteSectionFooter = jQuery('#paletteSectionFooter');
		var paletteSectionOpen = jQuery('#paletteSectionOpen');
		var contentCanvasWrapper = jQuery('#contentCanvasWrapper');

		paletteSectionFooter.on('click', function() {
			paletteHelpWrapper.addClass('close');
			contentCanvasWrapper.addClass('collapsedCanvasWrapper');
			paletteSectionOpen.removeClass('hidden');
		});

		paletteSectionOpen.on('click', function () {
			paletteHelpWrapper.removeClass('close');
			contentCanvasWrapper.removeClass('collapsedCanvasWrapper');
			paletteSectionOpen.addClass('hidden');
		});

        /**
         * A 'safer' apply that avoids concurrent updates (which $apply allows).
         */
        $rootScope.safeApply = function(fn) {
        	if (this.$root) {
	            var phase = this.$root.$$phase;
	            if(phase == '$apply' || phase == '$digest') {
	                if(fn && (typeof(fn) === 'function')) {
	                    fn();
	                }
	            } else {
	                this.$apply(fn);
	            }
	            
        	} else {
                this.$apply(fn);
            }
        };
        
        $rootScope.addHistoryItem = function(resourceId) {
        	var modelMetaData = editorManager.getBaseModelData();
        	
        	var historyItem = {
                id: modelMetaData.modelId, 
                name: modelMetaData.name,
                key: modelMetaData.key,
                stepId: resourceId,
                type: 'bpmnmodel'
            };
        	
        	if (editorManager.getCurrentModelId() != editorManager.getModelId()) {
				historyItem.subProcessId = editorManager.getCurrentModelId();
			}
        	
        	$rootScope.editorHistory.push(historyItem);
        };
        
        $rootScope.getStencilSetName = function() {
            var modelMetaData = editorManager.getBaseModelData();
            if (modelMetaData.model.stencilset.namespace == 'http://b3mn.org/stencilset/cmmn1.1#') {
                return 'cmmn1.1';
            } else {
                return 'bpmn2.0';
            }
        };

        /**
         * Initialize the event bus: couple all Oryx events with a dispatch of the
         * event of the event bus. This way, it gets much easier to attach custom logic
         * to any event.
         */

        $rootScope.editorFactory.promise.then(function() {

            $rootScope.formItems = undefined;

            FLOWABLE.eventBus.editor = $rootScope.editor;

            var eventMappings = [
                { oryxType : ORYX.CONFIG.EVENT_SELECTION_CHANGED, flowableType : FLOWABLE.eventBus.EVENT_TYPE_SELECTION_CHANGE },
                { oryxType : ORYX.CONFIG.EVENT_DBLCLICK, flowableType : FLOWABLE.eventBus.EVENT_TYPE_DOUBLE_CLICK },
                { oryxType : ORYX.CONFIG.EVENT_MOUSEOUT, flowableType : FLOWABLE.eventBus.EVENT_TYPE_MOUSE_OUT },
                { oryxType : ORYX.CONFIG.EVENT_MOUSEOVER, flowableType : FLOWABLE.eventBus.EVENT_TYPE_MOUSE_OVER },
                { oryxType: ORYX.CONFIG.EVENT_EDITOR_INIT_COMPLETED, flowableType:FLOWABLE.eventBus.EVENT_TYPE_EDITOR_READY},
				{ oryxType: ORYX.CONFIG.EVENT_PROPERTY_CHANGED, flowableType: FLOWABLE.eventBus.EVENT_TYPE_PROPERTY_VALUE_CHANGED}

            ];

            eventMappings.forEach(function(eventMapping) {
                editorManager.registerOnEvent(eventMapping.oryxType, function(event) {
                    FLOWABLE.eventBus.dispatch(eventMapping.flowableType, event);
                });
            });

            // Show getting started if this is the first time (boolean true for use local storage)
            // FLOWABLE_EDITOR_TOUR.gettingStarted($scope, $translate, $q, true);
        });

        // Hook in resizing of main panels when window resizes
        // TODO: perhaps move to a separate JS-file?
        jQuery(window).resize(function () {

            // Calculate the offset based on the bottom of the module header
            var editorHeader = jQuery("#editor-header");
            var offset = editorHeader.offset();
            var propSection = jQuery('#propertySection');
            var canvas = jQuery('#canvasSection');
            var mainHeader = jQuery('#main-header');
            if (offset == undefined || offset === null
                || canvas === undefined || canvas === null || editorHeader == null) {
                return;
            }

            if ($rootScope.editor) {
	        	var selectedElements = editorManager.getSelection();
				var subSelectionElements = editorManager.getSelection();

	            $scope.selectedElements = selectedElements;
	            $scope.subSelectionElements = subSelectionElements;
	            if (selectedElements && selectedElements.length > 0) {
	            	$rootScope.selectedElementBeforeScrolling = selectedElements[0];

	            	editorManager.setSelection([]); // needed cause it checks for element changes and does nothing if the elements are the same
	                editorManager.setSelection($scope.selectedElements, $scope.subSelectionElements);
	                $scope.selectedElements = undefined;
	                $scope.subSelectionElements = undefined;
	            }
        	}
            
        	var totalAvailable = jQuery(window).height() - offset.top - editorHeader.height();
            
            // 计算画布的高度
            canvas.height(totalAvailable);
  

            // 属性窗口的高度和canvas的一致
            propSection.height(totalAvailable);
            //jQuery('#contentCanvasWrapper').width(jQuery(window).width() - jQuery('#paletteHelpWrapper').width() -jQuery('#propertiesHelpWrapper').width())

            // 计算属性body的高度 total - title
            jQuery('.selected-item-body').height(totalAvailable - jQuery('.selected-item-title').height() );

			var footerHeight = jQuery('#paletteSectionFooter').height();
			var treeViewHeight = jQuery('#process-treeview-wrapper').height();
			jQuery('#paletteSection').height(totalAvailable - treeViewHeight - footerHeight);
      
            // Update positions of the resize-markers, according to the canvas

            var actualCanvas = null;
            if (canvas && canvas[0].children[1]) {
                actualCanvas = canvas[0].children[1];
            }

           
            var canvasTop = canvas.position().top;
            var canvasLeft = canvas.position().left;
            var canvasHeight = canvas[0].clientHeight;
            var canvasWidth = canvas[0].clientWidth;
            var iconCenterOffset = 8;
            var widthDiff = 0;

            var actualWidth = 0;
            if (actualCanvas) {
                // In some browsers, the SVG-element clientwidth isn't available, so we revert to the parent
                actualWidth = actualCanvas.clientWidth || actualCanvas.parentNode.clientWidth;
            }

            if (actualWidth < canvas[0].clientWidth) {
                widthDiff = actualWidth - canvas[0].clientWidth;
                // In case the canvas is smaller than the actual viewport, the resizers should be moved
                canvasLeft -= widthDiff / 2;
                canvasWidth += widthDiff;
            }

            var iconWidth = 17;
            var iconOffset = 20;

            var north = jQuery('#canvas-grow-N');
            north.css('top', canvasTop + iconOffset + 'px');
            north.css('left', canvasLeft - 10 + (canvasWidth - iconWidth) / 2 + 'px');

            var south = jQuery('#canvas-grow-S');
            south.css('top', (canvasTop + canvasHeight - iconOffset - iconCenterOffset) +  'px');
            south.css('left', canvasLeft - 10 + (canvasWidth - iconWidth) / 2 + 'px');

            var east = jQuery('#canvas-grow-E');
            east.css('top', canvasTop - 10 + (canvasHeight - iconWidth) / 2 + 'px');
            east.css('left', (canvasLeft + canvasWidth - iconOffset - iconCenterOffset) + 'px');

            var west = jQuery('#canvas-grow-W');
            west.css('top', canvasTop -10 + (canvasHeight - iconWidth) / 2 + 'px');
            west.css('left', canvasLeft + iconOffset + 'px');

            north = jQuery('#canvas-shrink-N');
            north.css('top', canvasTop + iconOffset + 'px');
            north.css('left', canvasLeft + 10 + (canvasWidth - iconWidth) / 2 + 'px');

            south = jQuery('#canvas-shrink-S');
            south.css('top', (canvasTop + canvasHeight - iconOffset - iconCenterOffset) +  'px');
            south.css('left', canvasLeft +10 + (canvasWidth - iconWidth) / 2 + 'px');

            east = jQuery('#canvas-shrink-E');
            east.css('top', canvasTop + 10 + (canvasHeight - iconWidth) / 2 +  'px');
            east.css('left', (canvasLeft + canvasWidth - iconOffset - iconCenterOffset) + 'px');

            west = jQuery('#canvas-shrink-W');
            west.css('top', canvasTop + 10 + (canvasHeight - iconWidth) / 2 + 'px');
            west.css('left', canvasLeft + iconOffset + 'px');
        });

        jQuery(window).trigger('resize');

        jQuery.fn.scrollStopped = function(callback) {
            jQuery(this).scroll(function(){
                var self = this, $this = jQuery(self);
                if ($this.data('scrollTimeout')) {
                    clearTimeout($this.data('scrollTimeout'));
                }
                $this.data('scrollTimeout', setTimeout(callback,50,self));
            });
        };

        FLOWABLE.eventBus.addListener('ORYX-EDITOR-LOADED',function(){
			this.editorFactory.resolve();
			this.editorInitialized = true;
			this.modelData = editorManager.getBaseModelData();
			
		}, $rootScope);
		
		FLOWABLE.eventBus.addListener(FLOWABLE.eventBus.EVENT_TYPE_EDITOR_READY, function() {
			var url = window.location.href;
		    var regex = new RegExp("[?&]subProcessId(=([^&#]*)|&|#|$)");
		    var results = regex.exec(url);
		    if (results && results[2]) {
		    	editorManager.edit(decodeURIComponent(results[2].replace(/\+/g, " ")));
	    	}
	    });
    }

    $scope.$on('$locationChangeStart', function(event, next, current) {
    	if ($rootScope.editor && !$rootScope.ignoreChanges) {
    		var plugins = $rootScope.editor.loadedPlugins;

    		var savePlugin;
    		for (var i=0; i<plugins.length; i++) {
    			if (plugins[i].type == 'ORYX.Plugins.Save') {
    				savePlugin = plugins[i];
    				break;
    			}
    		}

    		if (savePlugin && savePlugin.hasChanges()) {
    			// Always prevent location from changing. We'll use a popup to determine the action we want to take
    			event.preventDefault();

    			if (!$scope.unsavedChangesModalInstance) {

    				var handleResponseFunction = function (discard) {
    					$scope.unsavedChangesModalInstance = undefined;
    					if (discard) {
    						$rootScope.ignoreChanges = true;
    		                $location.url(next.substring(next.indexOf('/#') + 2));
    					} else {
    		                $rootScope.ignoreChanges = false;
    		                $rootScope.setMainPageById('processes');
    					}
    				};

    				$scope.handleResponseFunction = handleResponseFunction;

                    _internalCreateModal({
    					template: 'editor-app/popups/unsaved-changes.html',
    					scope: $scope
    				},  $modal, $scope);
    			}
    		}
    	}
    });

    // Always needed, cause the DOM element on wich the scroll event listeners are attached are changed for every new model
    initScrollHandling();

    var modelId = $routeParams.modelId;
	editorManager.setModelId(modelId);
	//we first initialize the stencilset used by the editor. The editorId is always the modelId.
	$http.get(FLOWABLE.URL.getModel(modelId)).then(function (response){

	    editorManager.setModelData(response);
	    return response;
	}).then(function (modelData) {
	    if(modelData.data.model.stencilset.namespace == 'http://b3mn.org/stencilset/cmmn1.1#') {
	       return $http.get(FLOWABLE.URL.getCmmnStencilSet());
	    } else {
	       return $http.get(FLOWABLE.URL.getStencilSet());
	    }
    }).then(function (response){
        const lan='#387EC2';
        const huang='#CD950C';
        const fen='#FFB6C1';
        let svgStr1=`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns:oryx="http://www.b3mn.org/oryx"
   xmlns:xlink="http://www.w3.org/1999/xlink"

   width="102"
   height="82"
   version="1.0">
  <defs></defs>
  <oryx:magnets>
    <oryx:magnet oryx:cx="1" oryx:cy="20" oryx:anchors="left" />
    <oryx:magnet oryx:cx="1" oryx:cy="40" oryx:anchors="left" />
    <oryx:magnet oryx:cx="1" oryx:cy="60" oryx:anchors="left" />
    
    <oryx:magnet oryx:cx="25" oryx:cy="79" oryx:anchors="bottom" />
    <oryx:magnet oryx:cx="50" oryx:cy="79" oryx:anchors="bottom" />
    <oryx:magnet oryx:cx="75" oryx:cy="79" oryx:anchors="bottom" />
    
    <oryx:magnet oryx:cx="99" oryx:cy="20" oryx:anchors="right" />
    <oryx:magnet oryx:cx="99" oryx:cy="40" oryx:anchors="right" />
    <oryx:magnet oryx:cx="99" oryx:cy="60" oryx:anchors="right" />
    
    <oryx:magnet oryx:cx="25" oryx:cy="1" oryx:anchors="top" />
    <oryx:magnet oryx:cx="50" oryx:cy="1" oryx:anchors="top" />
    <oryx:magnet oryx:cx="75" oryx:cy="1" oryx:anchors="top" />
    
    <oryx:magnet oryx:cx="50" oryx:cy="40" oryx:default="yes" />
  </oryx:magnets>
  <g pointer-events="fill" oryx:minimumSize="50 40">
    <rect id="text_frame" oryx:anchors="bottom top right left" x="1" y="1" width="94" height="79" rx="10" ry="10" stroke="none" stroke-width="0" fill="none" />
    <rect id="bg_frame" oryx:resize="vertical horizontal" x="0" y="0" width="100" height="80" rx="10" ry="10" stroke="#bbbbbb" stroke-width="1" fill="#f9f9f9" />
        <text 
            font-size="12" 
            id="text_name" 
            x="50" 
            y="40" 
            oryx:align="middle center"
            oryx:fittoelem="text_frame"
            stroke="#373e48">
        </text>
    
    <g id="scriptTask" transform="translate(2,2)">
   <path
   oryx:anchors="top left"
    xmlns="http://www.w3.org/2000/svg" fill="${fen}" d="M7.95,0c2.25,0,4.07,1.79,4.07,4c0,2.21-1.82,4-4.07,4S3.89,6.21,3.89,4S5.71,0,7.95,0z M7.95,0  c2.25,0,4.07,1.79,4.07,4c0,2.21-1.82,4-4.07,4S3.89,6.21,3.89,4S5.71,0,7.95,0z M6.43,9.33h3.39c2.9,0,5.25,2.31,5.25,5.17v0.33  c0,1.12-2.35,1.17-5.25,1.17H6.43c-2.9,0-5.25,0-5.25-1.17V14.5C1.18,11.65,3.53,9.33,6.43,9.33L6.43,9.33z" /> </g>
  
    <g id="parallel">
        <path oryx:anchors="bottom" fill="none" stroke="#bbbbbb" d="M46 70 v8 M50 70 v8 M54 70 v8" stroke-width="2" />
    </g>
    <g id="sequential">
        <path oryx:anchors="bottom" fill="none" stroke="#bbbbbb" stroke-width="2" d="M46,76h10M46,72h10 M46,68h10"/>
    </g>
    

    <g id="compensation">
        <path oryx:anchors="bottom" fill="none" stroke="#bbbbbb" d="M 62 74 L 66 70 L 66 78 L 62 74 L 62 70 L 58 74 L 62 78 L 62 74" stroke-width="1" />
    </g>
  </g>
</svg>`

let svgStr2=`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns:oryx="http://www.b3mn.org/oryx"
   xmlns:xlink="http://www.w3.org/1999/xlink"

   width="102"
   height="82"
   version="1.0">
  <defs></defs>
  <oryx:magnets>
    <oryx:magnet oryx:cx="1" oryx:cy="20" oryx:anchors="left" />
    <oryx:magnet oryx:cx="1" oryx:cy="40" oryx:anchors="left" />
    <oryx:magnet oryx:cx="1" oryx:cy="60" oryx:anchors="left" />
    
    <oryx:magnet oryx:cx="25" oryx:cy="79" oryx:anchors="bottom" />
    <oryx:magnet oryx:cx="50" oryx:cy="79" oryx:anchors="bottom" />
    <oryx:magnet oryx:cx="75" oryx:cy="79" oryx:anchors="bottom" />
    
    <oryx:magnet oryx:cx="99" oryx:cy="20" oryx:anchors="right" />
    <oryx:magnet oryx:cx="99" oryx:cy="40" oryx:anchors="right" />
    <oryx:magnet oryx:cx="99" oryx:cy="60" oryx:anchors="right" />
    
    <oryx:magnet oryx:cx="25" oryx:cy="1" oryx:anchors="top" />
    <oryx:magnet oryx:cx="50" oryx:cy="1" oryx:anchors="top" />
    <oryx:magnet oryx:cx="75" oryx:cy="1" oryx:anchors="top" />
    
    <oryx:magnet oryx:cx="50" oryx:cy="40" oryx:default="yes" />
  </oryx:magnets>
  <g pointer-events="fill" oryx:minimumSize="50 40">
    <rect id="text_frame" oryx:anchors="bottom top right left" x="1" y="1" width="94" height="79" rx="10" ry="10" stroke="none" stroke-width="0" fill="none" />
    <rect id="bg_frame" oryx:resize="vertical horizontal" x="0" y="0" width="100" height="80" rx="10" ry="10" stroke="#bbbbbb" stroke-width="1" fill="#f9f9f9" />
        <text 
            font-size="12" 
            id="text_name" 
            x="50" 
            y="40" 
            oryx:align="middle center"
            oryx:fittoelem="text_frame"
            stroke="#373e48">
        </text>  
    <g id="scriptTask" transform="translate(2,2)">
   <path
   oryx:anchors="top left"
    xmlns="http://www.w3.org/2000/svg" fill="${lan}" d="M7.95,0c2.25,0,4.07,1.79,4.07,4c0,2.21-1.82,4-4.07,4S3.89,6.21,3.89,4S5.71,0,7.95,0z M7.95,0  c2.25,0,4.07,1.79,4.07,4c0,2.21-1.82,4-4.07,4S3.89,6.21,3.89,4S5.71,0,7.95,0z M6.43,9.33h3.39c2.9,0,5.25,2.31,5.25,5.17v0.33  c0,1.12-2.35,1.17-5.25,1.17H6.43c-2.9,0-5.25,0-5.25-1.17V14.5C1.18,11.65,3.53,9.33,6.43,9.33L6.43,9.33z" /> </g>
  
    <g id="parallel">
        <path oryx:anchors="bottom" fill="none" stroke="#bbbbbb" d="M46 70 v8 M50 70 v8 M54 70 v8" stroke-width="2" />
    </g>
    <g id="sequential">
        <path oryx:anchors="bottom" fill="none" stroke="#bbbbbb" stroke-width="2" d="M46,76h10M46,72h10 M46,68h10"/>
    </g>
    <g id="compensation">
        <path oryx:anchors="bottom" fill="none" stroke="#bbbbbb" d="M 62 74 L 66 70 L 66 78 L 62 74 L 62 70 L 58 74 L 62 78 L 62 74" stroke-width="1" />
    </g>
  </g>
</svg>`
     // var listobj=[
     //                {name:'creat1package',properties:[{"id":"creat1","name":'visible','value':false,'type':'Boolean','title':'可见','popular':true},{"id":"creat2","name":'require','value':false,'type':'Boolean','title':'可见','popular':true}]},
     //            ]
           
      //       var listobj=[
      //           {name:'厂家如1',visible:false,wirte:false,require:false,"type":"Boolean"},
      //           {name:'厂家如2',visible:false,wirte:false,require:false,"type":"Boolean"},
      //           {name:'厂家如3',visible:false,wirte:false,require:false,"type":"Boolean"},
      //           {name:'厂家如4',visible:false,wirte:false,require:false,"type":"Boolean"},
      //      ]    
      // response.data.propertyPackages.push({'name':'authorityPackage','properties':[{ "id":"可见",'value':false,"title":"可见","description":"这是用户权限",
      //                "popular":true,'type':'complex'},{ "id":"可写",'value':false,"title":"可写","description":"这是用户权限",
      //                "popular":true}]})

       // for(var i=0;i<listobj.length;i++){
       //      response.data.propertyPackages.push({'name':listobj[i].name,'properties':listobj[i].properties})
       //      response.data.stencils[6].propertyPackages.push(listobj[i].name)
       // }
       console.log(response.data.propertyPackages)
       console.log('6='+response.data.stencils[6].propertyPackages)
    // response.data.stencils[7]=response.data.stencils[6]
    // "id":"documentation",


     response.data.stencils[6].title='经办节点'

     response.data.stencils[7].title='审批节点'
     response.data.stencils[7].view=svgStr1
     response.data.stencils[7].propertyPackages=response.data.stencils[6].propertyPackages;
 
     response.data.stencils[6].propertyPackages[3]='authorityPackage'
    console.log('authorityPackage')
    // response.data.stencils[8]=response.data.stencils[7]

    response.data.stencils[8].title='抄送节点'
    response.data.stencils[8].view=svgStr2 
    response.data.stencils[8].propertyPackages=response.data.stencils[6].propertyPackages;
    response.data.stencils[7].propertyPackages.push('servicetaskdelegateexpressionpackage');
    response.data.stencils[7].propertyPackages.push('servicetaskclasspackage');
    response.data.stencils[7].propertyPackages.push('multiinstance_typepackage');
    response.data.stencils[7].propertyPackages.push('servicetaskexpressionpackage');

     response.data.stencils[8].propertyPackages.push('servicetaskdelegateexpressionpackage');
    response.data.stencils[8].propertyPackages.push('servicetaskclasspackage');
    response.data.stencils[8].propertyPackages.push('multiinstance_typepackage');
    response.data.stencils[8].propertyPackages.push('servicetaskexpressionpackage');

       for(let i=0;i<response.data.stencils.length;i++){
            if(!response.data.stencils[i].index){
                response.data.stencils[i].index=i;
            }
       }
       for( let i=0;i< response.data.propertyPackages.length;i++ ){
           
         if(response.data.propertyPackages[i].name=='orgspackage'){
                        response.data.propertyPackages[i].properties[0].title='机构'
         }
         if(response.data.propertyPackages[i].name=='duedatedefinitionpackage'){
                        response.data.propertyPackages[i].properties[0].title='完成时间'
         }
        if(response.data.propertyPackages[i].name=='multiinstance_conditionpackage'){
                        response.data.propertyPackages[i].properties[0].title='是否签到'
                        response.data.propertyPackages[i].properties[0].type='Boolean'
         }
         if(response.data.propertyPackages[i].name=='multiinstance_cardinalitypackage'){
                        response.data.propertyPackages.splice(i,1)
                  
         }
         if(response.data.propertyPackages[i].name=='multiinstance_collectionpackage'){
                        response.data.propertyPackages.splice(i,1)
                  
         }
         if(response.data.propertyPackages[i].name=='formpropertiespackage'){
                        response.data.propertyPackages[i].properties[0].title='操作权限'
                  
         }
         if(response.data.propertyPackages[i].name=='formkeydefinitionpackage'){
                        response.data.propertyPackages.splice(i,1)
                  
         }
         if(response.data.propertyPackages[i].name=='formreferencepackage'){
                        response.data.propertyPackages.splice(i,1)
                  
         }
         if(response.data.propertyPackages[i].name=='executionlistenerspackage'){
                        response.data.propertyPackages.splice(i,1)
                  
         }
          if(response.data.propertyPackages[i].name=='tasklistenerspackage'){
                        response.data.propertyPackages.splice(i,1)
                  
         }
          if(response.data.propertyPackages[i].name=='skipexpressionpackage'){
                        response.data.propertyPackages.splice(i,1)
                  
         }
         // if(response.data.propertyPackages[i].name=='multiinstance_typepackage'){
         //                response.data.propertyPackages.splice(i,1)
                 
         // }
         // if(response.data.propertyPackages[i].name=='multiinstance_variablepackage'){
         //                response.data.propertyPackages.splice(i,1)
         // }
         // if(response.data.propertyPackages[i].name=='multiinstance_variablepackage'){
         //                response.data.propertyPackages.splice(i,1)
                  
         // }
//multiinstance_cardinality 实例数
//multiinstance_collection 集合
//multiinstance_variable 成员数
//
             // if(response.data.propertyPackages.properties.title=='组织'){
             //        response.data.propertyPackages.properties.title='机构'
             // }
       }
  
 		var baseUrl = "http://b3mn.org/stencilset/";
		editorManager.setStencilData(response.data); //数据源头在这里
		//the stencilset alters the data ref!
		var stencilSet = new ORYX.Core.StencilSet.StencilSet(baseUrl, response.data);
		ORYX.Core.StencilSet.loadStencilSet(baseUrl, stencilSet, modelId);
		//after the stencilset is loaded we make sure the plugins.xml is loaded.
		return $http.get(ORYX.CONFIG.PLUGINS_CONFIG);
	}).then(function (response) {
		ORYX._loadPlugins(response.data);
		return response;
	}).then(function (response) {
		editorManager.bootEditor();
	}).catch(function (error){
		console.log(error);
	});
 
 	//minihack to make sure mousebind events are processed if the modeler is used in an iframe.
	//selecting an element and pressing "del" could sometimes not trigger an event.
	jQuery(window).focus();

}]);

angular.module('flowableModeler')
  .controller('EditorUnsavedChangesPopupCtrl', ['$rootScope', '$scope', '$http', '$location', '$window', function ($rootScope, $scope, $http, $location, $window) {

    $scope.discard = function () {
      if ($scope.handleResponseFunction) {
        $scope.handleResponseFunction(true);
        // Also clear any 'onbeforeunload', added by oryx
        $window.onbeforeunload = undefined;
      }
      $scope.$hide();
    };

    $scope.save = function () {
      if ($scope.handleResponseFunction) {
        $scope.handleResponseFunction(false);
      }
      $scope.$hide();
    };

    $scope.cancel = function () {
      if ($scope.handleResponseFunction) {
        $scope.handleResponseFunction(null);
      }
      $scope.$hide();
    };
  }]);

