/** @jsx React.DOM */

React.renderComponent(
  <div className="row">
    <div className="col-xs-5 col-md-5">
      <h2>Proxies</h2>
      <Proxies />
    </div>
    <div className="col-xs-7 col-md-7">
      <h2>Details</h2>
      <div id="proxy-details-container" />
    </div>
  </div>
, document.getElementById('container')
)