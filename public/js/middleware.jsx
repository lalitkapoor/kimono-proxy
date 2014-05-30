/** @jsx React.DOM */

var Middleware = React.createClass({
  getInitialState: function () {
    return {}
  }

, componentDidMount: function () {

  }

, addMiddlewareToProxy: function (event) {
    this.props.handlers.addMiddlewareToProxy(this, event)
  }

, render: function () {
    return (
      <a className="list-group-item middleware">
        <span className="badge alert-warning type">{this.props.data.type}</span>
        <span className="repo">{this.props.data.repo}</span>
        <p className="description">{this.props.data.description}</p>
        <div>
          <button type="button" className="add-middleware-to-proxy btn btn-primary btn-sm" onClick={this.addMiddlewareToProxy}>
            <span className="glyphicon glyphicon-plus"></span>&nbsp; add
          </button>
        </div>
      </a>
    )
  }
})