import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import moment from 'moment'
export default function NewsPreview() {
    const { id } = useParams();
    const [newsInfo, setNewsInfo]= useState(null)
    useEffect(()=>{
        // console.log(id)
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res=>{
        setNewsInfo(res.data)
    })},[id])
    const auditList = ["未审核", '审核中', '已通过', '未通过']
    const publishList = ["未发布", '待发布', '已上线', '已下线']
    const colorList = ["black", 'orange', 'green', 'red']
  return (
    <div>
        {
        newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                        >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="Author">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="Publish Time">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                            <Descriptions.Item label="Effective Time">{newsInfo.publishTime 
                                                        ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss")
                                                        : "-"
                                                    }</Descriptions.Item>
                            <Descriptions.Item label="Region">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="Audit State"><span style={{ color: colorList[newsInfo.auditState]}}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="Publish State"><span style={{ color: colorList[newsInfo.publishState]}}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
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
