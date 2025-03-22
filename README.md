# Restaurant Marketing App

A mobile-friendly web application designed to help traditional restaurant owners promote their business across various social media platforms and marketing channels.

## Features

- **Content Generation**: Easily create engaging marketing content from templates
- **Social Media Management**: Connect and post to multiple social media platforms in one click
- **Coupon Management**: Create, manage and track promotional coupons across food delivery platforms
- **Restaurant Profile**: Manage your restaurant's information and branding

## Technical Stack

- **Frontend**: Vue 3 with Composition API
- **UI Framework**: Vant UI (mobile-optimized)
- **Build Tool**: Vite
- **Mobile Adaptation**: Postcss-pxtorem and amfe-flexible

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Navigate to the project directory
```
cd restaurant-marketing-app
```

3. Install dependencies
```
npm install
```

4. Start the development server
```
npm run dev
```

5. Open your browser to the URL displayed in the terminal

## Project Structure

```
restaurant-marketing-app/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── components/      # Reusable components
│   ├── mock/            # Static data for demo
│   ├── router/          # Vue Router configuration
│   ├── utils/           # Utility functions
│   ├── views/           # Application pages
│   │   ├── Home/        # Homepage
│   │   ├── Content/     # Content generation
│   │   ├── Social/      # Social media management
│   │   ├── Coupons/     # Coupon management
│   │   └── Profile/     # User profile
│   ├── App.vue          # Main app component
│   └── main.js          # App entry point
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

## Mobile Adaptation

This app is specifically designed for mobile use. It uses the following technologies for responsive design:

- `postcss-pxtorem`: Converts px to rem units for flexible scaling
- `amfe-flexible`: Dynamically sets the root font size based on screen width

## Note

This is a demo application using static data for demonstration purposes. In a production environment, you would need to connect to a backend API.

## License

MIT
