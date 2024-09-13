export async function LoadscoData({data}) {
    
    const metadata = {
        title: data.sco_title || 'no title',
        description: data.sco_description || 'no description' 
    };
    return metadata;
}