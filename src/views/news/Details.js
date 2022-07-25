import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import moment from 'moment'
import {HeartTwoTone, } from '@ant-design/icons'
export default function Detail() {
    const { id } = useParams();
    const [newsInfo, setNewsInfo]= useState(null)
    useEffect(()=>{
        // console.log(id)
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res=>{
        setNewsInfo({
            ...res.data,
            view:res.data.view+1
        })
        return res.data
    }).then(res=>{
        axios.patch(`/news/${id}?_expand=category&_expand=role`,{
            view:res.view+1
        })
    })
},[id])
    const handleStar = ()=>{
        setNewsInfo({
            ...newsInfo,
            star:newsInfo.star+1
        })
        axios.patch(`/news/${id}?_expand=category&_expand=role`,{
            star:newsInfo.star+1
        })
    }
  return (
    <div>
        {
        newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<div>{newsInfo.category.title}<HeartTwoTone twoToneColor="#eb2f96" onClick={()=>handleStar()}/></div>}
                        >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="Author">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="Effective Time">{newsInfo.publishTime 
                                                        ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss")
                                                        : "-"
                                                    }</Descriptions.Item>
                            <Descriptions.Item label="Region">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="Visited Amount">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="Likeed Number">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="Comment Amount">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <div dangerouslySetInnerHTML={{
                        __html:newsInfo.content
                    }} style={{
                        padding:"0 24px",
                        border:"1px solid gray"
                    }} >
                        {}
                    </div>
        </div>

        }
    </div>
  )
}
