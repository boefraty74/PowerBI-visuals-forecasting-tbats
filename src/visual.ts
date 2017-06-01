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
module powerbi.extensibility.visual {

    interface VisualSettingsForecastPlotParams {
        show: boolean;
        forecastLength: number;
        freq1: number;
        freq2: number;
    }

    interface VisualSettingsConfParams {     
       confInterval1: string;
        confInterval2: string;
    }
    interface VisualGraphParams {
        show: boolean;
        dataCol: string;
        forecastCol: string;
        percentile: number;
        weight: number;
        showFromTo: string;
        showInPlotFitted: boolean;
    }
    interface VisualAdditionalParams {
        algModeFast: boolean;
        valuesNonNegative: boolean;
    }
    interface VisualInfoParams {
        showInfoMethodTBATS: boolean;
        showInfoCumSum: boolean;
        showInfoCriterion: boolean;
        textSize: number;
    }


    export class Visual implements IVisual {
        private imageDiv: HTMLDivElement;
        private imageElement: HTMLImageElement;

        private settings_forecastPlot_params: VisualSettingsForecastPlotParams;
        private settings_conf_params: VisualSettingsConfParams;
        private settings_graph_params: VisualGraphParams;
        private settings_additional_params: VisualAdditionalParams;
        private settings_info_params: VisualInfoParams;

        public constructor(options: VisualConstructorOptions) {
            this.imageDiv = document.createElement('div');
            this.imageDiv.className = 'rcv_autoScaleImageContainer';
            options.element.appendChild(this.imageDiv);

            this.imageElement = document.createElement('img');
            this.imageElement.className = 'rcv_autoScaleImage';

            this.imageDiv.appendChild(this.imageElement);

            this.settings_forecastPlot_params = <VisualSettingsForecastPlotParams>{
                forecastLength: 10,
                freq1: 1,
                freq2: 1
            };

            this.settings_conf_params = <VisualSettingsConfParams>{
                confInterval1: "0.5",
                confInterval2: "0.995",
            };

            this.settings_graph_params = <VisualGraphParams>{
               
                dataCol: "orange",
                forecastCol: "red",
                percentile: 40,
                weight: 10, 
                showFromTo: "all", 
                showInPlotFitted: false


            };

            this.settings_additional_params = <VisualAdditionalParams>{   
                valuesNonNegative: false,
                algModeFast: false
            };

            this.settings_info_params = <VisualInfoParams>{   
                textSize: 10,
                showInfoMethodTBATS: false,
                showInfoCumSum: false,
                showInfoCriterion: false
            };
        }

        public update(options: VisualUpdateOptions) {
            let dataViews: DataView[] = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            let dataView: DataView = dataViews[0];
            if (!dataView || !dataView.metadata)
                return;

            this.settings_forecastPlot_params = <VisualSettingsForecastPlotParams>{
                forecastLength: getValue<number>(dataView.metadata.objects, 'settings_forecastPlot_params', 'forecastLength', 10),
                 freq1: getValue<number>(dataView.metadata.objects, 'settings_forecastPlot_params', 'freq1', 1),
                  freq2: getValue<number>(dataView.metadata.objects, 'settings_forecastPlot_params', 'freq2', 1)
            };


            this.settings_conf_params = <VisualSettingsConfParams>{
                confInterval1: getValue<string>(dataView.metadata.objects, 'settings_conf_params', 'confInterval1', "0.5"),
                confInterval2: getValue<string>(dataView.metadata.objects, 'settings_conf_params', 'confInterval2', "0.995"),

            }
            this.settings_graph_params = <VisualGraphParams>{
                dataCol: getValue<string>(dataView.metadata.objects, 'settings_graph_params', 'dataCol', "orange"),
                forecastCol: getValue<string>(dataView.metadata.objects, 'settings_graph_params', 'forecastCol', "red"),
                percentile: getValue<number>(dataView.metadata.objects, 'settings_graph_params', 'percentile', 40),
                weight: getValue<number>(dataView.metadata.objects, 'settings_graph_params', 'weight', 10),
                 showFromTo: getValue<string>(dataView.metadata.objects, 'settings_graph_params', 'showFromTo', "all"),
                  showInPlotFitted: getValue<boolean>(dataView.metadata.objects, 'settings_graph_params', 'showInPlotFitted', false)

            }
            this.settings_additional_params = <VisualAdditionalParams>{
                algModeFast: getValue<boolean>(dataView.metadata.objects, 'settings_additional_params', 'algModeFast', false),
                valuesNonNegative: getValue<boolean>(dataView.metadata.objects, 'settings_additional_params', 'valuesNonNegative', false),
               
            }
             this.settings_info_params = <VisualInfoParams>{
               
                textSize: getValue<number>(dataView.metadata.objects, 'settings_info_params', 'textSize', 10),
                showInfoCriterion: getValue<boolean>(dataView.metadata.objects, 'settings_info_params', 'showInfoCriterion', false),
                showInfoCumSum: getValue<boolean>(dataView.metadata.objects, 'settings_info_params', 'showInfoCumSum', false),
                showInfoMethodTBATS: getValue<boolean>(dataView.metadata.objects, 'settings_info_params', 'showInfoMethodTBATS', false)
            }

            let imageUrl: string = null;
            if (dataView.scriptResult && dataView.scriptResult.payloadBase64) {
                imageUrl = "data:image/png;base64," + dataView.scriptResult.payloadBase64;
            }

            if (imageUrl) {
                this.imageElement.src = imageUrl;
            } else {
                this.imageElement.src = null;
            }

            this.onResizing(options.viewport);
        }

        public onResizing(finalViewport: IViewport): void {
            this.imageDiv.style.height = finalViewport.height + 'px';
            this.imageDiv.style.width = finalViewport.width + 'px';
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration = [];

            switch (objectName) {
                case 'settings_forecastPlot_params':
                    
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            forecastLength: Math.round(inMinMax(this.settings_forecastPlot_params.forecastLength,1,1000000)),
                             freq1: Math.round(inMinMax(this.settings_forecastPlot_params.freq1,1,1000000)),
                              freq2: Math.round(inMinMax(this.settings_forecastPlot_params.freq2,1,1000000))
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
                            percentile: this.settings_graph_params.percentile,
                            weight: this.settings_graph_params.weight,
                            showFromTo: this.settings_graph_params.showFromTo,
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
                                showInfoCriterion: this.settings_info_params.showInfoCriterion,
                                showInfoCumSum: this.settings_info_params.showInfoCumSum,
                                showInfoMethodTBATS: this.settings_info_params.showInfoMethodTBATS
                            },
                            selector: null
                        });
                   
                    break;
            };

            return objectEnumeration;
        }
    }
}