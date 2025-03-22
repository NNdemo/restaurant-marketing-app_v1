// Static data for demo purposes
export const restaurantData = {
  name: "Golden Dragon Restaurant",
  description: "Authentic Chinese cuisine with a modern twist.",
  address: "123 Food Street, Foodville, FC 12345",
  phone: "(123) 456-7890",
  businessHours: "Mon-Fri: 11:00-22:00, Sat-Sun: 10:00-23:00",
  logo: "https://placehold.co/400x400/ff6b6b/white?text=GD",
  coverImage: "https://placehold.co/800x400/ff6b6b/white?text=Golden+Dragon",
  tags: ["Chinese", "Asian", "Fine Dining", "Family Friendly"],
  rating: 4.8,
  reviewCount: 326
};

export const templateContentData = [
  {
    id: 1,
    title: "New Dish Announcement",
    template: "🎉 NEW ON THE MENU! 🎉\n\nIntroducing our {dish_name} - {dish_description}. \n\nOnly {price} during our launch week! Come and taste it before it's gone!\n\n#NewDish #FoodLover #TastyFood"
  },
  {
    id: 2,
    title: "Weekend Special",
    template: "🔥 WEEKEND SPECIAL 🔥\n\nThis weekend only! Enjoy our {dish_name} with a complimentary drink for just {price}.\n\nReservations recommended! Call us at {phone_number}.\n\n#WeekendSpecial #FoodDeals #FoodieAlert"
  },
  {
    id: 3,
    title: "Holiday Offer",
    template: "🎊 HOLIDAY SPECIAL 🎊\n\nCelebrate {holiday_name} with us! Book a table for {min_people}+ people and get a {discount}% discount on your total bill.\n\nValid from {start_date} to {end_date}.\n\n#HolidayOffer #Celebration #FamilyTime"
  },
  {
    id: 4,
    title: "Chef's Recommendation",
    template: "👨‍🍳 CHEF'S RECOMMENDATION 👨‍🍳\n\nOur head chef recommends: {dish_name} - {dish_description}.\n\nPaired perfectly with our {wine_name} wine.\n\n#ChefsChoice #GourmetFood #FoodRecommendation"
  },
  {
    id: 5,
    title: "Happy Hour",
    template: "🍻 HAPPY HOUR ALERT 🍻\n\nJoin us for Happy Hour every {days} from {start_time} to {end_time}!\n\nAll drinks are {discount}% off, and enjoy our special appetizer menu at just {price} per item.\n\n#HappyHour #DrinkSpecials #AfterWork"
  }
];

export const socialPlatformsData = [
  {
    id: 1,
    name: "Instagram",
    icon: "https://placehold.co/50x50/ff6b6b/white?text=IG",
    connected: true,
    username: "@goldendragon_restaurant"
  },
  {
    id: 2,
    name: "TikTok",
    icon: "https://placehold.co/50x50/000000/white?text=TT",
    connected: false,
    username: ""
  },
  {
    id: 3,
    name: "Xiaohongshu",
    icon: "https://placehold.co/50x50/ff0000/white?text=XHS",
    connected: true,
    username: "@golden_dragon"
  },
  {
    id: 4,
    name: "Douyin",
    icon: "https://placehold.co/50x50/000000/white?text=DY",
    connected: false,
    username: ""
  },
  {
    id: 5,
    name: "WeChat",
    icon: "https://placehold.co/50x50/00ff00/white?text=WC",
    connected: true,
    username: "goldendragonfood"
  }
];

export const couponsData = [
  {
    id: 1,
    title: "10% Off Total Bill",
    description: "Get 10% off your total bill. Valid for dine-in only.",
    platform: "Meituan",
    validFrom: "2024-08-01",
    validTo: "2024-08-31",
    code: "DRAGON10",
    discount: "10%",
    published: true
  },
  {
    id: 2,
    title: "Free Dessert",
    description: "Get a free dessert with any main course purchase.",
    platform: "Dianping",
    validFrom: "2024-08-15",
    validTo: "2024-09-15",
    code: "SWEETDRAGON",
    discount: "Free Item",
    published: false
  },
  {
    id: 3,
    title: "Buy One Get One Free",
    description: "Buy any main dish and get another one of equal or lesser value for free.",
    platform: "Ele.me",
    validFrom: "2024-09-01",
    validTo: "2024-09-30",
    code: "BOGO2024",
    discount: "BOGO",
    published: true
  },
  {
    id: 4,
    title: "30% Off for New Customers",
    description: "30% off your first order. Minimum spend $20.",
    platform: "All Platforms",
    validFrom: "2024-08-01",
    validTo: "2024-12-31",
    code: "NEWDRAGON30",
    discount: "30%",
    published: true
  }
];

export const analyticsData = {
  socialEngagement: {
    followers: 12580,
    engagement: 3.8,
    weeklyGrowth: 2.5,
    topPlatform: "Instagram"
  },
  contentPerformance: [
    { date: "2025-02-01", posts: 5, likes: 450, comments: 78, shares: 35 },
    { date: "2025-02-08", posts: 3, likes: 320, comments: 45, shares: 28 },
    { date: "2025-02-15", posts: 4, likes: 510, comments: 92, shares: 47 },
    { date: "2025-02-22", posts: 6, likes: 680, comments: 104, shares: 59 },
    { date: "2025-02-29", posts: 4, likes: 390, comments: 65, shares: 31 }
  ],
  couponUsage: [
    { couponId: 1, redemptions: 87, revenue: 2450 },
    { couponId: 2, redemptions: 45, revenue: 1350 },
    { couponId: 3, redemptions: 132, revenue: 3960 },
    { couponId: 4, redemptions: 218, revenue: 5470 }
  ]
}; 