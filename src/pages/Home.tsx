import React from "react";

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="w-full py-5 px-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-600">Campus Hub</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Get Started</button>
            </header>
            <main className="flex flex-col items-center justify-center mt-20 px-6 text-center">
                <h2 className="text-4xl font-extrabold leading-tight max-w-3xl">Your campus life, connected and simplified.</h2>
                <p className="mt-6 text-lg text-gray-700 max-w-2xl">Join Campus Hub to access events, resources, and connect with fellow students all in one place.</p>
                <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium">Join Now</button>
            </main>

        </div>
    )
}

export default Home;