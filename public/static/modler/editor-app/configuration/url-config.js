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
var FLOWABLE = FLOWABLE || {};

FLOWABLE.URL = {

    getModel: function(modelId) {
        console.log( FLOWABLE.CONFIG.contextRoot + '/app/rest/models/' + modelId + '/editor/json?version=' + Date.now())
        return FLOWABLE.CONFIG.contextRoot + '/app/rest/models/' + modelId + '/editor/json?version=' + Date.now();
    },

    getStencilSet: function() {
        console.log(FLOWABLE.CONFIG.contextRoot + '/app/rest/stencil-sets/editor?version=' + Date.now())
        return FLOWABLE.CONFIG.contextRoot + '/app/rest/stencil-sets/editor?version=' + Date.now();
    },
    
    getCmmnStencilSet: function() {
        return FLOWABLE.CONFIG.contextRoot + '/app/rest/stencil-sets/cmmneditor?version=' + Date.now();
    },

    putModel: function(modelId) {
        console.log(FLOWABLE.CONFIG.contextRoot + '/app/rest/models/' + modelId + '/editor/json')
        return FLOWABLE.CONFIG.contextRoot + '/app/rest/models/' + modelId + '/editor/json';
    },
    
    validateModel: function(){
		return FLOWABLE.CONFIG.contextRoot + '/app/rest/model/validate';
    }
};