import { PageHeader, Card, Col, Row, List, } from 'antd'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import _ from 'lodash'

export default function News() {
    const [list, setList] = useState([])
    useEffect(()=>{
        axios('/news?publishState=2&_expand=category').then(res=>{
            // console.log(Object.entries( _.groupBy(res.data,item=>item.category.title)))
            setList(Object.entries( _.groupBy(res.data,item=>item.category.title)))
        })
    },[])
  return (
    <div style={{width:"95%",margin:"0 auto"}}>
        <PageHeader
            className="site-page-header"
            title="News"
            subTitle="View The News"
        />
         <Row gutter={[16,16]}>
            {
                list.map(item=>
                    <Col span={8} key={item[0]}>
                        <Card title={item[0]} bordered={false} hoverable={true}>
                            <List
                                header={<div>Header</div>}
                                footer={<div>Footer</div>}
                                bordered
                                dataSource={item[1]}
                                pagenation={{pageSize:3}}
                                renderItem={data => (
                                    <List.Item>
                                        <a href={`/detail/${data.id}`}>{data.title}</a>
                                        
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                )
            }
            </Row>
    </div>
  )
}
