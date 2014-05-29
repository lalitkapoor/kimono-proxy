/** @jsx React.DOM */

var ProxyDetails = React.createClass({
  getInitialState: function () {
    return {}
  }

, componentDidMount: function () {

  }

, render: function () {
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

        <MiddlewareList
          data = {this.props.data.middleware}
        />
      </div>
    )
  }
})