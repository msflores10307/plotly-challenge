var filepath = "../../samples.json";

d3.json(filepath).then(updateDashboard)

function updateDashboard(data) {
    // console.log(data.names)
    var names = data.names;

    var menu = d3.select('#selDataset')

    names.forEach((name) => {
    var option = menu.append("option");
    option.text(name)

    menu.on('change', function (){ 
        var sampleChoice = menu.property("value")
        console.log(sampleChoice)

        var selection =  d3.select("#sample-metadata").selectAll(".demodata");
        selection.data([]).exit().remove();

        var samples = data.samples;
        var meta = data.metadata;
        // console.log(Object.entries(meta))
        samples.forEach((subject) => {
            if (subject.id === sampleChoice) {
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
                // text: barHover,
                marker: {
                color: barLabelsRaw,
                  size: barData
                }
              };
              
            //   var data = [bubbleTrace];
              
              var bubbleLayout = {
                title: 'OTU Distribution',
                showlegend: false,
                height: 1000,
                width: 1000
              };
              
              Plotly.newPlot('gauge', [bubbleTrace], bubbleLayout);



                }
            }) 
    
        
            meta.forEach((person) => {
            if (person.id == sampleChoice) {
                metaPoints = Object.entries(person);
                var keyValues = metaPoints.map(x=>`${x[0]}: ${x[1]}`)
                console.log(keyValues)

         
                var selection2 =  d3.select("#sample-metadata").selectAll(".demodata");
                selection2.data(keyValues).enter().append("div").classed("demodata",true)
                .html(function(d) {
                    return `<p>${d}</p>`
                })
                ;

                
                
            }
            })

    })
    

  });
}