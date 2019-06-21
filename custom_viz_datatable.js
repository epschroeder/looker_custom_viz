/**
 * This is a Custom Visualization for Looker
 *
 * It's a table visualization based on the DataTables.js library
 *
 * CREATED BY: Egbert Schroeder
 *
 * DEPENDENCIES:
 *
 * https://code.jquery.com/jquery-3.3.1.js
 * https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js
 * https://cdn.datatables.net/1.10.19/js/dataTables.bootstrap4.min.js
 * https://cdn.datatables.net/fixedheader/3.1.4/js/dataTables.fixedHeader.min.js
 *
 * TODO:
 *
 * [x] Add Table Calculations
 * [ ] Add Conditional Formatting
 * [ ] Add Sort for multpiple columns
 * [ ] Add Pivot Fields
 * [ ] Add Totals
 * [ ] Add Row Totals
 * [x] Row Numbers
 * [ ] Insert HTML from LookML when available
 * [ ] Add Option: Series name override
 * [ ] Add Option: Font Size
 * [ ] Add Option: Cell Padding
 * [ ] Add Option: Fixed Header
 * [ ] Add Option: Fixed Footer
 * [ ] Add Option: Conditional Formatting
 *
 **/

const customVizDataTable = {
        /**
         * Configuration options
         *
         **/

        options: {
            // FORMATTING
            enableConditionalFormatting: {
                default: false,
                label: "Enable Conditional Formatting",
                order: 1,
                section: "Formatting",
                type: "boolean"
            },
            perColumnRange: {
                default: true,
                hidden: true,
                label: "Per column range",
                order: 2,
                section: "Formatting",
                type: "boolean"
            },
            conditionalFormattingType: {
                default: "all",
                display: "select",
                label: "Formatting Type",
                order: 3,
                section: "Formatting",
                type: "string",
                values: [
                    {All: "all"},
                    {"Subtotals only": "subtotals_only"},
                    {"Non-subtotals only": "non_subtotals_only"}
                ]
            },
            includeNullValuesAsZero: {
                default: false,
                label: "Include Null Values as Zero",
                order: 4,
                section: "Formatting",
                type: "boolean"
            },
            formattingStyle: {
                default: "low_to_high",
                display: "select",
                label: "Format",
                order: 5,
                section: "Formatting",
                type: "string",
                values: [
                    {"From low to high": "low_to_high"},
                    {"From high to low": "high_to_low"}
                ]
            },
            formattingPalette: {
                default: "red_yellow_green",
                display: "select",
                label: "Palette",
                order: 6,
                section: "Formatting",
                type: "string",
                values: [
                    {"Red to Yellow to Green": "red_yellow_green"},
                    {"Red to White to Green": "red_white_green"},
                    {"Red to White": "red_white"},
                    {"White to Green": "white_green"},
                    {"Custom...": "custom"}
                ]
            },
            lowColor: {
                display: "color",
                display_size: "third",
                label: "Low", // These values updated in updateAsync
                order: 7,
                section: "Formatting",
                type: "string"
            },
            midColor: {
                display: "color",
                display_size: "third",
                label: "Middle",
                order: 8,
                section: "Formatting",
                type: "string"
            },
            highColor: {
                display: "color",
                display_size: "third",
                label: "High",
                order: 9,
                section: "Formatting",
                type: "string"
            },
            applyTo: {
                default: "all_numeric_fields",
                display: "select",
                label: "Apply to",
                order: 10,
                section: "Formatting",
                type: "string",
                values: [
                    {"All numeric fields": "all_numeric_fields"},
                    {"Select fields...": "select_fields"}
                ]
            },
            // SERIES
            showFullFieldName: {
                default: true,
                label: "Show Full Field Name",
                order: 1,
                section: "Series",
                type: "boolean"
            },
            // PLOT
            showRowNumbers: {
                default: false,
                label: "Show Row Numbers",
                order: 1,
                section: "Plot",
                type: "boolean"
            },
            showSearchBar: {
                default: false,
                label: "Show Search Bar",
                order: 2,
                section: "Plot",
                type: "boolean"
            },
            showPagination: {
                default: false,
                label: "Show Pagination",
                order: 3,
                section: "Plot",
                type: "boolean"
            },
            showTableBorder: {
                default: true,
                label: "Show Table Border",
                order: 4,
                section: "Plot",
                type: "boolean"
            },
            stripedRows: {
                default: true,
                label: "Striped Rows",
                order: 5,
                section: "Plot",
                type: "boolean"
            },
            fontSize: {
                default: 12,
                display_size: 'third',
                label: 'Font size',
                order: 6,
                section: 'Plot',
                type: 'number',
            },


        },
        /**
         * The create function gets called when the visualization is mounted but before any
         * data is passed to it.
         **/
        create: function (element, config) {
            // Insert Bootstrap and DataTables css file
            element.innerHTML =
                '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.css" />\
                <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css" />\
                <link rel="stylesheet" href="https://cdn.datatables.net/fixedheader/3.1.4/css/fixedHeader.bootstrap4.min.css" />\
                <style>\
                th {\
                font-size: ' + config.fontSize + 'px;\
                }\
                \
                td {\
                font-size: ' + config.fontSize + 'px;\
                }\
                </style > ';

// Create a container element to let us center the text.
            this._vizContainer = element.appendChild(document.createElement("div"));
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

            var dataArray = [];
            var headerArray = [];
            var sortArray = [];

            for (let i = 0; i < data.length; i++) {
                var row = data[i];
                var rowData = [];

                for (var key in row) {
                    rowData.push(LookerCharts.Utils.textForCell(row[key]));

                    if (i == 0) {
                        columnCounter = 0;
                        // ADD DIMENSIONS
                        for (var x = 0; x < queryResponse.fields.dimension_like.length; x++) {
                            if (queryResponse.fields.dimension_like[x]["name"] == key) {
                                var label = queryResponse.fields.dimension_like[x].label;
                                var labelShort =
                                    queryResponse.fields.dimension_like[x].label_short;
                                var type = queryResponse.fields.dimension_like[x].type;
                                if (queryResponse.fields.dimension_like[x].sorted) {
                                    var orderDirection = "";
                                    if (
                                        queryResponse.fields.dimension_like[x].sorted.desc == true
                                    ) {
                                        orderDirection = "desc";
                                    } else if (
                                        queryResponse.fields.dimension_like[x].sorted.desc == false
                                    ) {
                                        orderDirection = "asc";
                                    } else {
                                        orderDirection = null;
                                    }
                                    sortArray.push([columnCounter, orderDirection]);
                                }
                            }
                            columnCounter++;
                        }
                        // ADD MEASURES
                        for (var x = 0; x < queryResponse.fields.measure_like.length; x++) {
                            if (queryResponse.fields.measure_like[x]["name"] == key) {
                                var label = queryResponse.fields.measure_like[x].label;
                                var labelShort = queryResponse.fields.measure_like[x].label_short;
                                var type = queryResponse.fields.measure_like[x].type;
                                if (queryResponse.fields.measure_like[x].sorted) {
                                    var orderDirection = "";
                                    if (queryResponse.fields.measure_like[x].sorted.desc == true) {
                                        orderDirection = "desc";
                                    } else if (
                                        queryResponse.fields.measure_like[x].sorted.desc == false
                                    ) {
                                        orderDirection = "asc";
                                    } else {
                                        orderDirection = null;
                                    }
                                    sortArray.push([columnCounter, orderDirection]);
                                }
                            }
                            columnCounter++;
                        }
                        // ADD TABLE CALCULATIONS
                        for (var x = 0; x < queryResponse.fields.table_calculations.length; x++) {
                            if (queryResponse.fields.table_calculations[x]["name"] == key) {
                                var label = queryResponse.fields.table_calculations[x].label;
                                var labelShort = queryResponse.fields.table_calculations[x].label_short;
                                var type = queryResponse.fields.table_calculations[x].type;
                                if (queryResponse.fields.table_calculations[x].sorted) {
                                    var orderDirection = "";
                                    if (queryResponse.fields.table_calculations[x].sorted.desc == true) {
                                        orderDirection = "desc";
                                    } else if (
                                        queryResponse.fields.table_calculations[x].sorted.desc == false
                                    ) {
                                        orderDirection = "asc";
                                    } else {
                                        orderDirection = null;
                                    }
                                    sortArray.push([columnCounter, orderDirection]);
                                }
                            }
                            columnCounter++;
                        }
                        if (config.showFullFieldName == false) {
                            var columnTitle = labelShort;
                        } else {
                            var columnTitle = label;
                        }
                        if (
                            type == "count" ||
                            type == "count_distinct" ||
                            type == "sum" ||
                            type == "sum_distinct"
                        ) {
                            type = "num";
                            headerArray.push({
                                title: columnTitle,
                                type: type,
                                sClass: "text-right",
                                render: $.fn.dataTable.render.number(",", ".", 0, "")
                            });
                        } else {
                            headerArray.push({title: columnTitle, type: type});
                        }
                    }
                }
                dataArray.push(rowData);
            }

            var html =
                '<table id="lookerDataTable" class="table table-responsive" style="width:100%"></table>';
            // Insert the generated html into the page
            this._vizContainer.innerHTML = html;

            $(document).ready(function () {
                //console.log(data);
                var table = $("#lookerDataTable").DataTable({
                    responsive: true,
                    searching: config.showSearchBar,
                    paging: config.showPagination,
                    info: config.showPagination,
                    data: dataArray,
                    columns: headerArray,
                    order: sortArray,
                    fixedHeader: {
                        header: true,
                        footer: true
                    }
                });

                // Show or hide row numbers
                if (config.showRowNumbers == true) {
                    $("#lookerDataTable thead tr").prepend("<th></th>");
                    $("#lookerDataTable tbody tr").each((i, tr) => {
                        i = i + 1;
                        $(tr).prepend('<td>' + i + '</td>')
                    })
                }

                // Show or hide the table border
                if (config.showTableBorder == true) {
                    $("#lookerDataTable").addClass("table-bordered");
                } else {
                    $("#lookerDataTable").removeClass("table-bordered");
                }

                // Show or hide the table border
                if (config.stripedRows == true) {
                    $("#lookerDataTable").addClass("table-striped");
                } else {
                    $("#lookerDataTable").removeClass("table-striped");
                }
            });

            doneRendering();
        }
    }
;

looker.plugins.visualizations.add(customVizDataTable);
