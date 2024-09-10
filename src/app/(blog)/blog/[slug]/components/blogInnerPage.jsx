
'use client'
import React, { useEffect, useState } from 'react'
import Topbanner from "@/app/_common/layout/topbanner";
import Layout from "@/app/_common/layout/layout";

import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import Bloggallery from './overview';

function BlogInnerPageSlug({ slug }) {
    let [data, setData] = useState([])
    let api = EXPORT_ALL_APIS()

    let fetchBlogInnerPage = async () => {
        let resp = await api.loadSingleBlog(slug)
        setData(resp)
    }

    useEffect(() => {
        fetchBlogInnerPage()
    }, [])
    return (
        <div>
            <Layout>
                <Topbanner slug={slug} />
                <Bloggallery data={data} />
            </Layout>
        </div>
    );
}
export default BlogInnerPageSlug
