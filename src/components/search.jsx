import React from 'react';
import {Layout, Icon, Input, Spin, Tag} from 'antd';
import { Link } from 'react-router-dom';
import ResultBookItem from './resultBookItem';
import styles from '../styles/search.less';
import template from './template';
import storejs from 'store/dist/store.legacy';
import randomcolor from 'randomcolor';

const { Header, Content } = Layout

class Search extends React.Component{
  constructor(props) {
    super(props)
    
    this.state = {
      searchValue: this.props.fetchBookList.name,
      bookList: this.props.fetchBookList.books,
      loading: false,
      searchHistory: storejs.get('searchHistory') || []
    };
    this.flag = this.state.searchValue.length ? false : true; 

    this.tagColorArr = this.state.searchHistory.map(item => randomcolor({luminosity: 'dark'}));
    this.clearHistory = () => {
      let searchHistory = [];
      this.setState({searchHistory});
      storejs.set('searchHistory', searchHistory);
    }

    this.searchBook = (value) => {
      this.flag = false;
      value = value === undefined ? this.state.searchValue : value;
      if (new Set(value).has(' ') || value === '') {
        alert('宝贝儿！别输入空格或者空哦！');
        return;
      };
      //更新搜索历史
      let searchHistory = new Set(this.state.searchHistory);
      if (!searchHistory.has(value)) {
        searchHistory = this.state.searchHistory;
        searchHistory.unshift(value);
        storejs.set('searchHistory', searchHistory);
      }
      

      this.tagColorArr.push(randomcolor({luminosity: 'dark'}));
      
      this.setState({loading: true, searchHistory});
      this.props.getBookList(value);
    }

    this.clearInput = () => {
      this.flag = true;
      this.setState({searchValue:''});
    }

    this.wordSearch = (e) => {
      let word = e.target.textContent;
      this.setState({searchValue: word});
      this.searchBook(word);
    }

    this.handleChange = (e) => {
      this.setState({searchValue:e.target.value});
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({bookList: nextProps.fetchBookList.books, searchValue: nextProps.fetchBookList.name, loading: false});
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
              onChange={this.handleChange}
              onPressEnter={ () => this.searchBook()}
              suffix={<Icon type="close-circle" onClick={this.clearInput} />}
            />
            <Icon type='search' className={styles.search} onClick={() => this.searchBook()}/>
          </Header>
          <Spin className='loading' spinning={this.state.loading} tip="书籍搜索中...">
          <Content className={styles.content}>
            {
              this.flag ? (
                <div className={styles.tagBox}>
                  <h1>最近搜索历史</h1>
                    <div className={styles.tags}>
                      {
                        this.state.searchHistory.map((item, index) =>
                          <Tag onClick={this.wordSearch} className={styles.tag} color={this.tagColorArr[index]} key={index}>{item}</Tag>
                        )
                      }
                    </div>
                  <div className={styles.clear} onClick={this.clearHistory}><Icon type="delete" />清空搜索历史</div>
                </div>
              )
              :
              (
                this.state.bookList.length !== 0 ?
                this.state.bookList.map((item, index) => <ResultBookItem data={item} key={index}/>)
                : (<div className={styles.noResult}>没有找到搜索结果</div>)
              )
            }
          </Content>
          </Spin>
        </Layout>
      </div>
    )
  }
}

export default template(Search);