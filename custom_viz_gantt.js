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

const customVizGanttChart = {
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
            var $first_column_key = Object.keys(data[0])[0];
            var $second_column_key = Object.keys(data[0])[1];
            var $third_column_key = Object.keys(data[0])[2];
            var $fourth_column_key = Object.keys(data[0])[3];
            var $first_column_values = [];
            var $seriesObject = [];
            var $catCounter = 0;

            // Create list of unique values from first column
            for (var x = 0; x < data.length; x++) {
                var row = data[x];
                $first_column_values.push(row[$first_column_key].value);
            }

            var $categories = [...new Set($first_column_values)];

            //console.log($categories);
            $categories.forEach(function (category) {
                var $categoryData = [];
                var $rowCounter = 0;
                data.forEach(function (row) {
                    if (row[$first_column_key].value === category) {
                        $categoryData[$rowCounter] = {
                            'name': row[$second_column_key].value,
                            'start': Date.UTC(2019, 11, 1),
                            'end': Date.UTC(2019, 12, 31),
                            'y': $catCounter
                        };
                        $rowCounter++;
                    }
                });

                $seriesObject[$catCounter] = {'name': category, 'data': $categoryData};
                $catCounter++;
            });

            // console.log($seriesObject);
            var html = '<div id="ganttContainer"></div>';
            // Insert the generated html into the page
            this._vizContainer.innerHTML = html;

            $(document).ready(function () {
                // Create the chart
                var chart = Highcharts.ganttChart('ganttContainer', {

                    chart: {
                        spacingLeft: 1
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    plotOptions: {
                        series: {
                            animation: false, // Do not animate dependency connectors
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}',
                                style: {
                                    cursor: 'default',
                                    color: 'red',
                                    border: false,
                                    pointerEvents: 'none',
                                }
                            },
                            allowPointSelect: true,
                        }
                    },
                    yAxis: {
                        type: 'category',
                        categories: ['Metingen', 'Campagnes', 'Vakanties'],
                        min: 0,
                        max: 2
                    },
                    xAxis: {
                        currentDateIndicator: true
                    },
                    tooltip: {
                        xDateFormat: '%a %b %d, %H:%M'
                    },
                    series: $seriesObject
                });
            });

            doneRendering()
        }
    }
;

looker.plugins.visualizations.add(customVizGanttChart);