import React from "react";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            {/* Header */}
            <header className="w-full py-5 px-6 flex items-center justify-between bg-white shadow-md fixed top-0 left-0 z-50">
                <h1 className="text-2xl font-bold text-blue-600">Campus Hub</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Get Started</button>
            </header>

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center mt-24 px-6 text-center">
                <h2 className="text-4xl font-extrabold leading-tight max-w-3xl text-blue-600">Your campus life, connected and simplified.</h2>
                <p className="mt-6 text-lg text-gray-700 max-w-2xl">
                    Join Campus Hub to access events, resources, and connect with fellow students all in one place.
                </p>
                <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition duration-200">Join Now</button>
            </main>

            {/* Featured Sections */}
            <section className="bg-white py-16 px-6 text-center">
                <h3 className="text-3xl font-semibold text-blue-600 mb-10">What’s Waiting For You</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-200">
                        <h4 className="text-xl font-semibold text-blue-600 mb-3">Confessions</h4>
                        <p className="text-gray-600">Read and share anonymous confessions from students. Join the conversation.</p>
                        <a href="/confessions" className="text-blue-600 hover:underline mt-4 block">Explore Confessions</a>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-200">
                        <h4 className="text-xl font-semibold text-blue-600 mb-3">Marketplace</h4>
                        <p className="text-gray-600">Buy and sell books, gadgets, and more in our student marketplace.</p>
                        <a href="/marketplace" className="text-blue-600 hover:underline mt-4 block">Browse Marketplace</a>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-200">
                        <h4 className="text-xl font-semibold text-blue-600 mb-3">Events</h4>
                        <p className="text-gray-600">Stay up-to-date with campus events, clubs, and activities.</p>
                        <a href="/events" className="text-blue-600 hover:underline mt-4 block">View Events</a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-600 text-white py-4 mt-8">
                <div className="container mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} Campus Hub. All Rights Reserved.</p>
                    <div className="mt-2">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-white hover:text-gray-300">Facebook</a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-white hover:text-gray-300">Instagram</a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-white hover:text-gray-300">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
