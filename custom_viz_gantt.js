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
        element.innerHTML = "<h1>Ready to render!</h1>";
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
        var $categories = [];
        var $ganttData = [];
        var $counter = 0;
        // Create list of unique values from first column
        for (var x = 0; x < data.length; x++) {
            var row = data[x];
            $first_column_values.push(row[$first_column_key].value);
        }

        $categories = [...new Set($first_column_values)];

        console.log($categories);
        $categories.forEach(function (category) {
            data.forEach(function (row) {

                if (row[$first_column_key].value === category) {

                    $ganttData[$counter] = {'name': row[$second_column_key].value};

                    $counter++;
                }
            });

        });
        console.log($ganttData);

        doneRendering()
    }
};

looker.plugins.visualizations.add(customVizGanttChart);