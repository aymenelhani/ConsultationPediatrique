 var yscale,bars;

    var svg;


    d3.csv("data/donneFinal.csv",function(data){

    

      data.forEach(function (d){
        d.Tarif=parseInt(d.Tarif);
      });

      var margin =  {top: 20, right: 10, bottom: 20, left: 40},
      selectorHeight = 20
      width = 5000 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom - selectorHeight,
      barWidth = 45;

      var numBars=Math.round(width/barWidth);


     var xscale = d3.scale.ordinal()
                .domain(data.slice(0,numBars).map(function (d) { return d.Ville; }))
                .rangeBands([0, 1100]);

            yscale = d3.scale.linear()
                .domain([0, d3.max(data, function (d) { return d.Tarif; })])
                .range([height, 0]);

            var xAxis  = d3.svg.axis().scale(xscale).orient("bottom"),
                yAxis  = d3.svg.axis().scale(yscale).orient("left"); 


            svg = d3.select("#diagram").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom + selectorHeight+400);

                      
                    
            var diagram = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


              diagram.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0, " + height + ")")
                .call(xAxis)    
                .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "12em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                  return "rotate(-65)" 
                });    

               
               diagram.append("g")
                .attr("class", "y axis")
                .call(yAxis);

                var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
               .text("a simple tooltip");


             bars = diagram.append("g");
             
              bars.selectAll("rect")
              .data(data.slice(0, numBars), function (d) {return d.Ville; })
              .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function (d) { return xscale(d.Ville); })
              .attr("y", function (d) { return yscale(d.Tarif); })
              .attr("width", xscale.rangeBand())
              .attr("height", function (d) { return height - yscale(d.Tarif); })
      
             
           updateX = function(feature){
           console.log(feature)
            yscale = d3.scale.linear()
                .domain([0, d3.max(data, function (d) { return d[feature]; })])
                .range([height, 0]);
            //console.log(data)
            xscale.domain(d3.extent(data,function(d){return +d[feature]}))
      //console.log(feature)
            // d3.select("svg").selectAll("rect").transition().duration(1000).attr("class", "bar").attr("height",function(d){console.log(d); return  height-yscale(+d[feature])})
            d3.selectAll("rect").transition().duration(1000).attr("height",function(d){ return  height-yscale(+d[feature])}).attr("y",function(d){console.log(d); return  yscale(+d[feature])})
            d3.select("y axis").call(yAxis)





        

              
              if(feature=="Tarif"){
                bars.selectAll("rect")
                .append("svg:title")
                .text(function(d) { return d.Tarif+" " +" cest le tarif"; });
               //x = "Tarif"
             }
              else if(feature=="Dpassement_honoraires"){
                 //x= "Depassement honoraire "
                 bars.selectAll("rect")
                 .append("svg:title")
                 .text(function(d) { return d.Dpassement_honoraires; });
                }
                else{
                  //x="Délais RDV"
                  bars.selectAll("rect")
                  .append("svg:title")
                  .text(function(d) { return d.Dlai_rendez_vous; });
                }
           

}
          



    })

