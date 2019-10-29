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
 * [ ] Add Sort for multiple columns
 * [ ] Add Pivot Fields
 * [ ] Add Totals
 * [ ] Add Row Totals
 * [ ] Row Numbers
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
            // FORMATING
            headerFontSize: {
                default: 12,
                label: 'Header Font Size',
                order: 1,
                section: 'Formatting',
                type: 'number',
            },
            rowFontSize: {
                default: 12,
                label: 'Row Font Size',
                order: 2,
                section: 'Formatting',
                type: 'number',
            },
            // SERIES
            showFullFieldName: {
                default: false,
                label: "Show Full Field Name",
                order: 1,
                section: "Series",
                type: "boolean"
            },
            // PLOT
            showRowNumbers: {
                default: true,
                label: "Show Row Numbers",
                order: 1,
                section: "Plot",
                type: "boolean"
            },
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
            showHeader: {
                default: true,
                label: "Show Table Header",
                order: 2,
                section: "Plot",
                type: "boolean"
            },
            showTableBorder: {
                default: true,
                label: "Show Table Border",
                order: 3,
                section: "Plot",
                type: "boolean"
            },
            stripedRows: {
                default: true,
                label: "Striped Rows",
                order: 4,
                section: "Plot",
                type: "boolean"
            },
            htmlFormatting: {
                default: true,
                label: "HTML Formatting",
                order: 5,
                section: "Plot",
                type: "boolean"
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
                body {\
                margin: 0;\
                padding: 0;\
                }\
                \
                #vis {\
                margin:0;\
                padding:0;\
                }\
                \
                .table {\
                width: 100%;\
                }\
                \
                .table thead th {\
                padding-right: 0 !important;\
                }\
                \
                .table-sm thead th {\
                padding: 0.3rem !important;\
                }\
                \
                .table tbody td {\
                }\
                </style >';

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

            var dataArray = [];
            var headerArray = [];
            var sortArray = [];
            var totalArray = [];

            for (let i = 0; i < data.length; i++) {
                var row = data[i];
                var rowData = [];

                for (var key in row) {


                    // if (i == 0) {
                    columnCounter = 0;
                    // ADD DIMENSIONS
                    for (var x = 0; x < queryResponse.fields.dimension_like.length; x++) {
                        if (queryResponse.fields.dimension_like[x]["name"] == key && queryResponse.fields.dimension_like[x]["hidden"] == false) {
                            rowData.push(LookerCharts.Utils.htmlForCell(row[key]));
                            if (i == 0) {
                                var label = queryResponse.fields.dimension_like[x].label;
                                var labelShort =
                                    queryResponse.fields.dimension_like[x].label_short;
                                var type = queryResponse.fields.dimension_like[x].type;


                                headerArray.push({
                                    title: labelShort,
                                    type: "html-num-fmt",
                                })
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
                        }
                        columnCounter++;
                    }
                    // ADD MEASURES
                    for (var x = 0; x < queryResponse.fields.measure_like.length; x++) {
                        if (queryResponse.fields.measure_like[x]["name"] == key && queryResponse.fields.measure_like[x]["hidden"] == false) {
                            if (config.htmlFormatting == false) {
                                rowData.push(LookerCharts.Utils.textForCell(row[key]));
                            } else {
                                rowData.push(LookerCharts.Utils.htmlForCell(row[key]));
                            }

                            if (i == 0) {
                                var label = queryResponse.fields.measure_like[x].label;
                                var labelShort = queryResponse.fields.measure_like[x].label_short;
                                var type = queryResponse.fields.measure_like[x].type;
                                headerArray.push({
                                    title: labelShort,
                                    type: "html-num-fmt",
                                    sClass: "text-right",
                                })
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
                        }
                        columnCounter++;
                    }
                    // ADD TABLE CALCULATIONS
                    for (var x = 0; x < queryResponse.fields.table_calculations.length; x++) {
                        if (queryResponse.fields.table_calculations[x]["name"] == key) {
                            rowData.push(LookerCharts.Utils.htmlForCell(row[key]));
                            if (i == 0) {
                                var label = queryResponse.fields.table_calculations[x].label;
                                var labelShort = queryResponse.fields.table_calculations[x].label;
                                var type = queryResponse.fields.table_calculations[x].type;
                                headerArray.push({
                                    title: label,
                                    type: type,
                                    sClass: "text-right",
                                })
                                if (queryResponse.fields.table_calculations[x].sorted) {
                                    var orderDirection = "";
                                    if (queryResponse.fields.table_calculations[x].sorted.desc === true) {
                                        orderDirection = "desc";
                                    } else if (
                                        queryResponse.fields.table_calculations[x].sorted.desc === false
                                    ) {
                                        orderDirection = "asc";
                                    } else {
                                        orderDirection = null;
                                    }
                                    sortArray.push([columnCounter, orderDirection]);
                                }
                            }
                        }
                        columnCounter++;
                    }
                    // }
                }
                dataArray.push(rowData);
            }

            if (queryResponse.has_totals === true) {
                for (var column in data[0]) {

                    if (queryResponse.totals_data[column]) {
                        // console.log('Column: ' + column);
                        // console.log(queryResponse.totals_data[column].html);
                        totalArray.push('<strong>' + queryResponse.totals_data[column].html + '</strong>');
                    } else {
                        // console.log('Column: empty');
                        totalArray.push('');
                    }
                }
                if (totalArray[0] === '') {
                    totalArray[0] = '<strong>Total:</strong>';
                }
                dataArray.push(totalArray);
            }


            var html = '<table id="lookerDataTable" class="table table-sm"></table>';
            // Insert the generated html into the page
            this._vizContainer.innerHTML = html;

            $(document).ready(function () {

                // Show or hide row numbers
                if (config.showRowNumbers === true) {
                    for (var i = 0; i < dataArray.length; i++) {
                        dataArray[i].unshift(i);
                    }
                }

                // Show or hide the table headers
                if (config.showHeader === false) {
                    $(".table thead").css({'display': 'none'});
                }

                // Show or hide the table border
                if (config.showTableBorder === true) {
                    $("#lookerDataTable").addClass("table-bordered");
                } else {
                    $("#lookerDataTable").removeClass("table-bordered");
                }

                // Show or hide the striped rows
                if (config.stripedRows === true) {
                    $("#lookerDataTable").addClass("table-striped");
                } else {
                    $("#lookerDataTable").removeClass("table-striped");
                }

                // Set table header font-size
                $(".table thead th").css({'font-size': config.headerFontSize + 'px'});

                // Set table row font-size
                $(".table tbody td").css({'font-size': config.rowFontSize + 'px'});

                // console.log(queryResponse);
                var table = $("#lookerDataTable").DataTable({
                    autoWidth: true,
                    ordering: false,
                    searching: false,
                    paging: false,
                    info: config.showPagination,
                    data: dataArray,
                    columns: headerArray,
                    order: sortArray,
                    fixedHeader: {
                        header: true,
                        footer: true
                    },
                }).columns.adjust();
            });


            doneRendering();
        }
    }
;

looker.plugins.visualizations.add(customVizDataTable);