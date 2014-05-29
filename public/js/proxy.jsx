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
    return (
      <a className="list-group-item proxy" onClick={this.handleClick}>
        <h4 className="name">{this.props.data.name}</h4>
        <p className="description">{this.props.data.description}</p>
      </a>
    )
  }
})