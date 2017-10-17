import React, { Component } from 'react';
import {PlotComponent,BarComponent} from './VizComponents'
import Controls from './Controls';
import Loading from './Loading';
import crowbar from './js/svg-crowbar.js';
import './css/style.css';


//Headers added in get request to increase github api usage limit
const auth = {
    id: 'xxxxxxxxxxxxxxxxxx',
    secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
}


class App extends Component{
    constructor() {
        super();

        this.state = {
            data:[],
            year_data: [],
            owner:'pantsbuild',
            searchQuery: '',
            repo: 'pants',
            loading: true
        };
        
        this.changeRepo = this.changeRepo.bind(this);
        this.search = this.search.bind(this);
        this.searchQueryUpdate = this.searchQueryUpdate.bind(this);

        this.loadPunchCardData = this.loadPunchCardData.bind(this);
        this.loadYearData = this.loadYearData.bind(this);
        this.setLoadingFlag = this.setLoadingFlag.bind(this);
        this.savePdf = this.savePdf.bind(this);
    }
    componentWillMount() {
        this.loadPunchCardData();
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

        fetch('https://api.github.com/repos/' + repo + '/' + resourceType)
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

        console.log("SEARCH");
        
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
            return (<div>
            <h2> Loading raw data from github for {repo_string} </h2>  <Loading loading={true}/>
            <h5> *Beware that this is a prototype. If github rejects the api call because limit is exceeded or repo is mispelled, data will never load.
                Reload the page if you think the repo was mispelled.
            </h5>
            </div>);
        }

        let fullWidth = window.innerWidth * .7,
            fullHeight = window.innerHeight;

        let params = {
                bins: 20,
                width: fullWidth -150,
                height: fullHeight - 150,
                leftMargin: 100,
                topMargin: 0,
                bottomMargin: 50,
                yscaleName: "# of commits"
            };
            
        /**
         * Functions for computing the total amount of commits per github fetch
         */
        const total = this.state.data.reduce(function(sum, value) {
            return sum + value[2];
            }, 1);    

        const year_total = this.state.year_data.reduce(function(sum, value) {
            return sum + value;
            }, 1);

		return (
           <div className="App flex-container">
                <div className="top-section flex-item">
                    <h1 className="header"> TwitterOSS Metrics Demo </h1>
                    <h2>University of San Francisco: CS490 Capstone Project</h2>
            
                </div>

                <div className="stats flex-item">
                    <h2 className="graph-title">  Total commit frequency {repo_string} : {total} total commits  </h2>
                </div>
                <div className="viz-section">
                    <div className="flex-item">            
                        <PlotComponent {...params} data={this.state.data}/>
                    </div>
                    {this.state.year_data.length > 0 && 
                        <div className="flex-item">
                        <h2 className="graph-title"> Total Commits by week for the last 52 weeks : {year_total} total commits in year</h2>
                        <BarComponent {...params} data={this.state.year_data}/>
                        </div>
                    }
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
                </div>
                <blockquote>
                    <p>Open Source metrics for health based on <a href="https://github.com/github/opensource.guide">github.com/github/opensource.guide</a> used under the <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY-4.0</a> license.</p>
                </blockquote>
                <Loading loading={this.state.loading}/>
            </div>
		);
	}
}

export default App;
