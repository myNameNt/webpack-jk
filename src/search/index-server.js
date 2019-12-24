const React = require('react')
require('./search.less')
class Search extends React.Component {
  constructor(){
    super()
  }
  render () {
    return (
      <div className='search'>
        <p>Search</p>
      </div>
    )
  }
}

module.exports = <Search />