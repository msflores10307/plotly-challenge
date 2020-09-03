// set filepath for data
var filepath = "../../samples.json";

// import data and trigger main update function
d3.json(filepath).then(updateDashboard);

// this function is the primary function for populating menu options and refreshing metadata panels 
function updateDashboard(data) {

    // this section of code pulls names from data and dynamically appends options to menu 
    var names = data.names;
    var menu = d3.select('#selDataset');
    names.forEach((name) => {
    var option = menu.append("option");
    option.text(name)

    // this section of code pulls samples and metadata from raw data
    var samples = data.samples;
    var meta = data.metadata;

    // this section of code is an event listener that will trigger an refresh of the 
    // visualizations on the page when a change is detected in the menu selection
    menu.on('change', function (){ 
        // selects menu selection value
        var sampleChoice = menu.property("value");
        console.log(sampleChoice);

        // removes content from metadata panel
        var selection =  d3.select("#sample-metadata").selectAll(".demodata");
        selection.data([]).exit().remove();

        // calls function to populate dashboard with new visualizations
        newViz(sampleChoice,samples,meta);
    })
  });
};

// this function is called to update all the visualizations for a new menu item selection.
function newViz(id,samples,meta){
    // this loops through each item to find the id that matches the menu selection. 
    samples.forEach((subject) => {
        if (subject.id === id) {
            // if a match is found, this section of code sorts and extracts the sample data into usable arrays
            var subject = [subject]
            var sortedSubject = subject.sort((a,b) => b.sample_values-a.sample_values);
            var barData = Object.values(sortedSubject)[0].sample_values;
            var barLabelsRaw = Object.values(sortedSubject)[0].otu_ids;
            var barLabels = barLabelsRaw.map(x=>`OTU-${x.toString()} `);
            var barHover = Object.values(sortedSubject)[0].otu_labels;
            
            // this uses arrays above to define trace for bar chart. Note only top 10 values are taken
            var barTrace = [{
            type: 'bar',
            x: barData.slice(0,10),
            y: barLabels.slice(0,10),
            text: barHover,
            orientation: 'h',
            text: barHover.slice(0,10),
            yaxis: {title:'OTU ID'},
            xaxis: {title: 'Sample Value'}
        }];
        
        // this line of code creates horizontal bar chart
        Plotly.newPlot('bar', barTrace);

        // this section of code creates the trace for the bubble chart
        var bubbleTrace = {
            x: barLabelsRaw,
            y: barData,
            mode: 'markers',
            text: barHover,
            marker: {
            color: barLabelsRaw,
              size: barData
            }
          };
          
          // this section of code creates the layout attribute for the bubble chart
          var bubbleLayout = {
            title: 'OTU Distribution',
            showlegend: false,
            height: 600,
            width: 1000
          };
          
          // creates bubble chart
          Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);
            }
        }) 

        // this is a loop to pull metadata for subject with an id matching menu selection
        meta.forEach((person) => {
        if (person.id == id) {

            // if a match is found, this section of code extracts metadata into usable array
            var metaPoints = Object.entries(person);
            var keyValues = metaPoints.map(x=>`${x[0]}: ${x[1]}`);
            console.log(keyValues)

            // this section of code appends div elements to the metadata panel on the dashboard
            var selection2 =  d3.select("#sample-metadata").selectAll(".demodata");
            selection2.data(keyValues).enter().append("div").classed("demodata",true)
            .html(function(d) {
                return `<p>${d}</p>`
            })
            ;

            // this section of data defines the trace for the guage diagram
            var gaugeData = [
                {
                  type: "indicator",
                  mode: "gauge+number+delta",
                  value: metaPoints[6][1],
                  title: { text: "Washing Frequency", font: { size: 24 } },
                  gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "darkblue" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                      { range: [0, 250], color: "cyan" },
                      { range: [0, 400], color: "royalblue" }
                    ],
                    threshold: {
                      line: { color: "red", width: 4 },
                      thickness: 0.75,
                      value: 300
                    }
                  }
                }
              ];
              
              // this section of code defines the layout for the gauge diagram
              var layout = {
                width: 500,
                height: 400,
                margin: { t: 25, r: 25, l: 25, b: 25 },
                paper_bgcolor: "lavender",
                font: { color: "darkblue", family: "Arial" }
              };
              
              // creates guage diagram
              Plotly.newPlot('gauge', gaugeData, layout);    
            
        }
        })}