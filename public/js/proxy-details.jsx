/** @jsx React.DOM */

var ProxyDetails = React.createClass({
  getInitialState: function () {
    return {}
  }

, componentDidMount: function () {

  }

, render: function () {
    var middlewareNodes = this.props.data.middleware.map(function (middleware, idx) {
      return ProxyMiddleware({data: middleware})
    })
    return (
      <div className="proxy-details">
        <div className="url">{this.props.data.url}</div> <br />

        <div className="panel panel-info">
          <div className="panel-heading">Documentation</div>
          <div className="panel-body">
            <div className="documentation"
              dangerouslySetInnerHTML={{__html: marked(this.props.data.documentation || '')}}
            />
          </div>
        </div>

        <div>
          <div className="panel panel-info">
            <div className="panel-heading">{this.props.heading || 'Middleware'}</div>
            <div className="list-group">
              {middlewareNodes}
            </div>
          </div>
        </div>
      </div>
    )
  }
})