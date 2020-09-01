var filepath = "../../samples.json";

d3.json(filepath).then(function(data) {
    // console.log(data.names)
    var names = data.names;

    var menu = d3.select('#selDataset')

    names.forEach((name) => {
    var option = menu.append("option");
    option.text(name)

    menu.on('change', function (){ 
        var sampleChoice = menu.property("value")
        console.log(sampleChoice)

        var samples = data.samples;
        var meta = data.metadata;
        // console.log(Object.entries(meta))
        samples.forEach((subject) => {
            if (subject.id === sampleChoice) {
                var values = subject.sample_values;
                var barData = values.sort((a,b) => b-a).slice(0,10);
                console.log(barData)
                var barLabels = subject.otu_ids;
                var barHover = subject.otu_labels;

            var barTrace = [{
                type: 'bar',
                x: barData,
                labels: barLabels,
                orientation: 'h'
            }];
                    
            Plotly.newPlot('bar', barTrace);
                }
            }) 
    
        
        meta.forEach((person) => {
            if (person.id === sampleChoice) {
                console.log(person);
            }
            })  
    })
    

  });
})
