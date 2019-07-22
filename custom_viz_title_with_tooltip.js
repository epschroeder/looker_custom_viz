/**
 * This is a Custom Visualization for Looker
 *
 * It shows the first 3 dimension columns as a title, subtitle and a tooltip
 *
 * CREATED BY: Egbert Schroeder
 *
 * DEPENDENCIES:
 *
 *
 * TODO:
 *
 **/

const customVizTitleWithTooltip = {
    /**
     * Configuration options
     *
     **/

    options: {},

    /**
     * The create function gets called when the visualization is mounted but before any
     * data is passed to it.
     **/
    create: function (element, config) {
        // Insert Bootstrap css file
        element.innerHTML =
            '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">' +
            '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">';

        // Create a container element to let us center the text.
        this._vizContainer = element.appendChild(document.createElement("div"));
        this._vizContainer.className = "container-fluid";
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
        if (queryResponse.fields.dimensions.length < 3) {
            this.addError({
                title: "Not enough dimensions",
                message: "This chart requires 3 dimensions."
            });
            return;
        }

        // Select first row of data
        var firstRow = data[0];

        // Grab first column for the report title
        var title = firstRow[queryResponse.fields.dimensions[0].name];

        // Grab second column for the report subtitle/period
        var subTitle = firstRow[queryResponse.fields.dimensions[1].name];

        // Grab third column for the report subtitle/period
        var tooltipText = firstRow[queryResponse.fields.dimensions[2].name];

        // Insert the data into text elements
        var html = `<div class="row">
                        <div class="col text-center align-self-center">
                            <h1 class="display-4 align-middle" style="font-size: 2.5rem;">` + title.value + ` 
                                <small class="fa fa-question-circle align-top" style="font-size: 1rem;" data-toggle="tooltip" data-placement="bottom" title="` + tooltipText.value + `"></small>
                            </h1> 
                            <h5>` + subTitle.value + `</h5>
                        </div>
                    </div>`;

        // Insert the generated html into the page
        this._vizContainer.innerHTML = html;

        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
        doneRendering();
    }
};

looker.plugins.visualizations.add(customVizTitleWithTooltip);
