/** @jsx React.DOM */

var ModalCreateProxy = React.createClass({
  getInitialState: function () {
    return {
      data: {
        middleware: []
      , proxyMiddleware: []
      }
    }
  }

, componentDidMount: function () {
    document.querySelector('.add-middleware-to-proxy')
  }

, componentWillMount: function () {
    var self = this
    superagent
    .get('/v1/middleware')
    .end(function (error, res) {
      if (error) return console.error(error)

      self.state.data.middleware = res.body
      self.setState(self.state)
    })
  }

, addMiddlewareToProxy: function (middleware, idx) {
    this.state.data.proxyMiddleware.push(middleware)
    this.setState(this.state)
  }

, removeMiddlewareFromProxy: function (middleware, idx) {
    // really should slice(position in list, 1)
    delete this.state.data.proxyMiddleware[idx]
    this.setState(this.state)
  }

, createProxy: function () {
    var data = $('.create-proxy form').serializeJSON()
    data.middleware = [];

    $('.proxy-middleware-list .proxy-middleware-edit form').each(function (idx, element) {
      var middleware = $(element).serializeJSON()
      middleware.args = JSON.parse("["+middleware.args+"]")
      data.middleware.push(middleware)
    })

    console.log(data)

    superagent
    .post('/v1/proxies')
    .send(data)
    .end(function (error, res) {
      if (error) return alert('Sorry!, an error occurred while creating your proxy.'), console.log(error.stack)
      window.location.reload()
    })
  }

, render: function () {
    var self = this

    var middlewareNodes = this.state.data.middleware.map(function (middleware, idx) {
      var middlewareHandlers = {
        addMiddlewareToProxy: self.addMiddlewareToProxy.bind(self, middleware, idx)
      }
      return <Middleware data={middleware} handlers={middlewareHandlers}/>
    })

    var proxyMiddlewareEditNodes = this.state.data.proxyMiddleware.map(function (middleware, idx) {
      return ProxyMiddlewareEdit({
        data: middleware
      , handlers: {
          removeMiddlewareFromProxy: self.removeMiddlewareFromProxy.bind(self, middleware, idx)
        }
      })
    })

    return (
      <div>
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 className="modal-title" id="modal-title">Create A Proxy</h4>
        </div>
        <div className="modal-body">
          <div className="create-proxy">
            <form className="form-horizontal" role="form">

              <div className="panel panel-info">
                <div className="panel-heading">Basic Details</div>
                <div className="form-group">
                  <label for="name" className="col-sm-2 control-label">name</label>
                  <div className="col-sm-10">
                    <input type="text" name="name" required className="form-control" id="name" placeholder="one-liner" />
                  </div>
                </div>
                <div className="form-group">
                  <label for="url" className="col-sm-2 control-label">url</label>
                  <div className="col-sm-10">
                    <input type="url" name="url" required pattern="https?://.+" className="form-control" id="url" placeholder="full url (with http/https)" />
                  </div>
                </div>
                <div className="form-group">
                  <label for="subdomain" className="col-sm-2 control-label">subdomain</label>
                  <div className="col-sm-10">
                    <input type="text" name="subdomain" required className="form-control" id="subdomain" placeholder="awesome-name-here" />
                  </div>
                </div>
                <div className="form-group">
                  <label for="description" className="col-sm-2 control-label">description</label>
                  <div className="col-sm-10">
                    <input type="text" name="description" required className="form-control" id="description" placeholder="one-liner" />
                  </div>
                </div>
              </div>

              <div className="panel panel-info">
                <div className="panel-heading">Documentation</div>
                <textarea className="form-control" id="documentation" name="documentation" placeholder="markdown here :)"></textarea>
              </div>

            </form>

            <div className="row">
              <div className="col-xs-6 col-md-6">
                <div className="panel panel-info">
                  <div className="panel-heading">Middleware To Choose From</div>
                  <div className="middleware-list list-group">
                    {middlewareNodes}
                  </div>
                </div>
              </div>
              <div className="col-xs-6 col-md-6">
                <div className="panel panel-info">
                  <div className="panel-heading">Proxy Middleware</div>
                  <div className="proxy-middleware-list list-group">
                    {proxyMiddlewareEditNodes}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" className="btn btn-primary" onClick={this.createProxy}>Create</button>
        </div>
      </div>
    )
  }
})