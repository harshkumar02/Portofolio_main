import React, { useEffect } from "react";
import { Share2 } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactPage = () => {
    useEffect(() => {
        AOS.init({
            once: false,
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-5">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1
                    data-aos="fade-down"
                    data-aos-duration="1000"
                    className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500"
                >
                    Contact Me
                </h1>
                <p
                    data-aos="fade-up"
                    data-aos-duration="1100"
                    className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
                >
                    I'm always open to discussing new projects, creative ideas, or
                    opportunities to be part of your vision. Feel free to connect with me
                    through the form below or via my social links!
                </p>
            </div>

            {/* Social Links Section */}
            <div
                data-aos="fade-up"
                data-aos-duration="1200"
                className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md"
            >
                <div className="flex items-center mb-6">
                    <Share2 className="w-8 h-8 text-indigo-500 mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-200">
                        Social Links
                    </h2>
                </div>
                <p className="text-gray-400 mb-6">
                    Connect with me on my social platforms:
                </p>
                <SocialLinks />
            </div>
        </div>
    );
};

export default ContactPage;
