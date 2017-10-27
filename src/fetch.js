/* 
Fetcher util class. 
TODO: Implement complete fetches that throw er
 */

//Headers added in get request to increase github api usage limit
const auth = {
    id: 'xxxxxxxxxxxxxxxxxx',
    secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
}

const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const GITURL = 'https://api.github.com/repos/'

class fetcher {
    
    static loadYearData = (app, searchQuery, owner, repo) => {
        
        let repostring = (searchQuery !== '' ? searchQuery : owner + '/' + repo) ;
        let resourceType = 'stats/participation';
    
        fetch( GITURL + repostring + '/' + resourceType + '?client_id='+auth.id+'&client_secret='+auth.secret)
        .then(handleErrors)
        .then(response => response.json())
        .then(action => app.setState({year_data: action.all}) )
        .then(app.setLoadingFlag());
        
    }

}

export default fetcher;