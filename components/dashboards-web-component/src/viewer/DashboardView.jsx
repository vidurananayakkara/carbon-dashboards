/*
 *  Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

import React from 'react';

import AppBar from 'material-ui/AppBar/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Drawer from 'material-ui/Drawer';

import DashboardRenderingComponent from '../utils/DashboardRenderingComponent';
import PagesNavigationPanel from '../designer/components/PagesNavigationPanel';
import DashboardsAPIs from '../utils/apis/DashboardAPIs';
import DashboardUtils from '../utils/DashboardUtils';

const muiTheme = getMuiTheme(darkBaseTheme);

let config = {
    settings: {
        hasHeaders: false,
        constrainDragToContainer: false,
        reorderEnabled: false,
        selectionEnabled: false,
        popoutWholeStack: false,
        blockedPopoutsThrowError: true,
        closePopoutsOnUnload: true,
        showPopoutIcon: false,
        showMaximiseIcon: false,
        responsive: true,
        isClosable: false,
        responsiveMode: 'always',
        showCloseIcon: false,
    },
    dimensions: {
        minItemWidth: 400,
    },
    isClosable: false,
    content: []
};

class DashboardView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageId: this.props.match.params.pageId,
            toggled: "toggled",
            dashboardViewCSS: "dashboard-view",
            dashboardContent: [],
            open: true,
            contentClass: "content-drawer-opened"
        };
        this.togglePagesNavPanel = this.togglePagesNavPanel.bind(this);
        this.setDashboardProperties = this.setDashboardProperties.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        this.setState({
            open: !this.state.open,
            contentClass: this.state.open ? "content-drawer-closed" : "content-drawer-opened"
        });
        var that = this;
        setTimeout(function () {
            that.dashboardRenderingComponent.updateLayout();
        }, 100);
    }

    componentDidMount() {
        let dashboardsAPis = new DashboardsAPIs();
        let promised_dashboard = dashboardsAPis.getDashboardByID(this.props.match.params.id);
        promised_dashboard.then(this.setDashboardProperties).catch(function (error) {
            //TODO Need to use proper notification library to show the error
        });
    }

    setDashboardProperties(response) {
        this.setState({
            dashboardName: response.data.name,
            dashboardContent: (JSON.parse(response.data.pages)),
            landingPage: response.data.landingPage
        });
    }

    togglePagesNavPanel(toggled) {
        if (toggled) {
            this.setState({toggled: "toggled", dashboardViewCSS: "dashboard-view"});
        } else {
            this.setState({toggled: "", dashboardViewCSS: "dashboard-view-full-width"});
        }
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <Drawer open={this.state.open}>
                        <PagesNavigationPanel dashboardId={this.props.match.params.id}
                                              dashboardContent={this.state.dashboardContent}
                                              dashboardName={this.state.dashboardName}
                                              toggled={this.state.toggled}
                                              match={this.props.match}/>
                    </Drawer>
                    <div className={this.state.contentClass}>
                        <AppBar
                            title={this.props.dashboardName}
                            iconClassNameRight="muidocs-icon-navigation-expand-more"
                            onLeftIconButtonTouchTap={this.handleToggle}
                        />
                        <div id="dashboard-view" className={this.state.dashboardViewCSS}></div>
                        <DashboardRenderingComponent config={config} ref={(c) => {
                            this.dashboardRenderingComponent = c;
                        }}
                        dashboardContent={new DashboardUtils().getDashboardByPageId(this.props.match.params[1],
                            this.state.dashboardContent, this.state.landingPage)}/>

                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default DashboardView;