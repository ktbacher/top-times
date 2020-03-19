// let i = document.querySelector('input');
// let t = document.querySelector('h2');

// var distances = ['100 m', '200 m', '400 m', '800 m', '1 mile', '5000 m', '10,000 m', 'Marathon'];

// // console.log(i.value);
// t.innerHTML = i.value;

// i.addEventListener('input', function () {
//     t.innerHTML = i.value;
//   }, false);

function makeChart(event, gender, lastDate=new Date("2018-1-1")) {
    d3.csv("https://gist.githubusercontent.com/ktbacher/0c7ef46ff58ec4cc47661fa73ccdb4f3/raw/e8facb2fd6cc4e6a84cdbe03f9f4fa4848a64491/top1000times.csv", function(data) {
            var ordered = data.filter(d=> d.Event === event && d.Gender === gender && new Date(d.Date) < lastDate).sort((a,b) => a.Date > b.Date);
            var worldRecords = [];
            ordered.forEach(t => {
                if (worldRecords.length == 0) {
                    worldRecords.push(t);
                }
                else if (t.Time < worldRecords.slice(-1,)[0].Time) {
                    worldRecords.push(t)
                }
            })

            svg.selectAll("g").remove();

            // Add X axis
            var x = d3.scaleTime()
                .domain([new Date("1960-1-1"), new Date("2018-1-1")])
                .range([ 0, width ]);
            var xMargin = x.copy().range([margin.left, width - margin.right]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            
            // Add Y axis
            var orderT = data.filter(d=> d.Event === event && d.Gender === gender).sort((a,b) => a.Time > b.Time);
            var minT = orderT[0].Time;
            var maxT = orderT.slice(-1,)[0].Time;
            var y = d3.scaleLinear()
                .domain([minT.slice(0,2)*60*60+ minT.slice(3,5)*60+minT.slice(6,)*1, maxT.slice(0,2)*60*60+ maxT.slice(3,5)*60+maxT.slice(6,)*1])
                .range([ height, 0]);
            yMargin = y.copy().range([height - margin.bottom, margin.top]);
            svg.append("g")
                .attr("transform", "translate("+margin.left+",0)")
                .call(d3.axisLeft(y));

            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(ordered)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(new Date(d.Date)); } )
                .attr("cy", function (d) { return y(d.Time.slice(0,2)*60*60+ d.Time.slice(3,5)*60+d.Time.slice(6,)*1); } )
                .attr("r", 3)
                .style("fill", "#d3d3d3")
            svg.append('g')
                .selectAll("dot")
                .data(worldRecords)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(new Date(d.Date)); } )
                // .attr("cy", function (d) { return y(new Date("January 1, 1970 " +d.Time.slice(0,8))); } )
                .attr("cy", function (d) { return y(d.Time.slice(0,2)*60*60+ d.Time.slice(3,5)*60+d.Time.slice(6,)*1); } )
                .attr("r", 5)
                .style("fill", "#e76060")
                .on("mouseover", function(d) {		
                    // console.log(d.Name);
                    tooltip.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                    tooltip.html(d.Name +"<br>"+ d.Time.slice(0,11))	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px")
                        .style("width", d.Name.length *7 +'px');	
                    // tooltip.style("opacity", .9);
                    // tooltip.text(d.Name);
                    // return tooltip
                    })
                // .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})					
                .on("mouseout", function(d) {		
                    tooltip.transition()		
                        .duration(500)		
                        .style("opacity", 0);
                    // return tooltip.style("opacity", 0);	
                });
            // console.log(worldRecords);
        });
    }