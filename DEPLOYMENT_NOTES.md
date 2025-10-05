🚀 Deploying Next.js 15 Static Site to AWS S3
🧩 1. Purpose

This document explains how I configured and deployed my Next.js 15 app (v0-resume) as a static site hosted on Amazon S3.

⚙️ 2. Configure Next.js for Static Export

In Next.js 15, the next export command was removed.
The new approach is to use output: 'export' in the next.config.js file.

Here’s my final config:

/** @type {import('next').NextConfig} */
const nextConfig = {
// Skip ESLint during build to prevent build failures on minor lint errors
eslint: {
ignoreDuringBuilds: true,
},

// Generate static HTML files instead of using a Node.js server
output: 'export',

// Allow TypeScript build to continue even if type errors exist
typescript: {
ignoreBuildErrors: true,
},

// Disable Next.js Image Optimization API since it's not supported on static sites
images: {
unoptimized: true,
},
}

export default nextConfig


After saving this file, I ran:

yarn build


This generated a fully static site in the /out directory.

☁️ 3. Create and Configure S3 Bucket

Logged in to AWS Management Console → S3

Clicked “Create bucket”

Named it my-nextjs-resume-site

Disabled “Block all public access”

Created the bucket

Then enabled Static Website Hosting:

Go to Properties → Static website hosting

Enable and set:

Index document: index.html

Error document: index.html or 404.html

After saving, AWS provided a website URL like:

http://my-nextjs-resume-site.s3-website-af-south-1.amazonaws.com

🔐 4. Make Bucket Public

Added this Bucket Policy to allow public read access:

{
"Version": "2012-10-17",
"Statement": [
{
"Sid": "PublicReadGetObject",
"Effect": "Allow",
"Principal": "*",
"Action": ["s3:GetObject"],
"Resource": ["arn:aws:s3:::my-nextjs-resume-site/*"]
}
]
}

📤 5. Upload Static Files

Using the AWS CLI, I uploaded my exported files:

aws s3 sync ./out s3://my-nextjs-resume-site --delete


./out → Folder containing my static build

--delete → Removes old files not present in the latest build

🌍 6. Verify Deployment

Opened the S3 website URL and confirmed the site loaded successfully.
All pages were prerendered, and no API server was needed.

🧠 7. Optional: Automate Deployment

You can add a custom Yarn script in package.json:

"scripts": {
"build": "next build",
"deploy:s3": "yarn build && aws s3 sync ./out s3://my-nextjs-resume-site --delete"
}


Then just run:

yarn deploy:s3

✅ Summary
Step	Description
1	Configure next.config.js for static export
2	Run yarn build to generate static site
3	Create and configure S3 bucket
4	Enable public read access
5	Upload static files
6	Visit S3 website endpoint