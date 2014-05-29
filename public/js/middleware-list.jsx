/** @jsx React.DOM */

var MiddlewareList = React.createClass({
  getInitialState: function () {
    return {}
  }

, componentDidMount: function () {

  }

, render: function () {
    var middlewareNodes = this.props.data.map(function (middleware, index) {
      return Middleware({data: middleware})
    })
    return (
      <div>
        <div>{this.props.data.documentation}</div>
        <div className="panel panel-info">
          <div className="panel-heading">Middleware</div>
          <div className="list-group">
            {middlewareNodes}
          </div>
        </div>
      </div>
    )
  }
})