var React = require('react');
var {Link} = require('react-router');

var {datetime, time} = require('./../../util/format');

var urlRe = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

var Message = React.createClass({
  _linkifyMessage: function() {
    var urls = this.props.message.match(urlRe);
    var without = this.props.message.split(urlRe);
    var parts = [];

    without.forEach(function(chunk, i) {
      if (chunk)
        parts.push(chunk);

      if (urls && urls[i])
        parts.push(<a href={urls[i]}>{urls[i]}</a>);
    });

    return parts;
  },

  render: function() {
    var date = new Date(this.props.date);

    return (
      <tr className={'message ' + this.props.className}>
        <td className='date' title={datetime(date)}>
          <Link to='message' date={date.toISOString()}>
            {time(date)}
          </Link>
        </td>

        <td className='from'>
          {this.props.from}
        </td>

        <td className='message'>
          {this._linkifyMessage()}
        </td>
      </tr>
    );
  }
});

module.exports = Message;
