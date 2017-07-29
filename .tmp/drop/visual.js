/*
 *  Power BI Visualizations
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
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
                var DataViewTransform;
                (function (DataViewTransform) {
                    // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
                    function createValueColumns(values, valueIdentityFields, source) {
                        if (values === void 0) { values = []; }
                        var result = values;
                        setGrouped(result);
                        if (valueIdentityFields) {
                            result.identityFields = valueIdentityFields;
                        }
                        if (source) {
                            result.source = source;
                        }
                        return result;
                    }
                    DataViewTransform.createValueColumns = createValueColumns;
                    function setGrouped(values, groupedResult) {
                        values.grouped = groupedResult
                            ? function () { return groupedResult; }
                            : function () { return groupValues(values); };
                    }
                    DataViewTransform.setGrouped = setGrouped;
                    /** Group together the values with a common identity. */
                    function groupValues(values) {
                        var groups = [], currentGroup;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var value = values[i];
                            if (!currentGroup || currentGroup.identity !== value.identity) {
                                currentGroup = {
                                    values: []
                                };
                                if (value.identity) {
                                    currentGroup.identity = value.identity;
                                    var source = value.source;
                                    // allow null, which will be formatted as (Blank).
                                    if (source.groupName !== undefined) {
                                        currentGroup.name = source.groupName;
                                    }
                                    else if (source.displayName) {
                                        currentGroup.name = source.displayName;
                                    }
                                }
                                groups.push(currentGroup);
                            }
                            currentGroup.values.push(value);
                        }
                        return groups;
                    }
                    DataViewTransform.groupValues = groupValues;
                })(DataViewTransform = dataview.DataViewTransform || (dataview.DataViewTransform = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataRoleHelper;
                (function (DataRoleHelper) {
                    function getMeasureIndexOfRole(grouped, roleName) {
                        if (!grouped || !grouped.length) {
                            return -1;
                        }
                        var firstGroup = grouped[0];
                        if (firstGroup.values && firstGroup.values.length > 0) {
                            for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                                var value = firstGroup.values[i];
                                if (value && value.source) {
                                    if (hasRole(value.source, roleName)) {
                                        return i;
                                    }
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole;
                    function getCategoryIndexOfRole(categories, roleName) {
                        if (categories && categories.length) {
                            for (var i = 0, ilen = categories.length; i < ilen; i++) {
                                if (hasRole(categories[i].source, roleName)) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole;
                    function hasRole(column, name) {
                        var roles = column.roles;
                        return roles && roles[name];
                    }
                    DataRoleHelper.hasRole = hasRole;
                    function hasRoleInDataView(dataView, name) {
                        return dataView != null
                            && dataView.metadata != null
                            && dataView.metadata.columns
                            && dataView.metadata.columns.some(function (c) { return c.roles && c.roles[name] !== undefined; }); // any is an alias of some
                    }
                    DataRoleHelper.hasRoleInDataView = hasRoleInDataView;
                    function hasRoleInValueColumn(valueColumn, name) {
                        return valueColumn
                            && valueColumn.source
                            && valueColumn.source.roles
                            && (valueColumn.source.roles[name] === true);
                    }
                    DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
                })(DataRoleHelper = dataview.DataRoleHelper || (dataview.DataRoleHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObject;
                (function (DataViewObject) {
                    function getValue(object, propertyName, defaultValue) {
                        if (!object) {
                            return defaultValue;
                        }
                        var propertyValue = object[propertyName];
                        if (propertyValue === undefined) {
                            return defaultValue;
                        }
                        return propertyValue;
                    }
                    DataViewObject.getValue = getValue;
                    /** Gets the solid color from a fill property using only a propertyName */
                    function getFillColorByPropertyName(object, propertyName, defaultColor) {
                        var value = getValue(object, propertyName);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
                })(DataViewObject = dataview.DataViewObject || (dataview.DataViewObject = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjects;
                (function (DataViewObjects) {
                    /** Gets the value of the given object/property pair. */
                    function getValue(objects, propertyId, defaultValue) {
                        if (!objects) {
                            return defaultValue;
                        }
                        return dataview.DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
                    }
                    DataViewObjects.getValue = getValue;
                    /** Gets an object from objects. */
                    function getObject(objects, objectName, defaultValue) {
                        if (objects && objects[objectName]) {
                            return objects[objectName];
                        }
                        return defaultValue;
                    }
                    DataViewObjects.getObject = getObject;
                    /** Gets the solid color from a fill property. */
                    function getFillColor(objects, propertyId, defaultColor) {
                        var value = getValue(objects, propertyId);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObjects.getFillColor = getFillColor;
                    function getCommonValue(objects, propertyId, defaultValue) {
                        var value = getValue(objects, propertyId, defaultValue);
                        if (value && value.solid) {
                            return value.solid.color;
                        }
                        if (value === undefined
                            || value === null
                            || (typeof value === "object" && !value.solid)) {
                            return defaultValue;
                        }
                        return value;
                    }
                    DataViewObjects.getCommonValue = getCommonValue;
                })(DataViewObjects = dataview.DataViewObjects || (dataview.DataViewObjects = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // powerbi.extensibility.utils.dataview
                var DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
                var converterHelper;
                (function (converterHelper) {
                    function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
                        if (dataView.categories && dataView.categories.length > 0) {
                            // Need to pivot data if our category soure is a series role
                            var category = dataView.categories[0];
                            return category.source &&
                                DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                                DataRoleHelper.hasRole(category.source, categoryRoleName);
                        }
                        return false;
                    }
                    converterHelper.categoryIsAlsoSeriesRole = categoryIsAlsoSeriesRole;
                    function getSeriesName(source) {
                        return (source.groupName !== undefined)
                            ? source.groupName
                            : source.queryName;
                    }
                    converterHelper.getSeriesName = getSeriesName;
                    function isImageUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.imageUrl === true;
                    }
                    converterHelper.isImageUrlColumn = isImageUrlColumn;
                    function isWebUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.webUrl === true;
                    }
                    converterHelper.isWebUrlColumn = isWebUrlColumn;
                    function getMiscellaneousTypeDescriptor(column) {
                        return column
                            && column.type
                            && column.type.misc;
                    }
                    converterHelper.getMiscellaneousTypeDescriptor = getMiscellaneousTypeDescriptor;
                    function hasImageUrlColumn(dataView) {
                        if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
                            return false;
                        }
                        return dataView.metadata.columns.some(function (column) { return isImageUrlColumn(column) === true; });
                    }
                    converterHelper.hasImageUrlColumn = hasImageUrlColumn;
                })(converterHelper = dataview.converterHelper || (dataview.converterHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjectsParser = (function () {
                    function DataViewObjectsParser() {
                    }
                    DataViewObjectsParser.getDefault = function () {
                        return new this();
                    };
                    DataViewObjectsParser.createPropertyIdentifier = function (objectName, propertyName) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    };
                    DataViewObjectsParser.parse = function (dataView) {
                        var dataViewObjectParser = this.getDefault(), properties;
                        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                            return dataViewObjectParser;
                        }
                        properties = dataViewObjectParser.getProperties();
                        for (var objectName in properties) {
                            for (var propertyName in properties[objectName]) {
                                var defaultValue = dataViewObjectParser[objectName][propertyName];
                                dataViewObjectParser[objectName][propertyName] = dataview.DataViewObjects.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
                            }
                        }
                        return dataViewObjectParser;
                    };
                    DataViewObjectsParser.isPropertyEnumerable = function (propertyName) {
                        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
                    };
                    DataViewObjectsParser.enumerateObjectInstances = function (dataViewObjectParser, options) {
                        var dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
                        if (!dataViewProperties) {
                            return [];
                        }
                        var instance = {
                            objectName: options.objectName,
                            selector: null,
                            properties: {}
                        };
                        for (var key in dataViewProperties) {
                            if (dataViewProperties.hasOwnProperty(key)) {
                                instance.properties[key] = dataViewProperties[key];
                            }
                        }
                        return {
                            instances: [instance]
                        };
                    };
                    DataViewObjectsParser.prototype.getProperties = function () {
                        var _this = this;
                        var properties = {}, objectNames = Object.keys(this);
                        objectNames.forEach(function (objectName) {
                            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                var propertyNames = Object.keys(_this[objectName]);
                                properties[objectName] = {};
                                propertyNames.forEach(function (propertyName) {
                                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                        properties[objectName][propertyName] =
                                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                                    }
                                });
                            }
                        });
                        return properties;
                    };
                    return DataViewObjectsParser;
                }());
                DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
                dataview.DataViewObjectsParser = DataViewObjectsParser;
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var rHTMLnew95480AC55B814FBCB378FA548F2C97AD;
            (function (rHTMLnew95480AC55B814FBCB378FA548F2C97AD) {
                "use strict";
                var injectorCounter = 0;
                function ResetInjector() {
                    injectorCounter = 0;
                }
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.ResetInjector = ResetInjector;
                function injectorReady() {
                    return injectorCounter === 0;
                }
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.injectorReady = injectorReady;
                function ParseElement(el, target) {
                    var arr = [];
                    if (!el || !el.hasChildNodes()) {
                        return;
                    }
                    var nodes = el.children;
                    for (var i = 0; i < nodes.length; i++) {
                        var tempNode = void 0;
                        if (nodes.item(i).nodeName.toLowerCase() === "script") {
                            tempNode = createScriptNode(nodes.item(i));
                        }
                        else {
                            tempNode = nodes.item(i).cloneNode(true);
                        }
                        target.appendChild(tempNode);
                        arr.push(tempNode);
                    }
                    return arr;
                }
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.ParseElement = ParseElement;
                function createScriptNode(refNode) {
                    var script = document.createElement("script");
                    var attr = refNode.attributes;
                    for (var i = 0; i < attr.length; i++) {
                        script.setAttribute(attr[i].name, attr[i].textContent);
                        if (attr[i].name.toLowerCase() === "src") {
                            // waiting only for src to finish loading - async opetation
                            injectorCounter++;
                            script.onload = function () {
                                injectorCounter--;
                            };
                        }
                    }
                    script.innerHTML = refNode.innerHTML;
                    return script;
                }
                function RunHTMLWidgetRenderer() {
                    // rendering HTML which was created by HTMLWidgets package
                    // wait till all tje script elements are loaded
                    var intervalVar = window.setInterval(function () {
                        if (injectorReady()) {
                            window.clearInterval(intervalVar);
                            if (window.hasOwnProperty("HTMLWidgets") && window["HTMLWidgets"].staticRender) {
                                window["HTMLWidgets"].staticRender();
                            }
                        }
                    }, 100);
                }
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.RunHTMLWidgetRenderer = RunHTMLWidgetRenderer;
            })(rHTMLnew95480AC55B814FBCB378FA548F2C97AD = visual.rHTMLnew95480AC55B814FBCB378FA548F2C97AD || (visual.rHTMLnew95480AC55B814FBCB378FA548F2C97AD = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var rHTMLnew95480AC55B814FBCB378FA548F2C97AD;
            (function (rHTMLnew95480AC55B814FBCB378FA548F2C97AD) {
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
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue = getValue;
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
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValueMinMax = getValueMinMax;
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
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValueNumberMinMax = getValueNumberMinMax;
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
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.ifStringReturnString = ifStringReturnString;
                function ifStringReturnStringClustersMethod(numClustersMethods, numOfClusters) {
                    if (numOfClusters != "auto")
                        return "None";
                    if (numOfClusters == "auto" && numClustersMethods == "None")
                        return "fast";
                    return numClustersMethods;
                }
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.ifStringReturnStringClustersMethod = ifStringReturnStringClustersMethod;
                function inMinMax(a, mi, ma) {
                    if (a < mi)
                        return mi;
                    if (a > ma)
                        return ma;
                    return a;
                }
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.inMinMax = inMinMax;
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
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getCategoricalObjectValue = getCategoricalObjectValue;
            })(rHTMLnew95480AC55B814FBCB378FA548F2C97AD = visual.rHTMLnew95480AC55B814FBCB378FA548F2C97AD || (visual.rHTMLnew95480AC55B814FBCB378FA548F2C97AD = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
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
            var rHTMLnew95480AC55B814FBCB378FA548F2C97AD;
            (function (rHTMLnew95480AC55B814FBCB378FA548F2C97AD) {
                "use strict";
                var DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
                var VisualSettings = (function (_super) {
                    __extends(VisualSettings, _super);
                    function VisualSettings() {
                        var _this = _super !== null && _super.apply(this, arguments) || this;
                        _this.rcv_script = new rcv_scriptSettings();
                        return _this;
                    }
                    return VisualSettings;
                }(DataViewObjectsParser));
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.VisualSettings = VisualSettings;
                var rcv_scriptSettings = (function () {
                    function rcv_scriptSettings() {
                    }
                    return rcv_scriptSettings;
                }());
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.rcv_scriptSettings = rcv_scriptSettings;
            })(rHTMLnew95480AC55B814FBCB378FA548F2C97AD = visual.rHTMLnew95480AC55B814FBCB378FA548F2C97AD || (visual.rHTMLnew95480AC55B814FBCB378FA548F2C97AD = {}));
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
            var rHTMLnew95480AC55B814FBCB378FA548F2C97AD;
            (function (rHTMLnew95480AC55B814FBCB378FA548F2C97AD) {
                "use strict";
                // below is a snippet of a definition for an object which will contain the property values
                // selected by the users
                /*interface VisualSettings {
                    lineColor: string;
                }*/
                // to allow this scenario you should first the following JSON definition to the capabilities.json file
                // under the "objects" property:
                // "settings": {
                //     "displayName": "Visual Settings",
                //     "description": "Visual Settings Tooltip",
                //     "properties": {
                //         "lineColor": {
                //         "displayName": "Line Color",
                //         "type": { "fill": { "solid": { "color": true }}}
                //         }
                //     }
                // }
                // in order to improve the performance, one can update the <head> only in the initial rendering.
                // set to 'true' if you are using different packages to create the widgets
                var updateHTMLHead = false;
                var renderVisualUpdateType = [
                    powerbi.VisualUpdateType.Resize,
                    powerbi.VisualUpdateType.ResizeEnd,
                    powerbi.VisualUpdateType.Resize + powerbi.VisualUpdateType.ResizeEnd
                ];
                // USER - (END)
                var Visual = (function () {
                    // USER - (END)
                    function Visual(options) {
                        if (options && options.element) {
                            this.rootElement = options.element;
                        }
                        this.headNodes = [];
                        this.bodyNodes = [];
                        // USER 
                        this.settings_forecastPlot_params = {
                            forecastLength: 500,
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
                            showInPlotFitted: false,
                        };
                        this.settings_additional_params = {
                            valuesNonNegative: false,
                            algModeFast: false,
                            useParProc: false
                        };
                        this.settings_info_params = {
                            textSize: 10,
                            infoTextCol: "gray50",
                            numDigitsInfo: "0",
                            whichInfo: "none"
                        };
                        this.settings_axes_params = {
                            showScientificY: false,
                            textSize: 12,
                            labelsTextCol: "black",
                            userFormatX: "auto"
                        };
                        // USER - (END)
                    }
                    Visual.prototype.update = function (options) {
                        if (!options ||
                            !options.type ||
                            !options.viewport ||
                            !options.dataViews ||
                            options.dataViews.length === 0 ||
                            !options.dataViews[0]) {
                            return;
                        }
                        var dataView = options.dataViews[0];
                        this.settings = Visual.parseSettings(dataView);
                        // USER 
                        this.updateObjects(dataView.metadata.objects);
                        // USER - (END)
                        var payloadBase64 = null;
                        if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                            payloadBase64 = dataView.scriptResult.payloadBase64;
                        }
                        if (renderVisualUpdateType.indexOf(options.type) === -1) {
                            if (payloadBase64) {
                                this.injectCodeFromPayload(payloadBase64);
                            }
                        }
                        else {
                            this.onResizing(options.viewport);
                        }
                    };
                    Visual.prototype.onResizing = function (finalViewport) {
                        /* add code to handle resizing of the view port */
                    };
                    Visual.prototype.injectCodeFromPayload = function (payloadBase64) {
                        // inject HTML from payload, created in R
                        // the code is injected to the 'head' and 'body' sections.
                        // if the visual was already rendered, the previous DOM elements are cleared
                        rHTMLnew95480AC55B814FBCB378FA548F2C97AD.ResetInjector();
                        if (!payloadBase64) {
                            return;
                        }
                        // create 'virtual' HTML, so parsing is easier
                        var el = document.createElement("html");
                        try {
                            el.innerHTML = window.atob(payloadBase64);
                        }
                        catch (err) {
                            return;
                        }
                        // if 'updateHTMLHead == false', then the code updates the header data only on the 1st rendering
                        // this option allows loading and parsing of large and recurring scripts only once.
                        if (updateHTMLHead || this.headNodes.length === 0) {
                            while (this.headNodes.length > 0) {
                                var tempNode = this.headNodes.pop();
                                document.head.removeChild(tempNode);
                            }
                            var headList = el.getElementsByTagName("head");
                            if (headList && headList.length > 0) {
                                var head = headList[0];
                                this.headNodes = rHTMLnew95480AC55B814FBCB378FA548F2C97AD.ParseElement(head, document.head);
                            }
                        }
                        // update 'body' nodes, under the rootElement
                        while (this.bodyNodes.length > 0) {
                            var tempNode = this.bodyNodes.pop();
                            this.rootElement.removeChild(tempNode);
                        }
                        var bodyList = el.getElementsByTagName("body");
                        if (bodyList && bodyList.length > 0) {
                            var body = bodyList[0];
                            this.bodyNodes = rHTMLnew95480AC55B814FBCB378FA548F2C97AD.ParseElement(body, this.rootElement);
                        }
                        rHTMLnew95480AC55B814FBCB378FA548F2C97AD.RunHTMLWidgetRenderer();
                    };
                    Visual.parseSettings = function (dataView) {
                        return rHTMLnew95480AC55B814FBCB378FA548F2C97AD.VisualSettings.parse(dataView);
                    };
                    //RVIZ_IN_PBI_GUIDE:BEGIN:Added to create HTML-based 
                    /**
                     * This function gets called by the update function above. You should read the new values of the properties into
                     * your settings object so you can use the new value in the enumerateObjectInstances function below.
                     *
                     * Below is a code snippet demonstrating how to expose a single property called "lineColor" from the object called "settings"
                     * This object and property should be first defined in the capabilities.json file in the objects section.
                     * In this code we get the property value from the objects (and have a default value in case the property is undefined)
                     */
                    Visual.prototype.updateObjects = function (objects) {
                        this.settings_forecastPlot_params = {
                            forecastLength: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_forecastPlot_params', 'forecastLength', 500),
                            freq1: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_forecastPlot_params', 'freq1', 1),
                            freq2: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_forecastPlot_params', 'freq2', 1)
                        };
                        this.settings_conf_params = {
                            confInterval1: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_conf_params', 'confInterval1', "0.5"),
                            confInterval2: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_conf_params', 'confInterval2', "0.995"),
                        };
                        this.settings_graph_params = {
                            dataCol: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_graph_params', 'dataCol', "orange"),
                            forecastCol: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_graph_params', 'forecastCol', "red"),
                            fittedCol: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_graph_params', 'fittedCol', "green"),
                            percentile: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_graph_params', 'percentile', 40),
                            weight: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_graph_params', 'weight', 10),
                            showFromTo: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_graph_params', 'showFromTo', "all"),
                            refPointShift: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_graph_params', 'refPointShift', 0),
                            showInPlotFitted: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_graph_params', 'showInPlotFitted', false),
                        };
                        this.settings_additional_params = {
                            algModeFast: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_additional_params', 'algModeFast', false),
                            valuesNonNegative: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_additional_params', 'valuesNonNegative', false),
                            useParProc: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_additional_params', 'useParProc', false)
                        };
                        this.settings_info_params = {
                            textSize: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_info_params', 'textSize', 10),
                            infoTextCol: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_info_params', 'infoTextCol', "gray50"),
                            numDigitsInfo: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_info_params', 'numDigitsInfo', "0"),
                            whichInfo: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_info_params', 'whichInfo', "none"),
                        };
                        this.settings_axes_params = {
                            showScientificY: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_axes_params', 'showScientificY', false),
                            textSize: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_axes_params', 'textSize', 12),
                            labelsTextCol: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_axes_params', 'labelsTextCol', "black"),
                            userFormatX: rHTMLnew95480AC55B814FBCB378FA548F2C97AD.getValue(objects, 'settings_axes_params', 'userFormatX', "auto")
                        };
                    };
                    //RVIZ_IN_PBI_GUIDE:END:Added to create HTML-based 
                    /**
                     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
                     * objects and properties you want to expose to the users in the property pane.
                     *
                     */
                    Visual.prototype.enumerateObjectInstances = function (options) {
                        var objectName = options.objectName;
                        var objectEnumeration = [];
                        switch (objectName) {
                            case 'settings_forecastPlot_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        forecastLength: Math.round(rHTMLnew95480AC55B814FBCB378FA548F2C97AD.inMinMax(this.settings_forecastPlot_params.forecastLength, 1, 1000000)),
                                        freq1: Math.round(rHTMLnew95480AC55B814FBCB378FA548F2C97AD.inMinMax(this.settings_forecastPlot_params.freq1, 1, 1000000)),
                                        freq2: Math.round(rHTMLnew95480AC55B814FBCB378FA548F2C97AD.inMinMax(this.settings_forecastPlot_params.freq2, 1, 1000000))
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
                                        percentile: this.settings_graph_params.percentile,
                                        weight: this.settings_graph_params.weight,
                                        dataCol: this.settings_graph_params.dataCol,
                                        forecastCol: this.settings_graph_params.forecastCol,
                                        showInPlotFitted: this.settings_graph_params.showInPlotFitted
                                    }
                                });
                                if (this.settings_graph_params.showInPlotFitted) {
                                    objectEnumeration.push({
                                        objectName: objectName,
                                        properties: {
                                            fittedCol: this.settings_graph_params.fittedCol,
                                        }
                                    });
                                }
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        showFromTo: this.settings_graph_params.showFromTo,
                                    }
                                });
                                if (this.settings_graph_params.showFromTo != "all") {
                                    objectEnumeration.push({
                                        objectName: objectName,
                                        properties: {
                                            refPointShift: this.settings_graph_params.refPointShift //conditioned
                                        },
                                        selector: null
                                    });
                                }
                                break;
                            case 'settings_additional_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        valuesNonNegative: this.settings_additional_params.valuesNonNegative,
                                        algModeFast: this.settings_additional_params.algModeFast,
                                        useParProc: this.settings_additional_params.useParProc
                                    },
                                    selector: null
                                });
                                break;
                            case 'settings_info_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        whichInfo: this.settings_info_params.whichInfo,
                                        textSize: this.settings_info_params.textSize,
                                        infoTextCol: this.settings_info_params.infoTextCol,
                                        numDigitsInfo: this.settings_info_params.numDigitsInfo
                                    },
                                    selector: null
                                });
                                break;
                            case 'settings_axes_params':
                                objectEnumeration.push({
                                    objectName: objectName,
                                    properties: {
                                        labelsTextCol: this.settings_axes_params.labelsTextCol,
                                        textSize: this.settings_axes_params.textSize,
                                        userFormatX: this.settings_axes_params.userFormatX,
                                        showScientificY: this.settings_axes_params.showScientificY
                                    },
                                    selector: null
                                });
                                break;
                        }
                        ;
                        return objectEnumeration;
                        // return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
                    };
                    return Visual;
                }());
                rHTMLnew95480AC55B814FBCB378FA548F2C97AD.Visual = Visual;
            })(rHTMLnew95480AC55B814FBCB378FA548F2C97AD = visual.rHTMLnew95480AC55B814FBCB378FA548F2C97AD || (visual.rHTMLnew95480AC55B814FBCB378FA548F2C97AD = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.rHTMLnew95480AC55B814FBCB378FA548F2C97AD = {
                name: 'rHTMLnew95480AC55B814FBCB378FA548F2C97AD',
                displayName: 'RHTMLnew',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.7.0',
                create: function (options) { return new powerbi.extensibility.visual.rHTMLnew95480AC55B814FBCB378FA548F2C97AD.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map