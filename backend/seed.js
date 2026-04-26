require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const Service = require('./src/models/Service');
const Project = require('./src/models/Project');
const Testimonial = require('./src/models/Testimonial');
const Setting = require('./src/models/Setting');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sks-services');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    await Setting.deleteMany({});

    // 1. Seed Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@SKS2024', salt);
    await User.create({
      username: 'admin',
      password: hashedPassword
    });
    console.log('Admin user seeded');

    // 2. Seed Services (15 requested)
    const services = [
      { title: 'Business Website', shortDescription: 'Clean professional site', description: 'Clean professional site, mobile-ready, showcases services clearly', icon: '🌐', order: 1 },
      { title: 'Customer Enquiries System', shortDescription: 'Contact forms, instant leads', description: 'Contact forms, instant lead delivery directly to your inbox', icon: '✉️', order: 2 },
      { title: 'Online Booking', shortDescription: 'Time slot booking', description: 'Time slot booking, auto-confirmations, no manual scheduling', icon: '📅', order: 3 },
      { title: 'Online Selling / E-Commerce', shortDescription: 'Product listings, secure payments', description: 'Product listings, ordering, secure payments integrated with Stripe/PayPal', icon: '🛒', order: 4 },
      { title: 'Customer Accounts', shortDescription: 'Login, order history', description: 'Login, order history, saved details for repeat customers', icon: '👤', order: 5 },
      { title: 'Business Control Panel', shortDescription: 'Unified admin dashboard', description: 'Unified dashboard for clients to manage everything easily', icon: '🎛️', order: 6 },
      { title: 'Notifications System', shortDescription: 'Instant alerts', description: 'Instant alerts for bookings/orders to business and customer via email or SMS', icon: '🔔', order: 7 },
      { title: 'Business Growth Tracking', shortDescription: 'Analytics and reports', description: 'Analytics, reports, customer activity tracking to grow your business', icon: '📈', order: 8 },
      { title: 'Customer Feedback', shortDescription: 'Reviews and testimonials', description: 'Reviews, testimonials, trust building tools to increase conversion', icon: '⭐', order: 9 },
      { title: 'Location & Maps', shortDescription: 'Google Maps integration', description: 'Google Maps integration, directions directly on your contact page', icon: '📍', order: 10 },
      { title: 'Chat Support', shortDescription: 'Live chat widget', description: 'Live chat widget for quick responses to potential customers', icon: '💬', order: 11 },
      { title: 'Design & Experience', shortDescription: 'UI/UX and branding', description: 'UI/UX, brand identity, modern design systems that stand out', icon: '🎨', order: 12 },
      { title: 'Performance & Compatibility', shortDescription: 'Speed optimisation', description: 'Speed optimisation, cross-device testing to ensure perfect mobile experience', icon: '⚡', order: 13 },
      { title: 'Online Visibility / SEO', shortDescription: 'Google ranking', description: 'Google ranking, search optimisation to bring organic traffic', icon: '🔍', order: 14 },
      { title: 'Extra Benefits', shortDescription: 'Free hosting, secure setup', description: '6 months free hosting, secure systems, complete stress-free setup', icon: '🎁', order: 15 },
    ];
    await Service.insertMany(services);
    console.log('Services seeded');

    // 3. Seed Projects
    const projects = [
      { title: 'E-Commerce Platform', category: 'E-Commerce', shortDescription: 'Modern online store', fullDescription: 'A fully custom e-commerce solution built with Next.js and Stripe.', techStack: ['Next.js', 'Stripe', 'Tailwind'], images: ['https://via.placeholder.com/800x600'], featured: true },
      { title: 'Dental Clinic Booking', category: 'Clinic', shortDescription: 'Appointment system', fullDescription: 'Patient management and online booking system.', techStack: ['React', 'Node.js', 'MongoDB'], images: ['https://via.placeholder.com/800x600'], featured: true },
      { title: 'Restaurant Ordering', category: 'Restaurant', shortDescription: 'Menu and orders', fullDescription: 'Digital menu and table ordering system.', techStack: ['Vue', 'Express'], images: ['https://via.placeholder.com/800x600'], featured: false },
      { title: 'Gym Management', category: 'Gym', shortDescription: 'Membership tracking', fullDescription: 'Member portal and session booking.', techStack: ['Next.js', 'PostgreSQL'], images: ['https://via.placeholder.com/800x600'], featured: false },
      { title: 'Creative Portfolio', category: 'Portfolio', shortDescription: 'Freelancer site', fullDescription: 'Animated portfolio for a freelance designer.', techStack: ['React', 'Framer Motion'], images: ['https://via.placeholder.com/800x600'], featured: true }
    ];
    await Project.insertMany(projects);
    console.log('Projects seeded');

    // 4. Seed Testimonials
    const testimonials = [
      { clientName: 'Sarah Jenkins', businessName: 'Jenkins Dental', starRating: 5, quote: 'SKS Services completely transformed how we handle appointments. The online booking system is flawless.', visible: true },
      { clientName: 'Mike Ross', businessName: 'Ross Fitness', starRating: 5, quote: 'The membership tracking portal has saved us hours of administrative work every week. Highly recommend.', visible: true },
      { clientName: 'Elena Gilbert', businessName: 'Mystic Grill', starRating: 5, quote: 'Our online orders doubled after SKS built our new ordering platform. Beautiful design and easy to use.', visible: true }
    ];
    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded');

    // 5. Seed Settings
    const settings = [
      { key: 'businessName', value: 'SKS Services' },
      { key: 'contactEmail', value: 'hello@sksservices.com' },
      { key: 'phone', value: '+44 123 456 789' },
      { key: 'whatsapp', value: '44123456789' },
      { key: 'primaryColor', value: '#00D4FF' },
      { key: 'secondaryColor', value: '#7C3AED' },
      { key: 'darkBaseColor', value: '#080B14' },
      { key: 'heroTaglines', value: ['Web Development', 'Business Websites', 'Online Booking Systems', 'E-Commerce Solutions', 'Digital Transformation'] },
      { key: 'aboutText', value: 'We are a premier digital agency dedicated to transforming businesses through powerful, beautifully designed online platforms.' },
      { key: 'maintenanceMode', value: false }
    ];
    await Setting.insertMany(settings);
    console.log('Settings seeded');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
