import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { getUpcomingEvents, getHomeStats } from '../../../api/public';

// Import React Icons
import { FaClock, FaTicketAlt, FaMap, FaParking, FaHeart} from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [homeStats, setHomeStats] = useState(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const events = await getUpcomingEvents();
        setUpcomingEvents(events);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    fetchUpcomingEvents();
  }, []);
  
  // Slides data with public folder paths
  const slides = [
    {
      image: 'src/images/elephant.jpg',
      title: 'Welcome to the zoo!',
      subtitle: 'Experience over x species from around the world',
      buttons: [
        { text: '🎟️ Buy Tickets', link: '/tickets', color: 'orange' },
      ]
    },
    {
      image: 'src/images/giraffe.jpg',
      title: 'Daily Animal Encounters',
      subtitle: 'Get up close with our friendly animals',
      buttons: [
        { text: '⏰ View Schedule', link: '/schedule', color: 'green' }
      ]
    },
    {
      image: 'src/images/lion.jpg',
      title: 'New Lion Exhibit',
      subtitle: 'Now open! Visit our majestic lions',
      buttons: [
        { text: '🦁 Learn More', link: '/exhibits/lions', color: 'orange' }
      ]
    },
    {
      image: '/images/hero/conservation.jpg',
      title: 'Join us for a lunch with the Zoo Keepers',
      subtitle: 'Learn more about the zoo and the animals!',
      buttons: [
        { text: '🍽️ RVSP for the lunch!', link: '/RSVP', color: 'green' }
      ]
    }
  ];

  return (
    <div className="text-white">
      
      {/* Horizontal Navigation Bar - Top */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <a href="/tickets" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors text-lg">
            <strong> 🎟️ Buy Tickets </strong>
          </a>
          <a href="/visit" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-lg">
            <strong> ℹ️ Plan Your Visit </strong>
          </a>
          <a href="/events" className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-lg">
            <strong> 📅 Events </strong>
          </a>
          <a href="/shop" className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-lg">
            <strong> 🛍️ Shop </strong>
          </a>
          <a href="/dashboard" className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-lg">
            <strong> 🔑 Login </strong>
          </a>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-8">
        <section className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Welcome to Coog Zoo</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover amazing wildlife, attend exciting events, and support animal conservation.
          </p>
        </section>
      </div>

    {/* Slideshow Section */}
    <section className="container mx-auto px-4 mb-16">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        loop={true}
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{aspectRatio: 16/9}}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img 
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              {/* Text content */}
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <div className="text-center text-white px-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                    {slide.title}
                  </h2>
                  <p className="text-md md:text-lg mb-6">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {slide.buttons.map((button, btnIndex) => (
                      <a 
                        key={btnIndex}
                        href={button.link}
                        className={`px-5 py-2 bg-${button.color}-500 hover:bg-${button.color}-600 rounded-lg transition-colors text-sm font-medium`}
                      >
                        {button.text}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>

    {/* Today's Information Bar */}
    <div className="container mx-auto px-4 mb-12">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          
          {/* Today's Hours - Links to hours page */}
          <a href="/hours" className="group text-center hover:opacity-90 transition-opacity">
            <div className="flex flex-col items-center">
              <FaClock className="mb-2 group-hover:scale-110 transition-transform" size={50} />
              <p className="text-xs font-semibold opacity-80">Today's Hours</p>
              <p className="text-lg font-bold">9am - 5pm</p>
            </div>
          </a>
          
          {/* Admission/Tickets - Links to tickets page */}
          <a href="/tickets" className="group text-center hover:opacity-90 transition-opacity">
            <div className="flex flex-col items-center">
              <FaTicketAlt className="mb-2 group-hover:scale-110 transition-transform" size={50} />
              <p className="text-xs font-semibold opacity-80">Buy Tickets</p>
              <p className="text-lg font-bold">Click here</p>
            </div>
          </a>
          
          {/* Zoo Map - Links to map page */}
          <a href="/map" className="group text-center hover:opacity-90 transition-opacity">
            <div className="flex flex-col items-center">
              <FaMap className="mb-2 group-hover:scale-110 transition-transform" size={50} />
              <p className="text-xs font-semibold opacity-80">Zoo Map</p>
              <p className="text-lg font-bold">View Map</p>
            </div>
          </a>
          
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 pb-10">
      {/* Upcoming Events */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <a href="/events" className="text-orange-400 hover:text-orange-300 text-sm">
            View all events →
          </a>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400">Event calendar will go here.</p>
        </div>
        </section>

      {/* Today's Schedule */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Today's Schedule</h2>
          <a href="/schedule" className="text-orange-400 hover:text-orange-300 text-sm">
            Full schedule →
          </a>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400">Animal shows and feeding times will appear here.</p>
        </div>
        </section>

        {/* Support Wildlife */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Support Wildlife</h2>
            <a href="/conservation" className="text-orange-400 hover:text-orange-300 text-sm">
              Learn more →
            </a>
          </div>
          <div className="bg-green-800 p-6 rounded-lg">
            <p className="mb-3">Donations help protect endangered animals and fund conservation programs.</p>
            <a href="/donations" className="inline-block px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors">
              Donate Now
            </a>
          </div>
        </section>
      </div>

    </div>
  );
}