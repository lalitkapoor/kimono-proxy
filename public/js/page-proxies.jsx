/** @jsx React.DOM */

var PageProxies = React.createClass({
  getInitialState: function () {
    return {data: []}
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

, componentDidMount: function () {

  }

, handleCreateProxy: function () {
    React.renderComponent(
      <ModalCreateProxy />
    , document.querySelector('#modal .modal-content')
    )
    $('#modal').modal()
    .on('hidden.bs.modal', function (event) {
      document.querySelector('#modal .modal-content').innerHTML = ""
    })
  }

, render: function () {
    var proxyNodes = this.state.data.map(function (proxy, index) {
      return Proxy({data: proxy}, proxy.name)
    })

    return (
      <div className="row">
        <div className="col-xs-5 col-md-5">
          <h2>
            Proxies
            <button type="button" className="btn btn-primary btn-sm add-proxy-button" onClick={this.handleCreateProxy}>
              <span className="glyphicon glyphicon-plus"></span>&nbsp;
              new
            </button>
          </h2>
          <div className="list-group">
            {proxyNodes}
          </div>
        </div>
        <div className="col-xs-7 col-md-7">
          <h2>Details</h2>
          <div id="proxy-details-container" />
        </div>
      </div>
    )
  }
})