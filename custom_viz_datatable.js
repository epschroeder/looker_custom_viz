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
 * Add Table Calculations
 * Conditional Formatting
 * Sort order for multpiple columns
 * Pivot
 * Totals
 * Row Totals
 * Row Numbers
 * Add Options: Series name override, Font Size, Cell Padding, Fixed Header, Fixed Footer, Conditional Formatting
 *
 **/

const customVizDataTable = {
  /**
   * Configuration options
   *
   **/

  options: {
    // Plot
    showSearchBar: {
      default: true,
      label: "Show Search Bar",
      order: 1,
      section: "Plot",
      type: "boolean"
    },
    showPagination: {
      default: true,
      label: "Show Pagination",
      order: 2,
      section: "Plot",
      type: "boolean"
    },
    showRowNumbers: {
      default: true,
      label: "Show Row Numbers",
      order: 3,
      section: "Plot",
      type: "boolean"
    },
    // SERIES
    showFullFieldName: {
      default: true,
      label: "Show Full Field Name",
      order: 1,
      section: "Series",
      type: "boolean"
    },
    // STYLING
    showTableBorder: {
      default: true,
      label: "Show Table Border",
      order: 1,
      section: "Styling",
      type: "boolean"
    },
    stripedRows: {
      default: true,
      label: "Striped Rows",
      order: 2,
      section: "Styling",
      type: "boolean"
    }
  },

  /**
   * The create function gets called when the visualization is mounted but before any
   * data is passed to it.
   **/
  create: function(element, config) {
    // Insert Bootstrap and DataTables css file
    element.innerHTML =
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.css" />\
      <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css" />\
      <link rel="stylesheet" href="https://cdn.datatables.net/fixedheader/3.1.4/css/fixedHeader.bootstrap4.min.css" />';

    // Create a container element to let us center the text.
    this._vizContainer = element.appendChild(document.createElement("div"));
  },

  /**
   * UpdateAsync is the function that gets called (potentially) multiple times. It receives
   * the data and should update the visualization with the new data.
   **/
  updateAsync: function(
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

    var dataArr = [];
    var headerArr = [];
    var sortArr = [];

    for (let i = 0; i < data.length; i++) {
      var row = data[i];
      var rowData = [];
      for (var key in row) {
        rowData.push(row[key].value);
        if (i == 0) {
          columnCounter = 0;
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
                sortArr.push([columnCounter, orderDirection]);
              }
            }
            columnCounter++;
          }
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
                sortArr.push([columnCounter, orderDirection]);
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
            headerArr.push({
              title: columnTitle,
              type: type,
              sClass: "text-right",
              render: $.fn.dataTable.render.number(",", ".", 0, "")
            });
          } else {
            headerArr.push({ title: columnTitle, type: type });
          }
        }
      }
      dataArr.push(rowData);
    }

    var html =
      '<table id="lookerDataTable" class="table" style="width:100%"></table>';
    // Insert the generated html into the page
    this._vizContainer.innerHTML = html;

    $(document).ready(function() {
      //console.log(data);
      $("#lookerDataTable").DataTable({
        searching: config.showSearchBar,
        paging: config.showPagination,
        info: config.showPagination,
        data: dataArr,
        columns: headerArr,
        order: sortArr,
        fixedHeader: {
          header: true,
          footer: true
        }
      });
    });

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

    doneRendering();
  }
};

looker.plugins.visualizations.add(customVizDataTable);
