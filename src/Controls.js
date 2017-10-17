import React, { Component } from 'react';
import './css/Controls.css';
import {MuiThemeProvider, SelectField, MenuItem, RaisedButton,TextField} from 'material-ui';

// Needed for onTouchTap (to avoid warning from material-ui)
// See: https://github.com/callemall/material-ui/issues/4670
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const style = {
    margin: 12,
    };

const pantsbuild_repos = [
    'pants',
    'intellij-pants-plugin',
    'pex'
];
      
const menuItems = (values) => {
    return values.map((name) => (
        <MenuItem
            key={name}
            value={name}
            primaryText={name}
        />
    ));
}
// Scatterplot component
class Controls extends Component{
	render() {
		return (
            <MuiThemeProvider>
                <div className="controls"> 
                    <p> This is a protoype so you will have to reload the page if owner/repo is not correct </p>
                    <TextField id="search"
                        hintText="Enter <owner>/<repo>"
                        onKeyPress={(ev) => {
                                console.log(`Pressed keyCode ${ev.key}`);
                                if (ev.key === 'Enter') {
                                    this.props.search(ev.target.value);
                                    ev.preventDefault();
                                }
                            }}
                    />
                    <SelectField
                        floatingLabelText="Pantsbuild Repo:"
                        value={this.props.repo}
                        onChange={this.props.changeRepo}
                    >
                    {menuItems(pantsbuild_repos)}
                    </SelectField>
                    <RaisedButton onClick={this.props.savePdf} label="Download Visualizations" primary={true} style={style} />
                </div>

            </MuiThemeProvider>
		);
	}
};

export default Controls;
