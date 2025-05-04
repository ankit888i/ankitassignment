export default function Footer() {
  return (
    <footer className="  bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-around">
          <div>
            <h3 className="font-semibold text-lg">HustleNest</h3>
            <p className="text-gray-400 text-sm mt-2">
              From tweets to career treats..
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
