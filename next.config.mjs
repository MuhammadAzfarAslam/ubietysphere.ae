/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ubietysphere.ae",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
