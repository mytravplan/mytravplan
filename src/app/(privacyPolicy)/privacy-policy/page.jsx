import Layout from '@/app/_common/layout/layout'
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import React from 'react'

async function PrivacyPolicy() {
  let api=EXPORT_ALL_APIS()
  let resp=await api.fetchPrivacyPolicy()
  let data=resp.result[0]||[]
  return (
    <>
    <Layout>
      <div className="privacy_outer">
        <div className="privacy_inner">

      {data?.privacydata?.map((ele,index)=>{
        return  <div className="privacy-policy-container"  key={index}>
          <h2>{ele?.title}</h2>
          <p>{ele?.description}</p>

        </div>
      })}
        </div>

      </div>
    
    </Layout>
    </>
  )
}

export default PrivacyPolicy