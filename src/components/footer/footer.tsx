export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm mt-16 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:space-x-8">

          <div className="mb-8 md:mb-0 max-w-md">
            <div className="text-2xl font-bold text-gray-800 mb-2">OpenImage</div>
            <p>
              Over 5.5 million+ high quality stock images, videos and music shared by our talented community.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Discover</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Editor's Choice</a></li>
                <li><a href="#" className="hover:underline">Curated Collections</a></li>
                <li><a href="#" className="hover:underline">OpenImage Radio</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Community</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Forum</a></li>
                <li><a href="#" className="hover:underline">Creators</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">About</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
                <li><a href="#" className="hover:underline">License Summary</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center text-xs text-gray-500 mt-10">
          © {new Date().getFullYear()} OpenImage. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
