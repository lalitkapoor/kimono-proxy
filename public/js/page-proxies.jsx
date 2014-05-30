/** @jsx React.DOM */

var PageProxies = React.createClass({
  getInitialState: function () {
    return {}
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
          <Proxies />
        </div>
        <div className="col-xs-7 col-md-7">
          <h2>Details</h2>
          <div id="proxy-details-container" />
        </div>
      </div>
    )
  }
})