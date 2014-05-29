/** @jsx React.DOM */

var Middleware = React.createClass({
  getInitialState: function () {
    return {}
  }

, componentDidMount: function () {

  }

, render: function () {
    return (<a className="list-group-item middleware">
      <span className="element">{this.props.data.collection}.{this.props.data.field}</span>
      <span className="badge alert-warning type">{this.props.data.type}</span>
      <p className="repo">{this.props.data.repo}</p>
    </a>)
  }
})