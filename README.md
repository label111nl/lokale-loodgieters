# Local Plumbers (Lokale Loodgieters)

Quickly and easily find a reliable plumber in your area!

## About the Platform

Local Plumbers is a platform that connects customers with qualified plumbers in their region. Customers can easily request quotes for various plumbing services, and plumbers can offer their services and acquire new customers. The platform utilizes AI-driven features to prioritize leads, match plumbers with customers, and generate content.

## Key Features

**For Customers:**

* **Request Quotes:** Fill out a detailed form and receive quotes from plumbers in your area within 24 hours.
* **Search Plumbers:** Find plumbers based on location, specialization, and ratings.
* **View Profiles:** Learn more about each plumber's experience and expertise.
* **Read Reviews:** View ratings from other customers to make the best choice.

**For Plumbers:**

* **Create Profile:** Present your business and services to potential customers.
* **Receive Leads:** Get access to new leads in your region.
* **Quote Management:** Respond to quote requests and send price estimates.
* **Credit System:** Pay per lead or choose a subscription.
* **Dashboard:** Manage your leads, quotes, and profile.

**For Administrators:**

* **User Management:** Manage all user accounts (plumbers and customers).
* **Content Management:** Manage the website content, including blog posts and FAQs.
* **AI Management:** Configure and manage AI-driven features.
* **System Settings:** Manage the general settings of the platform.

## Technologies

* **Frontend:** Next.js, React, Tailwind CSS, Shadcn/UI, Lucide React Icons
* **Backend:** Next.js API Routes, Supabase (Database & Authentication)
* **AI:** OpenAI GPT-4, AI SDK
* **Payments:** Stripe
* **Notifications:** Resend, Telegram
* **Hosting:** VPS (Virtual Private Server)

## Installation

1. Clone the repository: `git clone https://github.com/your-username/local-plumbers.git`
2. Install dependencies: `npm install`
3. Configure environment variables (see `.env.example`).
4. Start the development server: `npm run dev`

## Deployment

The platform is hosted on a VPS. Follow these steps to deploy:

1. Set up a VPS with your preferred provider (e.g., DigitalOcean, Linode, AWS EC2).
2. Install Node.js, npm, and PM2 on your VPS.
3. Clone the repository on your VPS.
4. Install dependencies: `npm install`
5. Build the application: `npm run build`
6. Start the application using PM2: `pm2 start npm --name "local-plumbers" -- start`
7. Set up a reverse proxy (e.g., Nginx) to forward requests to your Node.js application.
8. Configure SSL using Let's Encrypt for secure HTTPS connections.

For detailed deployment instructions, refer to the deployment guide in the `docs` folder.

## Database Setup

This project uses Supabase as the database. To set up your database:

1. Create a Supabase account and project.
2. Run the migration scripts located in the `supabase/migrations` folder.
3. Update your `.env` file with the Supabase URL and API keys.

## Contributing

Contributions to the project are welcome! Fork the repository and submit a pull request with your changes.

## Contact

For questions or support, please contact info@lokaleloodgieters.nl.
