import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";

import TopNav from "Containers/TopNav";
import Sidebar from "Containers/Sidebar";

import gogo from "./gogo";
import secondMenu from "./second-menu";
import thirdSingle from "./third-single";
import pages from "./pages";
import dashboards from "./dashboards";
import Dashboardx from "./dashboards/default";
import ui from "./ui";
import applications from "./applications";

import { connect } from "react-redux";

class MainApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match, containerClassnames } = this.props;
    return (
      <div id="app-container" className={containerClassnames}>
        <TopNav history={this.props.history} />
        <Sidebar />
        <main>
          <div className="container-fluid">
            <Switch>
          <Route  path="/dashboards/default" component={ Dashboardx } />

              <Route path={`${match.url}/gogo`} component={gogo} />
              <Route path={`${match.url}/second-menu`} component={secondMenu} />
              <Route path={`${match.url}/third-single`} component={thirdSingle} />
              <Route path={`${match.url}/pages`} component={pages} />
              <Route path={`${match.url}/applications`} component={applications} />
							<Route path={`${match.url}/dashboards`} component={dashboards} />
							<Route path={`${match.url}/ui`} component={ui} />
              <Redirect to="/error" />
            </Switch>
          </div>
        </main>
      </div>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(MainApp)
);
