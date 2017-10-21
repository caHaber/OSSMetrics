import React, { Component } from 'react';
import {HeatmapComponent,BarComponent} from './VizComponents'
import Controls from './Controls';
import Loading from './Loading';
import crowbar from './js/svg-crowbar.js';
import './css/style.css';
import './css/bootstrap.min.css'


//Headers added in get request to increase github api usage limit
const auth = {
    id: 'xxxxxxxxxxxxxxxxxx',
    secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
}

const heatmap_total = (data) => {
    return data.reduce(function(sum, value) {return sum + value[2];}, 1);
}

const bar_total = (data) => {
    return data.reduce(function(sum, value) {return sum + value;}, 1);
}

class App extends Component{
    constructor() {
        super();

        this.state = {
            data:[],
            year_data: [],
            react_data: [],
            react_year_data: [],
            owner:'twitter',
            searchQuery: '',
            repo: 'finagle',
            loading: true
        };
        
        this.changeRepo = this.changeRepo.bind(this);
        this.search = this.search.bind(this);
        this.searchQueryUpdate = this.searchQueryUpdate.bind(this);

        this.loadReactData = this.loadReactData.bind(this);

        this.loadPunchCardData = this.loadPunchCardData.bind(this);
        this.loadYearData = this.loadYearData.bind(this);
        this.setLoadingFlag = this.setLoadingFlag.bind(this);
        this.savePdf = this.savePdf.bind(this);
    }
    componentWillMount() {
        this.loadPunchCardData();
        this.loadReactData();
    }
    loadReactData(){
        let app = this;

        fetch(process.env.PUBLIC_URL + '/data/punch_card.json')
        .then(function(response) {
           return response.json();
        }).then(function (action) {
            app.setState({react_data: action});
        });

        fetch(process.env.PUBLIC_URL + '/data/participation.json')
        .then(function(response) {
           return response.json();
        }).then(function (action) {
            app.setState({react_year_data: action.all});
        });
       //.then(this.setLoadingFlag());
    }
    loadYearData(){

        let app = this;
        let repo = (this.state.searchQuery !== '' ? this.state.searchQuery : this.state.owner + '/' + this.state.repo) ;
        let resourceType = 'stats/participation';

        fetch('https://api.github.com/repos/' + repo + '/' + resourceType + '?client_id='+auth.id+'&client_secret='+auth.secret)
        .then(function(response) {
           return response.json();
        }).then(function (action) {
            app.setState({year_data: action.all});
        })
        .then(this.setLoadingFlag());

    }
    loadPunchCardData(){
        let app = this;
        let repo = (this.state.searchQuery !== '' ? this.state.searchQuery : this.state.owner + '/' + this.state.repo) ;
        let resourceType = 'stats/punch_card';

        fetch('https://api.github.com/repos/' + repo + '/' + resourceType + '?client_id='+auth.id+'&client_secret='+auth.secret)
            .then(function(response) {
               return response.json();
            }).then(function (action) {

            // ####################################
            // ACCESSOR ON ENTRANCE OF API DATA --- 
            //     Usually do specific data accessing in viz component
            // ####################################
            // action  =  action.items.map((d) => {
            //         return  {
            //             x : d[app.state.xVar],
            //             y : d[app.state.yVar],
            //             forks: d['forks'],
            //             id: d.html_url,
            //             name: d.full_name};
            //     });

                app.setState({data: action});                
            })
            .then(this.setLoadingFlag())
            .then(this.loadYearData());

    }
    savePdf(event){   
        crowbar.call();
    }
    setLoadingFlag(){
        this.setState({loading:false});
    }
    searchQueryUpdate(event) {
        this.setState({searchQuery:event})
    }
    search(event) {
        let app = this;
        app.setState({loading:true});
        let p1 = new Promise(function(resolve, reject) {
            // This is only an example to create asynchronism
            window.setTimeout(
                function() {
                    // We fulfill the promise !
                    resolve(app.loadPunchCardData())
                }, Math.random() * 2000 + 1000);
        });

        p1.then(app.setState({searchQuery:event}));
    }
    changeRepo(event, index, value){
        this.setState({searchQuery:''})
        let app = this;
        app.setState({loading:true});
        let p1 = new Promise(function(resolve, reject) {
            window.setTimeout(
                function() {
                    resolve(app.loadPunchCardData())
                }, Math.random() * 2000 + 1000);
        });
        p1.then(app.setState({repo:value}));
    }
	render() {

        let repo_string = (this.state.searchQuery !== '' ? this.state.searchQuery : this.state.owner + '/' + this.state.repo) ;

        if (!this.state.data.length) {
            return (
                <div className="App container">
                    <div className="top-section row">
                    <div className="col-md-12 text-center">
                        <div>
                        <h2> Loading raw data from github for {repo_string} </h2>  <Loading loading={true}/>
                        <h5> *Beware that this is a prototype. If github rejects the api call because limit is exceeded or repo is mispelled, data will never load.
                            Reload the page if you think the repo was mispelled.
                        </h5>
                        </div>
                    </div>
                    </div>
                </div>
            );
        }

        const params = {
                width: 1200,
                height: 450
        };
            
        /**
         * Functions for computing the total amount of commits per github fetch
         */
        const total = heatmap_total(this.state.data);
        const react_total = heatmap_total(this.state.react_data);

        const year_total = bar_total(this.state.year_data)
        const react_year_total = bar_total(this.state.react_year_data);

		return (
           <div className="App container">
                <div className="top-section row">
                    <div className="col-md-12 text-center">
                        <h1 className="header"> TwitterOSS Metrics Demo </h1>
                        <h5>University of San Francisco: CS490 Capstone Project</h5>
                        <div className="col-md-8 col-md-offset-2 grey">
                            <h3 className="text-center sub-title">Make informed decisions to help your open source project thrive by measuring and tracking its success.</h3>
                        </div>
                    </div>
                </div>
                <div className="middle-section row">
                    <div className="col-md-8 col-md-offset-2 grey">                  
                             <h1 className="importance text-center"> Why is this good?</h1>
                             <div className="col-md-12 col-md-offset-0 list">
                                <ul>
                                    <li>Understand how users respond to a new feature</li>
                                    <li>Figure out where new users come from</li>
                                    <li>Identify, and decide whether to support, an outlier use case or functionality</li>
                                    <li>Quantify your project’s popularity</li>
                                    <li>Understand how your project is used</li>
                                    <li>Raise money through sponsorships and grants</li>
                                </ul>
                            </div>       
                    </div>   
                </div>
                <div className="middle-section row">
                    <div className="col-md-8 col-md-offset-2 grey">                  
                             <h1 className="importance text-center"> Metric Categories</h1>
                             <div className="col-md-8 col-md-offset-2 list">
                                <ol>
                                    <li>Discovery</li>
                                    <li>Usage</li>
                                    <li>Retention</li>
                                    <li>Maintainer activity</li>
                                </ol>
                            </div>       
                    </div>   
                </div>


                <div className="viz-section">
                    <div className="row">
                        <div className="col-md-12">   
                        <HeatmapComponent {...params}
                        title={'Total commit frequency '+ repo_string + ' : ' + total + ' total commits' }
                        data={this.state.data}/>
                        </div>
                    </div>
                    {this.state.react_data > 0 && 
                        <div className="row">
                            <div className="col-md-12">   
                            <HeatmapComponent {...params}
                            title={'Total commit frequency facebook/react : ' + react_total + ' total commits' }
                            data={this.state.react_data}/>
                            </div>
                        </div>
                    }
                    <hr/><br/>
                    {this.state.year_data.length > 0 && 
                        <div className="row">
                            <div className="col-md-12">
                                <BarComponent {...params}
                                title={'Total Commits by week of ' + repo_string + ' for the last 52 weeks : ' + year_total + ' total'}
                                yscaleName={"# of commits"}
                                data={this.state.year_data}/>
                            </div>
                        </div>
                    }
                    {this.state.react_year_data.length > 0 && 
                        <div className="row">
                            <div className="col-md-12">
                                <BarComponent {...params}
                                title={'Total Commits by week of facebook/react for the last 52 weeks : ' + react_year_total + ' total'}
                                yscaleName={"# of commits"}
                                data={this.state.react_year_data}/>
                            </div>
                        </div>
                    }
                    

                </div>
                <div className="controller">
                        <Controls
                            search={this.search}
                            searchQueryUpdate={this.searchQueryUpdate}
                            searchQuery={this.state.searchQuery}
                            repo={this.state.repo}
                            changeRepo={this.changeRepo}
                            savePdf={this.savePdf}
                        />
                    </div>
                <blockquote>
                    <p>Check out our github and start contributing at <a href="https://github.com/github/opensource.guide">twitter/twitteross-metrics</a>!</p>
                </blockquote>
                <blockquote>
                    <p>Open Source metrics for health based on <a href="https://github.com/github/opensource.guide">github.com/github/opensource.guide</a> used under the <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a> license.</p>
                </blockquote>
                <Loading loading={this.state.loading}/>
            </div>
		);
	}
}

export default App;
