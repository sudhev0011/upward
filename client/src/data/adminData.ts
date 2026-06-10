export interface Category {
  id: string;
  name: string;
  icon: string;
  serviceCount: number;
  description: string;
  isActive: boolean;
  color: string;
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  status: "pending" | "verified" | "rejected";
  submittedDate: string;
  fileUrl: string;
  fileType: "pdf" | "image";
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  avatar: string;
  services: string[];
  rating: number;
  reviews: number;
  status: "active" | "pending" | "suspended";
  joinDate: string;
  completedJobs: number;
  phone: string;
  location: string;
  dateOfBirth: string;
  experience: number;
  about: string;
  address: string;
  languages: string[];
  socialLinks: { platform: string; url: string }[];
  verificationDocuments: VerificationDocument[];
  isAvailable: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  avatar: string;
  orders: number;
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  phone: string;
  location: string;
  lastOrder: string;
  dateOfBirth: string;
  address: string;
  about: string;
  languages: string[];
  favoriteServices: string[];
  averageRating: number;
  reviewsGiven: number;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  subscriberCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  clientName: string;
  providerName: string;
  amount: number;
  status: "completed" | "pending" | "refunded" | "failed";
  date: string;
  method: "credit_card" | "paypal" | "bank_transfer" | "wallet";
  serviceName: string;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

export const providers: Provider[] = [
  { id: "p1", name: "Sarah Johnson", email: "sarah@example.com", avatar: "SJ", services: ["House Cleaning", "Deep Cleaning"], rating: 4.9, reviews: 234, status: "active", joinDate: "2024-01-15", completedJobs: 312, phone: "+1 555-0101", location: "New York, NY", dateOfBirth: "1990-05-12", experience: 8, about: "Professional cleaner with 8+ years of experience in residential and commercial cleaning. Passionate about creating spotless environments.", address: "123 Main St, Apt 4B, New York, NY 10001", languages: ["English", "Spanish"], socialLinks: [{ platform: "LinkedIn", url: "https://linkedin.com/in/sarahjohnson" }, { platform: "Instagram", url: "https://instagram.com/sarahcleans" }], verificationDocuments: [{ id: "d1", name: "Government ID", type: "ID Card", status: "verified", submittedDate: "2024-01-10", fileUrl: "https://images.unsplash.com/photo-1578496479763-c21c718af028?w=600", fileType: "image" }, { id: "d2", name: "Business License", type: "License", status: "verified", submittedDate: "2024-01-10", fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", fileType: "image" }], isAvailable: true },
  { id: "p2", name: "Mike Chen", email: "mike@example.com", avatar: "MC", services: ["Plumbing", "Pipe Repair"], rating: 4.7, reviews: 189, status: "active", joinDate: "2024-02-20", completedJobs: 267, phone: "+1 555-0102", location: "Los Angeles, CA", dateOfBirth: "1985-09-23", experience: 12, about: "Licensed master plumber serving the LA area. Specializing in residential plumbing repairs, installations, and emergency services.", address: "456 Oak Ave, Los Angeles, CA 90001", languages: ["English", "Mandarin"], socialLinks: [{ platform: "Facebook", url: "https://facebook.com/mikechenplumbing" }], verificationDocuments: [{ id: "d3", name: "Plumbing License", type: "License", status: "verified", submittedDate: "2024-02-15", fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", fileType: "image" }, { id: "d4", name: "Insurance Certificate", type: "Insurance", status: "pending", submittedDate: "2024-02-18", fileUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", fileType: "image" }], isAvailable: true },
  { id: "p3", name: "Emma Davis", email: "emma@example.com", avatar: "ED", services: ["Electrical", "Wiring"], rating: 4.8, reviews: 156, status: "active", joinDate: "2024-03-10", completedJobs: 198, phone: "+1 555-0103", location: "Chicago, IL", dateOfBirth: "1988-03-15", experience: 10, about: "Certified electrician with expertise in residential and commercial electrical systems. Safety-first approach to every project.", address: "789 Elm St, Chicago, IL 60601", languages: ["English"], socialLinks: [{ platform: "LinkedIn", url: "https://linkedin.com/in/emmadavis" }, { platform: "Twitter", url: "https://twitter.com/emmadaviselec" }], verificationDocuments: [{ id: "d5", name: "Electrician License", type: "License", status: "verified", submittedDate: "2024-03-05", fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", fileType: "image" }, { id: "d6", name: "Background Check", type: "Certificate", status: "verified", submittedDate: "2024-03-05", fileUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", fileType: "image" }], isAvailable: true },
  { id: "p4", name: "James Wilson", email: "james@example.com", avatar: "JW", services: ["Painting"], rating: 4.5, reviews: 98, status: "pending", joinDate: "2024-06-01", completedJobs: 87, phone: "+1 555-0104", location: "Houston, TX", dateOfBirth: "1992-11-08", experience: 5, about: "Interior and exterior painting specialist. I bring color and life to every space with attention to detail and quality finishes.", address: "321 Pine Rd, Houston, TX 77001", languages: ["English", "French"], socialLinks: [{ platform: "Instagram", url: "https://instagram.com/jameswilsonpaints" }], verificationDocuments: [{ id: "d7", name: "Government ID", type: "ID Card", status: "pending", submittedDate: "2024-05-28", fileUrl: "https://images.unsplash.com/photo-1578496479763-c21c718af028?w=600", fileType: "image" }, { id: "d8", name: "Business Registration", type: "License", status: "pending", submittedDate: "2024-05-28", fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", fileType: "image" }], isAvailable: false },
  { id: "p5", name: "Lisa Thompson", email: "lisa@example.com", avatar: "LT", services: ["Landscaping", "Garden Design"], rating: 4.6, reviews: 145, status: "active", joinDate: "2024-04-12", completedJobs: 165, phone: "+1 555-0105", location: "Phoenix, AZ", dateOfBirth: "1991-07-20", experience: 7, about: "Creative landscaper transforming outdoor spaces into beautiful gardens. Specializing in drought-resistant designs for desert climates.", address: "654 Cactus Ln, Phoenix, AZ 85001", languages: ["English", "Portuguese"], socialLinks: [{ platform: "Pinterest", url: "https://pinterest.com/lisagardens" }, { platform: "Instagram", url: "https://instagram.com/lisathompsongardens" }], verificationDocuments: [{ id: "d9", name: "Landscaping Certification", type: "Certificate", status: "verified", submittedDate: "2024-04-08", fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", fileType: "image" }], isAvailable: true },
  { id: "p6", name: "Robert Brown", email: "robert@example.com", avatar: "RB", services: ["Moving", "Packing"], rating: 3.9, reviews: 67, status: "suspended", joinDate: "2024-01-28", completedJobs: 54, phone: "+1 555-0106", location: "Philadelphia, PA", dateOfBirth: "1987-01-30", experience: 6, about: "Reliable moving service for local and long-distance relocations. Careful handling of all belongings guaranteed.", address: "987 Broad St, Philadelphia, PA 19101", languages: ["English"], socialLinks: [], verificationDocuments: [{ id: "d10", name: "Driver License", type: "License", status: "verified", submittedDate: "2024-01-25", fileUrl: "https://images.unsplash.com/photo-1578496479763-c21c718af028?w=600", fileType: "image" }, { id: "d11", name: "Vehicle Insurance", type: "Insurance", status: "rejected", submittedDate: "2024-01-25", fileUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", fileType: "image" }], isAvailable: false },
  { id: "p7", name: "Ana Martinez", email: "ana@example.com", avatar: "AM", services: ["Tutoring", "Math"], rating: 5.0, reviews: 312, status: "active", joinDate: "2023-11-05", completedJobs: 445, phone: "+1 555-0107", location: "San Antonio, TX", dateOfBirth: "1993-12-03", experience: 9, about: "Passionate math tutor with a Master's degree in Mathematics. Helping students from elementary to college level achieve their academic goals.", address: "147 University Ave, San Antonio, TX 78201", languages: ["English", "Spanish", "Portuguese"], socialLinks: [{ platform: "LinkedIn", url: "https://linkedin.com/in/anamartinez" }, { platform: "YouTube", url: "https://youtube.com/@anamathtutor" }], verificationDocuments: [{ id: "d12", name: "Teaching Certification", type: "Certificate", status: "verified", submittedDate: "2023-10-30", fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", fileType: "image" }, { id: "d13", name: "Master's Degree", type: "Certificate", status: "verified", submittedDate: "2023-10-30", fileUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", fileType: "image" }, { id: "d14", name: "Background Check", type: "Certificate", status: "verified", submittedDate: "2023-10-30", fileUrl: "https://images.unsplash.com/photo-1578496479763-c21c718af028?w=600", fileType: "image" }], isAvailable: true },
  { id: "p8", name: "David Kim", email: "david@example.com", avatar: "DK", services: ["Photography", "Video"], rating: 4.8, reviews: 201, status: "active", joinDate: "2024-02-14", completedJobs: 178, phone: "+1 555-0108", location: "San Diego, CA", dateOfBirth: "1989-06-17", experience: 11, about: "Award-winning photographer and videographer specializing in events, portraits, and commercial shoots. Every frame tells a story.", address: "258 Ocean Blvd, San Diego, CA 92101", languages: ["English", "Korean"], socialLinks: [{ platform: "Instagram", url: "https://instagram.com/davidkimphoto" }, { platform: "Website", url: "https://davidkimphotography.com" }], verificationDocuments: [{ id: "d15", name: "Business License", type: "License", status: "verified", submittedDate: "2024-02-10", fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600", fileType: "image" }, { id: "d16", name: "Equipment Insurance", type: "Insurance", status: "pending", submittedDate: "2024-02-12", fileUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600", fileType: "image" }], isAvailable: true },
];

export const clients: Client[] = [
  { id: "c1", name: "Alex Turner", email: "alex@example.com", avatar: "AT", orders: 15, status: "active", joinDate: "2024-01-10", phone: "+1 555-0201", location: "New York, NY", lastOrder: "2024-11-28", dateOfBirth: "1995-03-14", address: "45 Park Ave, Apt 12C, New York, NY 10016", about: "Regular user of home cleaning and repair services. Prefers weekend appointments and values punctuality.", languages: ["English"], favoriteServices: ["House Cleaning", "Plumbing"], averageRating: 4.8, reviewsGiven: 12 },
  { id: "c2", name: "Maria Garcia", email: "maria@example.com", avatar: "MG", orders: 8, status: "active", joinDate: "2024-03-22", phone: "+1 555-0202", location: "Miami, FL", lastOrder: "2024-12-01", dateOfBirth: "1990-07-22", address: "123 Ocean Dr, Miami, FL 33139", about: "Frequent user of tutoring and creative services. Enjoys exploring new service providers.", languages: ["English", "Spanish"], favoriteServices: ["Math Tutoring", "Photography"], averageRating: 4.9, reviewsGiven: 7 },
  { id: "c3", name: "John Smith", email: "john@example.com", avatar: "JS", orders: 23, status: "active", joinDate: "2023-12-05", phone: "+1 555-0203", location: "Boston, MA", lastOrder: "2024-11-30", dateOfBirth: "1988-11-03", address: "789 Commonwealth Ave, Boston, MA 02215", about: "Property manager who regularly books maintenance services for multiple units. High-volume client.", languages: ["English"], favoriteServices: ["Electrical", "Plumbing", "Painting"], averageRating: 4.6, reviewsGiven: 20 },
  { id: "c4", name: "Sophie Williams", email: "sophie@example.com", avatar: "SW", orders: 3, status: "inactive", joinDate: "2024-07-15", phone: "+1 555-0204", location: "Denver, CO", lastOrder: "2024-09-10", dateOfBirth: "1997-01-28", address: "456 Mountain View Rd, Denver, CO 80202", about: "Occasional user, mostly for landscaping and garden services during spring and summer.", languages: ["English", "French"], favoriteServices: ["Landscaping"], averageRating: 5.0, reviewsGiven: 2 },
  { id: "c5", name: "Carlos Rivera", email: "carlos@example.com", avatar: "CR", orders: 12, status: "active", joinDate: "2024-02-18", phone: "+1 555-0205", location: "Austin, TX", lastOrder: "2024-12-02", dateOfBirth: "1992-09-15", address: "321 South Congress Ave, Austin, TX 78704", about: "Tech professional who books services for his home office setup and maintenance.", languages: ["English", "Spanish"], favoriteServices: ["Electrical", "House Cleaning"], averageRating: 4.7, reviewsGiven: 10 },
  { id: "c6", name: "Emily Chen", email: "emily@example.com", avatar: "EC", orders: 0, status: "suspended", joinDate: "2024-08-01", phone: "+1 555-0206", location: "Seattle, WA", lastOrder: "", dateOfBirth: "1999-05-10", address: "654 Pike St, Seattle, WA 98101", about: "New user, account suspended due to payment issues.", languages: ["English", "Mandarin"], favoriteServices: [], averageRating: 0, reviewsGiven: 0 },
  { id: "c7", name: "Tom Anderson", email: "tom@example.com", avatar: "TA", orders: 19, status: "active", joinDate: "2023-10-12", phone: "+1 555-0207", location: "Portland, OR", lastOrder: "2024-11-25", dateOfBirth: "1985-12-20", address: "987 Hawthorne Blvd, Portland, OR 97214", about: "Loyal customer who primarily uses photography and moving services. Always leaves detailed reviews.", languages: ["English"], favoriteServices: ["Photography", "Moving"], averageRating: 4.5, reviewsGiven: 18 },
];

export const categories: Category[] = [
  { id: "cat1", name: "Home Services", icon: "Home", serviceCount: 4, description: "Cleaning, repairs and maintenance", isActive: true, color: "hsl(217 91% 53%)" },
  { id: "cat2", name: "Education", icon: "GraduationCap", serviceCount: 1, description: "Tutoring and learning services", isActive: true, color: "hsl(142 71% 45%)" },
  { id: "cat3", name: "Creative", icon: "Palette", serviceCount: 1, description: "Photography, design and arts", isActive: true, color: "hsl(280 65% 60%)" },
  { id: "cat4", name: "Outdoor", icon: "Trees", serviceCount: 1, description: "Landscaping and outdoor work", isActive: true, color: "hsl(38 92% 50%)" },
  { id: "cat5", name: "Logistics", icon: "Truck", serviceCount: 1, description: "Moving and delivery services", isActive: false, color: "hsl(0 72% 51%)" },
  { id: "cat6", name: "Health & Wellness", icon: "Heart", serviceCount: 0, description: "Fitness, spa, and health services", isActive: true, color: "hsl(340 82% 52%)" },
];

export const subscriptions: Subscription[] = [
  { id: "sub1", name: "Basic", price: 9.99, billingCycle: "monthly", features: ["5 bookings/month", "Basic support", "Standard listing"], subscriberCount: 156, isActive: true, createdAt: "2024-01-01" },
  { id: "sub2", name: "Professional", price: 29.99, billingCycle: "monthly", features: ["Unlimited bookings", "Priority support", "Featured listing", "Analytics dashboard"], subscriberCount: 89, isActive: true, createdAt: "2024-01-01" },
  { id: "sub3", name: "Enterprise", price: 79.99, billingCycle: "monthly", features: ["Unlimited bookings", "24/7 support", "Premium listing", "Advanced analytics", "API access", "White-label"], subscriberCount: 23, isActive: true, createdAt: "2024-01-01" },
  { id: "sub4", name: "Basic Annual", price: 99.99, billingCycle: "yearly", features: ["5 bookings/month", "Basic support", "Standard listing", "2 months free"], subscriberCount: 45, isActive: true, createdAt: "2024-03-01" },
];

export const payments: Payment[] = [
  { id: "pay1", transactionId: "TXN-2024-001", clientName: "Alex Turner", providerName: "Sarah Johnson", amount: 160, status: "completed", date: "2024-12-01", method: "credit_card", serviceName: "House Cleaning" },
  { id: "pay2", transactionId: "TXN-2024-002", clientName: "Maria Garcia", providerName: "Mike Chen", amount: 240, status: "completed", date: "2024-12-01", method: "paypal", serviceName: "Plumbing Repair" },
  { id: "pay3", transactionId: "TXN-2024-003", clientName: "John Smith", providerName: "Emma Davis", amount: 300, status: "pending", date: "2024-12-02", method: "credit_card", serviceName: "Electrical Work" },
  { id: "pay4", transactionId: "TXN-2024-004", clientName: "Sophie Williams", providerName: "James Wilson", amount: 180, status: "refunded", date: "2024-11-28", method: "bank_transfer", serviceName: "Interior Painting" },
  { id: "pay5", transactionId: "TXN-2024-005", clientName: "Carlos Rivera", providerName: "Ana Martinez", amount: 90, status: "completed", date: "2024-12-02", method: "wallet", serviceName: "Math Tutoring" },
  { id: "pay6", transactionId: "TXN-2024-006", clientName: "Tom Anderson", providerName: "David Kim", amount: 400, status: "completed", date: "2024-11-30", method: "credit_card", serviceName: "Photography" },
  { id: "pay7", transactionId: "TXN-2024-007", clientName: "Alex Turner", providerName: "Lisa Thompson", amount: 200, status: "failed", date: "2024-11-29", method: "paypal", serviceName: "Landscaping" },
  { id: "pay8", transactionId: "TXN-2024-008", clientName: "John Smith", providerName: "Sarah Johnson", amount: 80, status: "completed", date: "2024-12-03", method: "credit_card", serviceName: "House Cleaning" },
  { id: "pay9", transactionId: "TXN-2024-009", clientName: "Maria Garcia", providerName: "Ana Martinez", amount: 45, status: "pending", date: "2024-12-03", method: "wallet", serviceName: "Math Tutoring" },
  { id: "pay10", transactionId: "TXN-2024-010", clientName: "Carlos Rivera", providerName: "Emma Davis", amount: 150, status: "completed", date: "2024-12-03", method: "bank_transfer", serviceName: "Electrical Work" },
];

export const revenueData = [
  { month: "Jan", revenue: 12400, orders: 145 },
  { month: "Feb", revenue: 15800, orders: 178 },
  { month: "Mar", revenue: 18200, orders: 203 },
  { month: "Apr", revenue: 16900, orders: 192 },
  { month: "May", revenue: 21400, orders: 234 },
  { month: "Jun", revenue: 24800, orders: 267 },
  { month: "Jul", revenue: 22100, orders: 245 },
  { month: "Aug", revenue: 26500, orders: 289 },
  { month: "Sep", revenue: 28900, orders: 312 },
  { month: "Oct", revenue: 31200, orders: 341 },
  { month: "Nov", revenue: 29600, orders: 328 },
  { month: "Dec", revenue: 33500, orders: 365 },
];

export const categoryDistribution = [
  { name: "Home Services", value: 45, fill: "hsl(217 91% 53%)" },
  { name: "Education", value: 20, fill: "hsl(142 71% 45%)" },
  { name: "Creative", value: 15, fill: "hsl(280 65% 60%)" },
  { name: "Outdoor", value: 12, fill: "hsl(38 92% 50%)" },
  { name: "Logistics", value: 8, fill: "hsl(0 72% 51%)" },
];

export const dashboardStats = {
  totalRevenue: 261300,
  revenueGrowth: 12.5,
  activeProviders: 156,
  providerGrowth: 8.2,
  activeClients: 1243,
  clientGrowth: 15.3,
  pendingOrders: 47,
  orderGrowth: -3.1,
};