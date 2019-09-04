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

angular.module('flowableModeler')
  .controller('ProcessesCtrl', ['$rootScope', '$scope', '$translate', '$http', '$timeout','$location', '$modal', 
	  function ($rootScope, $scope, $translate, $http, $timeout, $location, $modal) {

      // Main page (needed for visual indicator of current page)
      $rootScope.setMainPageById('processes');
      $rootScope.formItems = undefined;

      // get latest thumbnails
      $scope.imageVersion = Date.now();

	  $scope.model = {
        filters: [
            {id: 'processes', labelKey: 'PROCESSES'}
		],

		sorts: [
		        {id: 'modifiedDesc', labelKey: 'MODIFIED-DESC'},
		        {id: 'modifiedAsc', labelKey: 'MODIFIED-ASC'},
		        {id: 'nameAsc', labelKey: 'NAME-ASC'},
		        {id: 'nameDesc', labelKey: 'NAME-DESC'}
		]
	  };

	  if ($rootScope.modelFilter) {
		  $scope.model.activeFilter = $rootScope.modelFilter.filter;
		  $scope.model.activeSort = $rootScope.modelFilter.sort;
		  $scope.model.filterText = $rootScope.modelFilter.filterText;

	  } else {
		  // By default, show first filter and use first sort
	      $scope.model.activeFilter = $scope.model.filters[0];
	      $scope.model.activeSort = $scope.model.sorts[0];
	      $rootScope.modelFilter = {
	        filter: $scope.model.activeFilter,
	        sort: $scope.model.activeSort,
	        filterText: ''
	      };
	  }

	  $scope.activateFilter = function(filter) {
		  $scope.model.activeFilter = filter;
		  $rootScope.modelFilter.filter = filter;
		  $scope.loadProcesses();
	  };

	  $scope.activateSort = function(sort) {
		  $scope.model.activeSort = sort;
		  $rootScope.modelFilter.sort = sort;
		  $scope.loadProcesses();
	  };

	  $scope.loadProcesses = function() { //加载流程
		  $scope.model.loading = true;

		  var params = {
		      filter: $scope.model.activeFilter.id,//流程的id
		      sort: $scope.model.activeSort.id,
		      modelType: 0,
		  };

		  if ($scope.model.filterText && $scope.model.filterText != '') {
		    params.filterText = $scope.model.filterText;
		  }

		  $http({method: 'GET', url: FLOWABLE.APP_URL.getModelsUrl(), params: params}).
		  	success(function(data, status, headers, config) {
          //console.log(params) {filter: "processes", sort: "modifiedDesc", modelType: 0}
	    		$scope.model.processes = data;  //data是刚打开页面时候所有的流程数据
	    		$scope.model.loading = false;

	        }).
	        error(function(data, status, headers, config) {
	           console.log('Something went wrong: ' + JSON.stringify(data));
	           $scope.model.loading = false;
	        });
	  };

	  var timeoutFilter = function(){
	      $scope.model.isFilterDelayed = true;
	      $timeout(function() {
	          $scope.model.isFilterDelayed = false;
	          if ($scope.model.isFilterUpdated) {
	              $scope.model.isFilterUpdated = false;
	              timeoutFilter();
	          } else {
	              $scope.model.filterText = $scope.model.pendingFilterText;
	              $rootScope.modelFilter.filterText = $scope.model.filterText;
	              $scope.loadProcesses();
	          }
	      }, 500);
	  };

	  $scope.filterDelayed = function() {
	      if ($scope.model.isFilterDelayed) {
	          $scope.model.isFilterUpdated = true;
	      } else {
	          timeoutFilter();
	      }
	  };

	  $scope.createProcess = function(mode) { //创建新的流程图时候执行
      flag66=0;
       localStorage.clear();
     
	    var modalInstance = _internalCreateModal({
	        template: 'views/popup/process-create.html?version=' + Date.now()
	    }, $modal, $scope);
	  };

	  $scope.importProcess = function () { //导入新的流程图时候执行
      flag66=0;
          _internalCreateModal({
              template: 'views/popup/process-import.html?version=' + Date.now()
          }, $modal, $scope);
	  };

	  $scope.showProcessDetails = function(process) {
	      if (process) {  //流程的详细信息 {id: "59091124-a85a-11e9-90c3-72907479d58e", name: "leaveprocess", key: "leaveprocess", description: "", createdBy: "admin", …}comment: nullcreatedBy: "admin"description: ""id: "59091124-a85a-11e9-90c3-72907479d58e"key: "leaveprocess"lastUpdated: 1563344212110lastUpdatedBy: "admin"latestVersion: truemodelType: 0name: "leaveprocess"tenantId: nullversion: 1__proto__: Object
	          $rootScope.editorHistory = [];
	          $location.path("/processes/" + process.id);
            console.log(process)
	      }
	  };

	  $scope.editProcessDetails = function(process) {
       // 获取count值

     // {id: "edf5a926-b1d9-11e9-a4f5-0e0b7ec70eea", name: "sdgf", key: "234", description: "", createdBy: "admin", …}
		  if (process) { 
		      $rootScope.editorHistory = [];
          $location.path("/editor/" + process.id);
console.log(process.id)
            //      jQuery.ajax({ 
            //     type: "GET",
            //     contentType:"application/json;charset=utf-8",
            //     url: `/modler/proc_model/proc_node_num?proc_model_id=${process.id}`,
            //     dataType:'json',
            //     success:function(result){              
            //        localStorage.setItem('count',result.obj)
            //        
            //     },
            //     error:function(err){
            //          console.log('上一次未保存，这次获取上一次保存的节点数')
            //          $location.path("/editor/" + process.id);
            //     }
            // });

              

		  }
	  };

	  // Finally, load initial processes
	  $scope.loadProcesses(); //初始化时候加载所有
  }]);

