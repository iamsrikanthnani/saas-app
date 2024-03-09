# 🚀 SaaS Boilerplate

This is a SaaS boilerplate built using Next.js 14, Clerk, and MongoDB.

## 🛠️ Getting Started

### Step 1: Clone the repository

```bash
git clone https://github.com/iamsrikanthnani/saas-app.git
```

### Step 2: Navigate into the project directory

```bash
cd saas-app
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Set up environment variables

```bash
cp .env.example .env
```

Fill in the following environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk Publishable Key. Get this from [clerk dashboard](https://dashboard.clerk.com/).
- `CLERK_SECRET_KEY`: Your Clerk Secret Key. Get this from [clerk dashboard](https://dashboard.clerk.com/).
- `MONGODB_HOST`: Your MongoDB host URL.

### Step 5: Set up Clerk webhooks

- Go to the [clerk dashboard](https://dashboard.clerk.com/) and on the sidebar click on `webhooks`, and click `add endpoint`.
- Enable the following webhook events: `user.created`, `user.deleted`, `user.updated`.
- Set the Endpoint URL as: `https://[your-deployed-url]/api/webhooks/user`.
- copy `Signing Secret` from Webhooks and paste it in env => `CLERK_WEBHOOK_SECRET`.
- still not working? checkout [Webhook docs](https://clerk.com/docs/integrations/webhooks/overview)

### Step 6: Set up Stripe webhooks

- Go to the [sripe dashboard](https://dashboard.stripe.com/webhooks) and click on `webhooks`, and click `add an endpoint`.
- Enable the following webhook event: `checkout.session.completed`.
- Set the Endpoint URL as: `https://[your-deployed-url]/api/webhooks/stripe`.
- copy `Signing Secret` from Webhooks and paste it in env => `STRIPE_WEBHOOK_SECRET`.
- still not working? checkout [Webhook docs](https://docs.stripe.com/webhooks)


## 🚀 Run

```bash
npm run dev
```

This will start the development server. at [localhost:3000](http://localhost:3000/)

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.

## 🎉 Happy Coding!

Thank you for checking out the SaaS Boilerplate! I hope this boilerplate helps you kickstart your SaaS projects. If you have any questions or suggestions, feel free to [open an issue](https://github.com/iamsrikanthnani/saas-boilerplate/issues) or submit a pull request.

<a href="https://www.buymeacoffee.com/srikanthnani" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

Don't forget to visit my [portfolio](https://srikanthnani.com) for more projects and updates!

🚀 Keep coding and building amazing things!
