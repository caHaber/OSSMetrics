// Scatterplot
import React, {Component} from 'react';
import {scaleQuantize,quantile,min,max}  from 'd3';
import '../css/HeatMap.css';
import {ORFrame} from 'semiotic';



// eslint-disable-next-line
const generateQuantiles = (a, steps) => {
    var ranges = [];
    for(var i; i <= steps; i++){
        ranges.push(quantile(a, (i%steps) , d => d.value));
    }
}

const config = {
    projection: 'vertical',
    className: 'heatMap',
    rAccessor: () => 1,
    oAccessor: d => d.step,
    type: "bar",
    oLabel: d => <text textAnchor="middle" transform="rotate(0) translate(0,0)">{d%12 + 1}</text>,
    margin: { left: 100, top: 70, bottom: 0, right: 50 },
    oPadding: 0,
    canvasAreas: () => true,
    pieceClass: "heatrects",
    pieceHoverAnnotation: true
}

class HeatmapComponent extends Component{
	render() {

        const tiles = Array(this.props.data.length)
            .fill()
            .map((d,i) => ({ step: i%24, value: this.props.data[i][2]}))
        
        const heatScale = scaleQuantize()
            .domain([min(tiles,d => d.value),max(tiles,d => d.value)])
            .range(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]);

        const daysOfTheWeek = {
            6: "Saturday",
            5: "Friday",
            4: "Thursday",
            3: "Wednesday",
            2: "Tuesday",
            1: "Monday",
            0: "Sunday",
        }

        const daysAxis = { orient: 'left', style: {display: 'none'},
            tickFormat: d => daysOfTheWeek[d] ? 
            <text style={{ textAnchor: "end" }} y={-20}>{daysOfTheWeek[d]}</text> : "" }

		return (
            <ORFrame
            size={[ this.props.width, this.props.height ]}
            title={this.props.title}
            data={tiles}
            className={config.className}
            rAccessor={config.rAccessor}
            oAccessor={config.oAccessor}
            style={d => ({ fill: (d.value === 0 ? 'whitesmoke' : heatScale(d.value)) , stroke: 'white', strokeWidth: 1 })}
            type={config.type}
            axis={daysAxis}
            oLabel={config.oLabel}
            margin={config.margin}
            oPadding={config.oPadding}
            canvasAreas={config.canvasAreas}
            pieceClass={config.pieceClass}
            pieceHoverAnnotation={config.pieceHoverAnnotation}
            tooltipContent={d => 
                <div className="tooltip-content" >
                <p>Commits: {d.value}</p>
                </div>}
            />
		);
	}
}

export default HeatmapComponent;
