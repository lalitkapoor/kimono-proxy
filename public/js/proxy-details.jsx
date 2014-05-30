/** @jsx React.DOM */

var ProxyDetails = React.createClass({
  getInitialState: function () {
    return {}
  }

, componentDidMount: function () {

  }

, startProxy: function () {
     var self = this
    superagent
    .post('/v1/proxies/' + this.props.data.id + '/start')
    .end(function (error, res) {
      if (error) return alert('Sorry! An error ocurred trying to start your proxy'), console.error(error)
      alert('proxy loaded, click on go to proxy')
      self.props.data.port = res.body.port
      self.setProps(self.props)
    })

    alert('if this is your first time launching your proxy it may take a minute.')
  }

, stopProxy: function () {

  }

, render: function () {
    var proxyUrl = window.location.protocol+'//'+window.location.hostname+':'+this.props.data.port
    var middlewareNodes = this.props.data.middleware.map(function (middleware, idx) {
      return ProxyMiddleware({data: middleware})
    })
    return (
      <div className="proxy-details">
        <div className="url">{this.props.data.url}</div> <br />
        <div className="proxy">
          <a target="_blank" href={proxyUrl}>go to proxy</a>
        </div>

        <br />

        <div className="status">
          <button type="button" className="remove-middleware-from-proxy btn btn-success btn-sm" onClick={this.startProxy}>
            <span className="glyphicon glyphicon-play"></span>&nbsp; start
          </button>&nbsp;
          <button type="button" className="remove-middleware-from-proxy btn btn-warning btn-sm">
            <span className="glyphicon glyphicon-refresh"></span>&nbsp; restart
          </button>&nbsp;
          <button type="button" className="remove-middleware-from-proxy btn btn-danger btn-sm">
            <span className="glyphicon glyphicon-stop"></span>&nbsp; stop
          </button>
        </div>

        <br />

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