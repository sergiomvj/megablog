import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WP_API_URL = process.env.WP_API_URL;
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

if (!WP_API_URL || !WP_USER || !WP_APP_PASSWORD) {
    console.error("Missing WordPress Configuration in .env");
}

const authHeader = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');

export const WordPressService = {
    /**
     * Test connection to WordPress REST API
     */
    async checkConnection(): Promise<{ success: boolean; message: string; user?: any }> {
        try {
            // Try to fetch current user details to validate credentials
            const response = await axios.get(`${WP_API_URL}/wp/v2/users/me`, {
                headers: {
                    'Authorization': authHeader
                }
            });

            if (response.status === 200) {
                return {
                    success: true,
                    message: `Connected successfully as ${response.data.name}`,
                    user: response.data
                };
            }
            return { success: false, message: `Unexpected status: ${response.status}` };

        } catch (error: any) {
            console.error("WordPress Connection Error:", error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    },

    /**
     * Send a job result to the WordPress Plugin
     */
    async publishJob(jobId: string, blogId: number, postData: any, idempotencyKey?: string) {
        try {
            const payload = {
                job_id: jobId,
                blog_id: blogId,
                idempotency_key: idempotencyKey,
                post: postData
            };

            const response = await axios.post(`${WP_API_URL}/autowriter/v1/jobs`, payload, {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;

        } catch (error: any) {
            console.error(`Failed to publish job ${jobId} to blog ${blogId}:`, error.response?.data || error.message);
            throw new Error(`WordPress Publish Error: ${error.response?.data?.message || error.message}`);
        }
    }
};
