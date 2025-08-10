export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Finspeed</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900">Products</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Categories</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Cart</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Admin</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Premium Cycles
            <span className="text-primary-600"> for India</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Fast, reliable e-commerce platform for premium bicycles. 
            Built with modern technology for the best shopping experience.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="btn-primary">
              Browse Products
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-900">API Status</h3>
            <p className="mt-2 text-green-600">✅ Healthy</p>
            <p className="text-sm text-gray-500">Database connected</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-900">Frontend</h3>
            <p className="mt-2 text-green-600">✅ Ready</p>
            <p className="text-sm text-gray-500">Next.js + Tailwind</p>
          </div>
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-900">Deployment</h3>
            <p className="mt-2 text-yellow-600">🚧 In Progress</p>
            <p className="text-sm text-gray-500">CI/CD pipeline setup</p>
          </div>
        </div>
      </main>
    </div>
  );
}
