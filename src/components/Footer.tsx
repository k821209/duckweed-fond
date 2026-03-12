import { LuLeaf } from 'react-icons/lu';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <LuLeaf className="text-duckweed-400" />
            <span className="text-sm">Duckweed Genomics Database</span>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Duckweed Genomics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
