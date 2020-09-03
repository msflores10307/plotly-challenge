
var filepath = "../../samples.json";

d3.json(filepath).then(updateDashboard);


function updateDashboard(data) {

    var names = data.names;
    var menu = d3.select('#selDataset')

    names.forEach((name) => {
    var option = menu.append("option");
    option.text(name)

    var samples = data.samples;
    var meta = data.metadata;

    menu.on('change', function (){ 
        var sampleChoice = menu.property("value")
        console.log(sampleChoice)

        var selection =  d3.select("#sample-metadata").selectAll(".demodata");
        selection.data([]).exit().remove();
        newViz(sampleChoice,samples,meta)
    })
  });
};


function newViz(id,samples,meta){
    samples.forEach((subject) => {
        if (subject.id === id) {
            var subject = [subject]
            var sortedSubject = subject.sort((a,b) => b.sample_values-a.sample_values);
            var barData = Object.values(sortedSubject)[0].sample_values;
            
            var barLabelsRaw = Object.values(sortedSubject)[0].otu_ids;
            var barLabels = barLabelsRaw.map(x=>`OTU-${x.toString()} `)
            var barHover = Object.values(sortedSubject)[0].otu_labels;
            


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
                
        Plotly.newPlot('bar', barTrace);

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
          
          
          var bubbleLayout = {
            title: 'OTU Distribution',
            showlegend: false,
            height: 600,
            width: 1000
          };
          
          Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);
            }
        }) 

    
        meta.forEach((person) => {
        if (person.id == id) {
            var metaPoints = Object.entries(person);
            var keyValues = metaPoints.map(x=>`${x[0]}: ${x[1]}`)
            console.log(keyValues)

            var selection2 =  d3.select("#sample-metadata").selectAll(".demodata");
            selection2.data(keyValues).enter().append("div").classed("demodata",true)
            .html(function(d) {
                return `<p>${d}</p>`
            })
            ;

            var gaugeData = [
                {
                  type: "indicator",
                  mode: "gauge+number+delta",
                  value: metaPoints[6][1],
                  title: { text: "Washing Frequency", font: { size: 24 } },
                //   delta: { reference: 7, increasing: { color: "RebeccaPurple" } },
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
              
              var layout = {
                width: 500,
                height: 400,
                margin: { t: 25, r: 25, l: 25, b: 25 },
                paper_bgcolor: "lavender",
                font: { color: "darkblue", family: "Arial" }
              };
              
              Plotly.newPlot('gauge', gaugeData, layout);    
            
        }
        })}