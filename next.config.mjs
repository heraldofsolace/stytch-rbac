/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: true,
            },
        ];
    }
};

export default nextConfig;
