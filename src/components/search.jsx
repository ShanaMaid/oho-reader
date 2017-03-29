import React from 'react';
import {Layout, Icon, Input } from 'antd'
import { Link } from 'react-router-dom'
import ResultBookItem from './resultBookItem'
import styles from '../styles/search.less'
import template from './template'

const { Header, Content } = Layout
class Search extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      searchValue: this.props.fetchBookList.name,
      bookList: this.props.fetchBookList.books
    }
    this.searchBook = () => {
      this.props.search(this.state.searchValue)
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({bookList: nextProps.fetchBookList.books, searchValue: nextProps.fetchBookList.name})
  }

  handleChange(e) {
    this.setState({searchValue:e.target.value});
  }


  render() {
    return (
      <div className="page" ref="search">
        <Layout >
          <Header className={styles.header}>
            <Link to="/"><Icon type="arrow-left" className={styles.pre}/></Link>
            <Input
              ref="search"
              placeholder="请输入搜索的书名"
              className={styles.searchInput}
              value={this.state.searchValue}
              onChange={this.handleChange.bind(this)}
              onPressEnter={this.searchBook}
            />
            <Icon type="search" className={styles.search} onClick={this.searchBook}/>
          </Header>
          <Content className={styles.content}>
            {
              this.state.bookList.length != 0 ? 
              this.state.bookList.map((item) => <ResultBookItem data={item}/>) 
              : '没有找到搜索结果'}
          </Content>
        </Layout>
      </div>
    )
  }
}

export default template(Search);