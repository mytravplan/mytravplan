import Layout from '@/app/_common/layout/layout'
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import React from 'react'

export default async function page() {
  // Fetching privacy policy data
  let api = EXPORT_ALL_APIS();
  let resp = await api.fetchPrivacyPolicy();

  
  let data = Array.isArray(resp?.result) && resp?.result.length > 0 ? resp.result[0] : [];

  return (
    <>
      <Layout>
        <div className="privacy_outer">
          <div className="privacy_inner">
            
            {data?.privacydata === undefined ? 'No result found' : (
              data?.privacydata?.map((ele, index) => (
                <div className="privacy-policy-container" key={index}>
                  <h2>{ele?.title}</h2>
                  <p>{ele?.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
