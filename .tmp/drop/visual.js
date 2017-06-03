var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS;
            (function (PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS) {
                /**
                 * Gets property value for a particular object.
                 *
                 * @function
                 * @param {DataViewObjects} objects - Map of defined objects.
                 * @param {string} objectName       - Name of desired object.
                 * @param {string} propertyName     - Name of desired property.
                 * @param {T} defaultValue          - Default value of desired property.
                 */
                function getValue(objects, objectName, propertyName, defaultValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property !== undefined) {
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue = getValue;
                /**
                 * Gets property value for a particular object.
                 *
                 * @function
                 * @param {DataViewObjects} objects - Map of defined objects.
                 * @param {string} objectName       - Name of desired object.
                 * @param {string} propertyName     - Name of desired property.
                 * @param {T} defaultValue          - Default value of desired property.
                 */
                function getValueMinMax(objects, objectName, propertyName, defaultValue, minVal, maxVal) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property < minVal) {
                                return minVal;
                            }
                            if (property > maxVal) {
                                return maxVal;
                            }
                            if (property !== undefined) {
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValueMinMax = getValueMinMax;
                /**
                * Gets property value for a particular object.
                *
                * @function
                * @param {DataViewObjects} objects - Map of defined objects.
                * @param {string} objectName       - Name of desired object.
                * @param {string} propertyName     - Name of desired property.
                * @param {T} defaultValue          - Default value of desired property.
                */
                function getValueNumberMinMax(objects, objectName, propertyName, defaultValue, minValue, maxValue) {
                    if (objects) {
                        var object = objects[objectName];
                        if (object) {
                            var property = object[propertyName];
                            if (property !== undefined) {
                                if (property > maxValue) {
                                    return maxValue;
                                }
                                if (property < minValue) {
                                    return minValue;
                                }
                                return property;
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValueNumberMinMax = getValueNumberMinMax;
                /**
                     * Gets conditional property value for a particular object of type string
                     *
                     * @function
                     * @param {string} inVal     -  current value of parameter
                     * @param {string} contrVal   - control value
                     * @param {string} contrVal2Compare     - specific string to be compared with contrVal
                     * @param {boolean} logic          -  true / false "logic"
                     * @param {string} outValIfCondTrue          - output value if comparison (contrVal == contrVal2Compare) comes out as "logic"
                     */
                function ifStringReturnString(inVal, contrVal, contrVal2Compare, outValIfCondTrue, logic, applyNow) {
                    if (applyNow && contrVal == contrVal2Compare && logic == true)
                        return outValIfCondTrue;
                    if (applyNow && contrVal != contrVal2Compare && logic == false)
                        return outValIfCondTrue;
                    return inVal;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.ifStringReturnString = ifStringReturnString;
                function ifStringReturnStringClustersMethod(numClustersMethods, numOfClusters) {
                    if (numOfClusters != "auto")
                        return "None";
                    if (numOfClusters == "auto" && numClustersMethods == "None")
                        return "fast";
                    return numClustersMethods;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.ifStringReturnStringClustersMethod = ifStringReturnStringClustersMethod;
                function inMinMax(a, mi, ma) {
                    if (a < mi)
                        return mi;
                    if (a > ma)
                        return ma;
                    return a;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.inMinMax = inMinMax;
                /**
                 * Gets property value for a particular object in a category.
                 *
                 * @function
                 * @param {DataViewCategoryColumn} category - List of category objects.
                 * @param {number} index                    - Index of category object.
                 * @param {string} objectName               - Name of desired object.
                 * @param {string} propertyName             - Name of desired property.
                 * @param {T} defaultValue                  - Default value of desired property.
                 */
                function getCategoricalObjectValue(category, index, objectName, propertyName, defaultValue) {
                    var categoryObjects = category.objects;
                    if (categoryObjects) {
                        var categoryObject = categoryObjects[index];
                        if (categoryObject) {
                            var object = categoryObject[objectName];
                            if (object) {
                                var property = object[propertyName];
                                if (property !== undefined) {
                                    return property;
                                }
                            }
                        }
                    }
                    return defaultValue;
                }
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getCategoricalObjectValue = getCategoricalObjectValue;
            })(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS = visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS || (visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS;
            (function (PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS) {
                var Visual = (function () {
                    function Visual(options) {
                        this.imageDiv = document.createElement('div');
                        this.imageDiv.className = 'rcv_autoScaleImageContainer';
                        options.element.appendChild(this.imageDiv);
                        this.imageElement = document.createElement('img');
                        this.imageElement.className = 'rcv_autoScaleImage';
                        this.imageDiv.appendChild(this.imageElement);
                        this.settings_forecastPlot_params = {
                            forecastLength: 10,
                            freq1: 1,
                            freq2: 1
                        };
                        this.settings_conf_params = {
                            confInterval1: "0.5",
                            confInterval2: "0.995",
                        };
                        this.settings_graph_params = {
                            dataCol: "orange",
                            forecastCol: "red",
                            fittedCol: "green",
                            percentile: 40,
                            weight: 10,
                            showFromTo: "all",
                            refPointShift: 0,
                            showInPlotFitted: false
                        };
                        this.settings_additional_params = {
                            valuesNonNegative: false,
                            algModeFast: false
                        };
                        this.settings_info_params = {
                            textSize: 10,
                            showInfoMethodTBATS: false,
                            showInfoCumSum: false,
                            showInfoCriterion: false,
                            infoTextCol: "gray50"
                        };
                    }
                    Visual.prototype.update = function (options) {
                        var dataViews = options.dataViews;
                        if (!dataViews || dataViews.length === 0)
                            return;
                        var dataView = dataViews[0];
                        if (!dataView || !dataView.metadata)
                            return;
                        this.settings_forecastPlot_params = {
                            forecastLength: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_forecastPlot_params', 'forecastLength', 10),
                            freq1: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_forecastPlot_params', 'freq1', 1),
                            freq2: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_forecastPlot_params', 'freq2', 1)
                        };
                        this.settings_conf_params = {
                            confInterval1: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_conf_params', 'confInterval1', "0.5"),
                            confInterval2: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_conf_params', 'confInterval2', "0.995"),
                        };
                        this.settings_graph_params = {
                            dataCol: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_graph_params', 'dataCol', "orange"),
                            forecastCol: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_graph_params', 'forecastCol', "red"),
                            fittedCol: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_graph_params', 'fittedCol', "green"),
                            percentile: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_graph_params', 'percentile', 40),
                            weight: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_graph_params', 'weight', 10),
                            showFromTo: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_graph_params', 'showFromTo', "all"),
                            refPointShift: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_graph_params', 'refPointShift', 0),
                            showInPlotFitted: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_graph_params', 'showInPlotFitted', false)
                        };
                        this.settings_additional_params = {
                            algModeFast: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_additional_params', 'algModeFast', false),
                            valuesNonNegative: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_additional_params', 'valuesNonNegative', false),
                        };
                        this.settings_info_params = {
                            textSize: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_info_params', 'textSize', 10),
                            showInfoCriterion: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_info_params', 'showInfoCriterion', false),
                            showInfoCumSum: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_info_params', 'showInfoCumSum', false),
                            showInfoMethodTBATS: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_info_params', 'showInfoMethodTBATS', false),
                            infoTextCol: PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.getValue(dataView.metadata.objects, 'settings_info_params', 'infoTextCol', "gray50"),
                        };
                        var imageUrl = null;
                        if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                            imageUrl = "data:image/png;base64," + dataView.scriptResult.payloadBase64;
                        }
                        if (imageUrl) {
                            this.imageElement.src = imageUrl;
                        }
                        else {
                            this.imageElement.src = null;
                        }
                        this.onResizing(options.viewport);
                    };
                    Visual.prototype.onResizing = function (finalViewport) {
                        this.imageDiv.style.height = finalViewport.height + 'px';
                        this.imageDiv.style.width = finalViewport.width + 'px';
                    };
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        switch (objectName) {
                            case 'settings_forecastPlot_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        forecastLength: Math.round(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.inMinMax(this.settings_forecastPlot_params.forecastLength, 1, 1000000)),
                                        freq1: Math.round(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.inMinMax(this.settings_forecastPlot_params.freq1, 1, 1000000)),
                                        freq2: Math.round(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.inMinMax(this.settings_forecastPlot_params.freq2, 1, 1000000))
                                    },
                                    selector: null
                                });
                                break;
                            case 'settings_conf_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        confInterval1: this.settings_conf_params.confInterval1,
                                        confInterval2: this.settings_conf_params.confInterval2
                                    },
                                    selector: null
                                });
                                break;
                            case 'settings_graph_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        dataCol: this.settings_graph_params.dataCol,
                                        forecastCol: this.settings_graph_params.forecastCol,
                                        fittedCol: this.settings_graph_params.fittedCol,
                                        percentile: this.settings_graph_params.percentile,
                                        weight: this.settings_graph_params.weight,
                                        showFromTo: this.settings_graph_params.showFromTo,
                                        refPointShift: this.settings_graph_params.refPointShift,
                                        showInPlotFitted: this.settings_graph_params.showInPlotFitted
                                    },
                                    selector: null
                                });
                                break;
                            case 'settings_additional_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        valuesNonNegative: this.settings_additional_params.valuesNonNegative,
                                        algModeFast: this.settings_additional_params.algModeFast,
                                    },
                                    selector: null
                                });
                                break;
                            case 'settings_info_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        textSize: this.settings_info_params.textSize,
                                        infoTextCol: this.settings_info_params.infoTextCol,
                                        showInfoCriterion: this.settings_info_params.showInfoCriterion,
                                        showInfoCumSum: this.settings_info_params.showInfoCumSum,
                                        showInfoMethodTBATS: this.settings_info_params.showInfoMethodTBATS
                                    },
                                    selector: null
                                });
                                break;
                        }
                        ;
                        return objectEnumeration;
                    };
                    return Visual;
                }());
                PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.Visual = Visual;
            })(PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS = visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS || (visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS = {
                name: 'PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS',
                displayName: 'Forecasting',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.4.0',
                create: function (options) { return new powerbi.extensibility.visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_TBATS.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map