/** @jsx React.DOM */

var Proxies = React.createClass({
  getInitialState: function () {
    return {data: []}
  }

, componentDidMount: function () {

  }

, componentWillMount: function () {
    var self = this
    superagent
    .get('/v1/proxies')
    .end(function (error, res) {
      if (error) return console.error(error)
      self.setState({data: res.body})
    })
  }

, render: function () {
    var proxyNodes = this.state.data.map(function (proxy, index) {
      return Proxy({data: proxy}, proxy.name)
    })

    return <div className="list-group">{proxyNodes}</div>
  }
})