angular.module('flowableModeler')
.controller('CreateNewProcessModelCtrl', ['$rootScope', '$scope', '$modal', '$http', '$location',
                                          function ($rootScope, $scope, $modal, $http, $location) {

    $scope.model = {
       loading: false,
       process: {
            name: '',
            key: '',
            description: '',
           	modelType: 0
       }
    };

    if ($scope.initialModelType !== undefined) {
        $scope.model.process.modelType = $scope.initialModelType;
    }

    $scope.ok = function () {

        if (!$scope.model.process.name || $scope.model.process.name.length == 0 ||
        	!$scope.model.process.key || $scope.model.process.key.length == 0) {
        	
            return;
        }

        $scope.model.loading = true;

        $http({method: 'POST', url: FLOWABLE.APP_URL.getModelsUrl(), data: $scope.model.process}).
            success(function(data) {
                $scope.$hide();

                $scope.model.loading = false;
                $rootScope.editorHistory = [];
                $location.path("/editor/" + data.id);
            }).
            error(function(data, status, headers, config) {
                $scope.model.loading = false;
                $scope.model.errorMessage = data.message;
            });
    };

    $scope.cancel = function () {
        if(!$scope.model.loading) {
            $scope.$hide();
        }
    };
}]);

angular.module('flowableModeler')
.controller('DuplicateProcessModelCtrl', ['$rootScope', '$scope', '$modal', '$http', '$location',
                                          function ($rootScope, $scope, $modal, $http, $location) {

    $scope.model = {
       loading: false,
       process: {
            name: '',
            key: '',
            description: ''
       }
    };

    if ($scope.originalModel) {
        //clone the model
        $scope.model.process.name = $scope.originalModel.process.name;
        $scope.model.process.key = $scope.originalModel.process.key;
        $scope.model.process.description = $scope.originalModel.process.description;
        $scope.model.process.id = $scope.originalModel.process.id;
        $scope.model.process.modelType = $scope.originalModel.process.modelType;
    }

    $scope.ok = function () {
        if (!$scope.model.process.name || $scope.model.process.name.length == 0 || 
        	!$scope.model.process.key || $scope.model.process.key.length == 0) {
        	
            return;
        }

        $scope.model.loading = true;

        $http({method: 'POST', url: FLOWABLE.APP_URL.getCloneModelsUrl($scope.model.process.id), data: $scope.model.process}).
            success(function(data) {
                $scope.$hide();
                $scope.model.loading = false;
                $rootScope.editorHistory = [];
                $location.path("/editor/" + data.id);
            }).
            error(function(data, status, headers, config) {
                $scope.model.loading = false;
                $scope.model.errorMessage = data.message;
            });
    };

    $scope.cancel = function () {
        if(!$scope.model.loading) {
            $scope.$hide();
        }
    };
}]);

angular.module('flowableModeler')
.controller('ImportProcessModelCtrl', ['$rootScope', '$scope', '$http', 'Upload', '$location', function ($rootScope, $scope, $http, Upload, $location) {

  $scope.model = {
       loading: false
  };

  $scope.onFileSelect = function($files, isIE) {
 
      $scope.model.loading = true;

      for (var i = 0; i < $files.length; i++) {
          var file = $files[i];

          var url;
          if (isIE) {
              url = FLOWABLE.APP_URL.getImportProcessModelTextUrl();
          } else {
              url = FLOWABLE.APP_URL.getImportProcessModelUrl();
          }

          Upload.upload({
              url: url,
              method: 'POST',
              file: file
          }).progress(function(evt) {
              $scope.model.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);

          }).success(function(data) {
              $scope.model.loading = false;

              $location.path("/editor/" + data.id);
              $scope.$hide();

          }).error(function(data) {

              if (data && data.message) {
                  $scope.model.errorMessage = data.message;
              }

              $scope.model.error = true;
              $scope.model.loading = false;
          });
      }
  };

  $scope.cancel = function () {
	  if(!$scope.model.loading) {
		  $scope.$hide();
	  }
  };
}]);
