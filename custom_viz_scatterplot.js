/**
 * This is a Custom Visualization for Looker
 *
 * It shows the first 2 dimension columns as a title and a paragraph
 *
 * CREATED BY: Egbert Schroeder
 *
 * DEPENDENCIES:
 *
 *
 * TODO:
 *
 *
 **/

const customVizScatterPlot = {
        options: {},

        /**
         * The create function gets called when the visualization is mounted but before any
         * data is passed to it.
         **/
        create: function (element, config) {
            // Insert Highcharts css file

            // Create a container element to let us center the text.
            this._vizContainer = element.appendChild(document.createElement("div"));
        },

        /**
         * UpdateAsync is the function that gets called (potentially) multiple times. It receives
         * the data and should update the visualization with the new data.
         **/
        updateAsync: function (data, element, config, queryResponse, details, doneRendering) {
            // set the dimensions and margins of the graph
            var $dimension_keys = ["name", "country", "column3"];
            var $measure_keys = ["x", "y", "z"];

            var $dataArray = [];

            // Create list of unique values from first column
            for (let i = 0; i < data.length; i++) {
                var row = data[i];
                var $rowData = {};

                for (var key in row) {
                    for (var a = 0; a < queryResponse.fields.dimension_like.length; a++) {
                        if (queryResponse.fields.dimension_like[a]["name"] == key && queryResponse.fields.dimension_like[a]["hidden"] == false) {
                            $rowData.name = LookerCharts.Utils.textForCell(row[key]);
                        }
                    }

                    for (var b = 0; b < queryResponse.fields.measure_like.length; b++) {
                        if (queryResponse.fields.measure_like[b]["name"] == key && queryResponse.fields.measure_like[b]["hidden"] == false) {
                            if (b == 0) {
                                $rowData.x = row[key].value;
                            } else if (b == 1) {
                                $rowData.y = row[key].value;
                            } else {
                                $rowData.z = row[key].value;
                            }

                        }
                    }
                }

                $dataArray.push($rowData);
            }

            console.log($dataArray);
            //console.log(data);

            var html = '<div id="scatterPlotContainer"></div>';
            // Insert the generated html into the page
            this._vizContainer.innerHTML = html;

            $(document).ready(function () {
                // Create the chart
                var chart = Highcharts.chart('scatterPlotContainer', {
                    chart: {
                        type: 'bubble',
                        zoomType: 'xy'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    xAxis: {
                        min: 0,
                        startOnTick: true,
                        endOnTick: true,
                        gridLineWidth: 1,

                        title: {
                            text: 'xAxis'
                        },
                        labels: {
                            format: '{value}'
                        }
                    },

                    yAxis: {
                        min: 0,
                        startOnTick: true,
                        endOnTick: true,
                        title: {
                            text: 'yAxis'
                        },
                        labels: {
                            format: '{value}'
                        }

                    },

                    tooltip: {
                        useHTML: true,
                        headerFormat: '<table>',
                        pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                            '<tr><th>X:</th><td>{point.x}g</td></tr>' +
                            '<tr><th>Y:</th><td>{point.y}g</td></tr>' +
                            '<tr><th>Z:</th><td>{point.z}%</td></tr>',
                        footerFormat: '</table>',
                        followPointer: true
                    },

                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            }
                        }
                    },

                    series: [{
                        data: $dataArray
                        /*[
                            {x: 95, y: 95, name: 'BE', country: 'Belgium'},
                            {x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany'},
                            {x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland'},
                            {x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands'}

                        ]*/
                    }]
                });
            });


            doneRendering()
        }
    }
;

looker.plugins.visualizations.add(customVizScatterPlot);