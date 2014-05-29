/** @jsx React.DOM */

var UserGist = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      lastGistUrl: ''
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      var lastGist = result[0];
      this.setState({
        username: lastGist.owner.login,
        lastGistUrl: lastGist.html_url
      });
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        {this.state.username}&#39;s last gist is
        <a href={this.state.lastGistUrl}>here</a>.
      </div>
    );
  }
});