import { Table,  } from 'antd'
import React from 'react'
export default function NewsPublish(props) {
  const columns = [
    {
      title: 'title',
      dataIndex: 'title',
      render:(title,item)=>{
        return <a href={`/news-manage/preview/${item.id}`} >{title}</a>
      }
    },{
      title: 'author',
      dataIndex: 'author',
    },{
      title: 'category',
      dataIndex: 'category',
      render:(category)=>{
        return category.title
      }
    },{
      title: 'operation',
      render:(item)=>{
        return <div>
          {props.button(item.id)}
        </div>
      }
    },
  ];
  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} 
      pagination={{
        pageSize:5,
      }}
      rowKey={item=>item.id}
      />
    </div>
  ) 
}
