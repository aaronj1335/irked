var React = require('react');
var {Link} = require('react-router');

var {datetime, time} = require('./../../util/format');

var Message = React.createClass({
  render: function() {
    var date = new Date(this.props.date);

    return (
      <tr className='message'>
        <td className='date' title={datetime(date)}>
          <Link to='message' date={date.toISOString()}>
            {time(date)}
          </Link>
        </td>

        <td className='from'>
          {this.props.from}
        </td>

        <td className='message'>
          {this.props.message}
        </td>
      </tr>
    );
  }
});

module.exports = Message;
