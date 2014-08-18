var React = require('react');

var {floor, random} = Math;
var rando = (a)=> a[floor(random() * a.length)];

require('./style.less');

var DEMFEELS = [
  '\u2665',
  '\u2620',
  'swords',
  'sarcasm',
  'frivolity',
  'teen angst',
  'despondence',
  'street wisdom',
  'the gift of gab',
  'child-like wonder',
  'reckless disregard',
  'jorts and a bro tank',
  'lingering insecurities',
  'way too much free time',
  'a penchant for buffoonery',
  'duct tape and bailing wire',
  'blue oyster cult on repeat',
  'a healthy distrust of The Man',
  'the soundtrack from Teen Wolf'
];

var datfeel = rando(DEMFEELS);

var Footer = React.createClass({
  render: function() {
    return <div className='footer'>
      <hr />
      <div className='container-fluid'>
        <p className='text-muted small'>
          <a href='https://github.com/aaronj1335/irked' className='pull-right'>
            View source &raquo;
          </a>

          Made with <span className='label label-default'>{datfeel}</span>
          {' by '}<a href='https://twitter.com/aaronj1335'>@aaronj1335</a>
        </p>
      </div>
    </div>;
  }
});

module.exports = Footer;
