
/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { 
                        key: "Access-Control-Allow-Origin", 
                        value: "https://auth.otpless.app"  
                    },
                    { 
                        key: "Access-Control-Allow-Origin", 
                        value: "https://marketing.otpless.app"  
                    },
                    { 
                        key: "Access-Control-Allow-Origin", 
                        value: "https://mytravplan.com"  
                    },
                    { 
                        key: "Access-Control-Allow-Origin", 
                        value: "https://www.mytravplan.com"  
                    },
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { 
                        key: "Access-Control-Allow-Headers", 
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" 
                    },
                ],
            },
        ];
    },
    
    async rewrites() {
        return [
            {
                source: "/uploads/:path*",
                destination: "/uploads/:path*",  
            },
        ];
    },
};

export default nextConfig;

