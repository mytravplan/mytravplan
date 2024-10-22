'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';

function UpdateTestimonialVideo() {
    const router = useRouter();
    const { id } = useParams(); // Get the video ID from the URL
    const [videoFile, setVideoFile] = useState(null); // State to handle new video file
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        videoUrl: '', // Existing video URL
    });

    useEffect(() => {
        // Fetch the video details to be updated
        const fetchVideo = async () => {
            try {
                const response = await fetch(`/api/v1/video/get/${id}`);
                const data = await response.json();
                if (data.success) {
                    setFormData({
                        name: data.result.name,
                        description: data.result.description,
                        videoUrl: data.result.videoUrl,
                    });
                } else {
                    toast.error(data.message || 'Failed to fetch video details.');
                }
            } catch (error) {
                toast.error('Error fetching video details.');
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]); // Capture the uploaded video file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('description', formData.description);

        if (videoFile) {
            submissionData.append('video', videoFile); // Include the new video file if uploaded
        }

        try {
            const response = await fetch(`/api/v1/video/update/${id}`, {
                method: 'PUT',
                body: submissionData, // Send the form data with the video file (if present)
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Video updated successfully');
                router.push('/admin/testimonial-videos');
            } else {
                toast.error(data.message || 'Failed to update video.');
            }
        } catch (error) {
            toast.error('Error updating video.');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="update-video-page">
            <h1>Update Testimonial Video</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                
                {/* Display existing video if available */}
                {formData.videoUrl && (
                    <div className="existing-video">
                        <label>Existing Video:</label>
                        <video width="600" controls>
                            <source src={formData.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                <label>
                    Upload New Video (optional):
                    <input
                        type="file"
                        name="video"
                        onChange={handleFileChange}
                        accept="video/*"
                    />
                </label>
                <button type="submit">Update Video</button>
            </form>
        </div>
    );
}

export default UpdateTestimonialVideo;
