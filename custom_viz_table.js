/**
 * This is a Custom Visualization for Looker
 *
 * It's a table visualization based on Bootstrap tables
 *
 * CREATED BY: Egbert Schroeder
 *
 * DEPENDENCIES:
 *
 * https://code.jquery.com/jquery-3.3.1.slim.min.js
 * https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js
 * https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js
 *
 *
 **/

const customVizTable = {
        /**
         * Configuration options
         *
         **/

        options: {
            //
            // SERIES
            showFullFieldName: {
                default: false,
                label: "Show Full Field Name",
                order: 1,
                section: "Series",
                type: "boolean"
            },
            // PLOT
            // showRowNumbers: {
            //     default: false,
            //     label: "Show Row Numbers",
            //     order: 1,
            //     section: "Plot",
            //     type: "boolean"
            // },
            // showSearchBar: {
            //     default: false,
            //     label: "Show Search Bar",
            //     order: 2,
            //     section: "Plot",
            //     type: "boolean"
            // },
            // showPagination: {
            //     default: false,
            //     label: "Show Pagination",
            //     order: 3,
            //     section: "Plot",
            //     type: "boolean"
            // },
            showTableBorder: {
                default: true,
                label: "Show Table Border",
                order: 1,
                section: "Plot",
                type: "boolean"
            },
            stripedRows: {
                default: true,
                label: "Striped Rows",
                order: 2,
                section: "Plot",
                type: "boolean"
            },
            htmlFormatting: {
                default: true,
                label: "HTML Formatting",
                order: 3,
                section: "Plot",
                type: "boolean"
            },
            // fontSize: {
            //     default: 12,
            //     display_size: 'third',
            //     label: 'Font size',
            //     order: 6,
            //     section: 'Plot',
            //     type: 'number',
            // },

        },
        /**
         * The create function gets called when the visualization is mounted but before any
         * data is passed to it.
         **/
        create: function (element, config) {
            // Insert Bootstrap and DataTables css file
            element.innerHTML =
                '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">' +
                '<style>body{margin:0;padding:0;}</style>';

            // Create a container element to let us center the text.
            this._vizContainer = element.appendChild(document.createElement("div"));
            // this._vizContainer.className = "container-fluid";
        },

        /**
         * UpdateAsync is the function that gets called (potentially) multiple times. It receives
         * the data and should update the visualization with the new data.
         **/
        updateAsync: function (
            data,
            element,
            config,
            queryResponse,
            details,
            doneRendering
        ) {
            // Clear any errors from previous updates
            this.clearErrors();

            // Throw some errors and exit if the shape of the data isn't what this chart needs
            if (
                queryResponse.fields.dimensions.length == 0 &&
                queryResponse.fields.measures.length == 0
            ) {
                this.addError({
                    title: "No Fields",
                    message: "This chart requires at least one dimension or measure."
                });
                return;
            }
            var html = '<table class="table table-sm table-bordered">';
            for (let i = 0; i < data.length; i++) {
                var row = data[i];
                // CREATE HEADER ROW
                var headerHtml = '<tr>';
                for (var x = 0; x < queryResponse.fields.dimension_like.length; x++) {
                    if (i == 0) {
                        headerHtml += '<th>' + queryResponse.fields.dimension_like[x].label_short + '</th>';
                    }
                }

                for (var y = 0; y < queryResponse.fields.measure_like.length; y++) {
                    if (i == 0) {
                        headerHtml += '<th>' + queryResponse.fields.measure_like[y].label_short + '</th>';
                    }
                }

                for (var z = 0; z < queryResponse.fields.table_calculations.length; z++) {
                    if (i == 0) {
                        headerHtml += '<th>' + queryResponse.fields.table_calculations[z].label + '</th>';
                    }
                }
                headerHtml += '</tr>';
                html += headerHtml;

                // CREATE DATA ROWS
                var rowHtml = '<tr>';
                for (var key in row) {
                    cellHtml = '<td>' + LookerCharts.Utils.textForCell(row[key]) + '</td>';
                    rowHtml += cellHtml;
                }
                rowHtml += '</tr>';
                html += rowHtml;
            }
            html += '</table>';


            // Insert the generated html into the page
            this._vizContainer.innerHTML = html;

            $(document).ready(function () {
            });

            doneRendering();
        }
    }
;

looker.plugins.visualizations.add(customVizTable);