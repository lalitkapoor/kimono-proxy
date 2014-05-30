/** @jsx React.DOM */

var Proxy = React.createClass({
  getInitialState: function () {
    return {}
  }

, componentDidMount: function () {

  }

, handleClick: function (event) {
    React.renderComponent(
      ProxyDetails(this.props)
    , document.getElementById('proxy-details-container'))
  }

, render: function () {
    var statusColor = "";
    if (this.props.data.status === 'stopped') statusColor = 'alert-danger'
    if (this.props.data.status === 'stopping') statusColor = 'alert-warning'
    if (this.props.data.status === 'starting') statusColor = 'alert-warning'
    if (this.props.data.status === 'running') statusColor = 'alert-success'

    return (
      <a className="list-group-item proxy" onClick={this.handleClick}>
        <span className={"type badge " + statusColor}>{this.props.data.status}</span>
        <h4 className="name">{this.props.data.name}</h4>
        <p className="description">{this.props.data.description}</p>
      </a>
    )
  }
})