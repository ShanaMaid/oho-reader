import 'normalize.css'
import React from 'react';
// import 'antd/dist/antd.css';
import {Input, Layout, Menu, Dropdown, Button, Icon} from 'antd';
import BookItem from './bookItem';
import styles from '../styles/main.css';

import '../styles/common.css'


const Search = Input.Search;
const { Header, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.bookList = [];
    this.menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="http://www.alipay.com/">向日葵与薄荷草</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="http://www.taobao.com/"><Icon type="setting"/>设置</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="http://www.tmall.com/">关于</a>
        </Menu.Item>
      </Menu>
    );
  }
 
  componentWillMount() {
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
    this.bookList.push(<BookItem/>);
  }

  render() {
    return (
      <div>
        <Layout>
          <Header className={styles.header}>
            <span className={styles.title}>oho阅读</span>
            <Dropdown 
              overlay={this.menu} 
              placement="bottomRight" 
              trigger={['click']}
              >
              <img src="../images/menu.png" className={styles.dropdown}/>
            </Dropdown>
            <Icon type="search" className={styles.search}/>
          </Header>
          <Content className={styles.content}>
            {this.bookList}
          </Content>
        </Layout>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
