/** @jsx React.DOM */

var ProxyMiddlewareEdit = React.createClass({
  getInitialState: function () {
    return {}
  }

, componentDidMount: function () {

  }

, removeMiddlewareFromProxy: function (event) {
    console.log(arguments)
    this.props.handlers.removeMiddlewareFromProxy(this, event)
  }

, render: function () {
    return (
      <a className="list-group-item proxy-middleware-edit">
        <form>
          <input type="hidden" name="repo" value={this.props.data.repo} />
          <input type="hidden" name="type" value={this.props.data.type} />
          <input type="text" name="collection" className="collection form-control" placeholder="collection" />
          <input type="text" name="field" className="field form-control" placeholder="field name" />
          <input type="text" name="args" className="args form-control" placeholder="arguments comma separated" />
        </form>

        <span className="badge alert-warning type">{this.props.data.type}</span>
        <p className="repo">{this.props.data.repo}</p>
        <p className="description">{this.props.data.description}</p>
        <button type="button" className="remove-middleware-from-proxy btn btn-danger btn-sm" onClick={this.removeMiddlewareFromProxy}>
          <span className="glyphicon glyphicon-minus"></span>&nbsp; remove
        </button>
      </a>
    )
  }
})