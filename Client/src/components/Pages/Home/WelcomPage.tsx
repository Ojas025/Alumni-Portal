import { Link, useNavigate } from "react-router-dom";
import homepageImage from "../../../assets/virtual-graduation-ceremony-with-computer_23-2148572915.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { useEffect } from "react";
import { Carousel } from "@/components/Utils/Carousel";

export const WelcomePage = () => {
  const { loading, user } = useSelector((state: RootState) => state.user)
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || user !== null) {
      navigate('/home');
    }
  }, []);

  const testimonials = [
    { name: "Aarav Sharma", text: "This platform helped me reconnect with my college friends. Truly amazing!" },
    { name: "Neha Patil", text: "ये अनुभव खूप छान होता. खूप काही शिकायला मिळालं!" }, 
    { name: "Rajeev Menon", text: "Got valuable guidance from alumni. A must-join for all students." },
    { name: "Sneha Kapoor", text: "यह पोर्टल बहुत उपयोगी है। मुझे मेरे मेंटर मिल गए!" }, 
    { name: "Vikram Desai", text: "Amazing experience! The events and meetups are very well organized." },
    { name: "Pooja Iyer", text: "माझ्या करिअरसाठी हा प्लॅटफॉर्म खूप उपयोगी ठरला." }, 
    { name: "Rohan Khanna", text: "Thanks to the alumni portal, I landed my first internship." },
    { name: "Meera Joshi", text: "यहाँ की कम्युनिटी बहुत supportive है। बहुत अच्छा लगा।" },
    { name: "Aditya Rane", text: "The networking opportunities here are excellent. Highly recommended!" },
  ];
  

  const features = [
    {
      icon: "📂",
      label: "Alumni Directory",
      description: "Search and connect with alumni from all over the world.",
    },
    {
      icon: "📌",
      label: "Job Postings Board",
      description: "Discover job openings and career opportunities shared by alumni.",
    },
    {
      icon: "🎉",
      label: "Events & Reunions",
      description: "Stay updated with upcoming events, meetups, and reunions.",
    },
    {
      icon: "📃",
      label: "Alumni Directory",
      description: "Explore profiles and professional journeys of alumni.",
    },
    {
      icon: "📸",
      label: "Gallery",
      description: "Browse through memorable moments and event photos.",
    },
    {
      icon: "📖",
      label: "Resources",
      description: "Access study materials, guides, and shared alumni resources.",
    },
    {
      icon: "📑",
      label: "Articles",
      description: "Read and contribute insightful articles and experiences.",
    },
    {
      icon: "💬",
      label: "Real-time Messaging",
      description: "Chat instantly with alumni and stay connected.",
    },
  ];
  
  return (
    <div className="px-4 md:px-12 lg:px-24 py-10 space-y-16 bg-[#e6e9da] dark:bg-[#000000]">
      {/* Hero Section */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">

        <div className="flex-1 space-y-6">

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Stay <span className="text-black dark:text-white">connected</span>,<br />
            Stay <span className="text-black dark:text-white">inspired</span>
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-500">
            Your alumni network <span className="text-black dark:text-white font-semibold">awaits</span>
          </h2>

          <div className="flex gap-4 mt-4">

            <Link to="/login">
              <button className="px-6 py-2 border dark:bg-white dark:text-black text-white bg-black cursor-pointer rounded-lg transition font-semibold">
                Login
              </button>
            </Link>

            <Link to="/login">
              <button className="px-6 py-2 border dark:bg-white dark:text-black text-white bg-black cursor-pointer rounded-lg transition font-semibold">
                Sign Up
              </button>
            </Link>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center">

            <div>
              <h3 className="text-lg font-semibold">
                <span className="text-blue-500">1000+</span> Alumni Connected
              </h3>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                <span className="text-blue-500">500+</span> Job Postings
              </h3>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                <span className="text-blue-500">100+</span> Meetups
              </h3>
            </div>

          </div>
        </div>

        <div className="flex-1 bg-white shadow-lg rounded-md">
          <img src={homepageImage} alt="Hero" className="rounded-xl shadow-lg w-full" />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Testimonials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 border hover:shadow-xl transition bg-white dark:text-black shadow-lg rounded-md"
            >
              <h4 className="text-xl font-semibold mb-2">{testimonial.name}</h4>
              <p className="text-gray-600">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Features</h2>
        <Carousel cards={features}/>
      </div>
    </div>
  );
};