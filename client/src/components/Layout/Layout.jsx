import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="container-fluid vh-100 overflow-hidden">
      <div className="row flex-nowrap h-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Section */}
        <div className="col px-0 d-flex flex-column h-100">
          <Header />

          {/* Scrollable Outlet */}
          <main className="flex-grow-1 overflow-auto p-3 content-scroll">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
