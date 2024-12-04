
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import Products from './Products';
import Cart from './Cart';
import Login from './login';
import Signup from './signup'
import FAQ from './FAQ';
import BuyPage from './BuyPage';
import MyOrder from './MyOrder';
import Footer from './Footer';
import ProductInfo from './ProductInfo';
import AdminPanel from './AdminPanel';
import ProtectedRoute from './ProtectedRoute';
import link from './link'; // Backend URL
import Profile from './Profile';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import threepoint5 from '../images/3.5.png';
import four from '../images/4.0.png';
import fourpoint5 from '../images/4.5.png';
import five from '../images/5.0.png';
import AdminOrderPanel from './AdminOrderPanel';
import AdminChatPanel from './AdminChatPanel';
import SortDropdown from './SortDropdown'; 
const ratingImages = {
  5: five,
  4.5: fourpoint5,
  4: four,
  3.5: threepoint5,
};

// Scroll-to-Top Component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Banner() {
  const bannerImages = [
    {
      src: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?fit=crop&w=1500&q=80',
      alt: 'High-Tech Products',
      text: 'Discover the Best High-Tech Products',
    },
    {
      src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fit=crop&w=1500&q=80',
      alt: 'Quality Electronics',
      text: 'Top Quality Electronics for Your Needs',
    },
    {
      src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?fit=crop&w=1500&q=80',
      alt: 'Latest Gadgets',
      text: 'Find the Latest Gadgets Here',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden bg-white">
      <Slider {...settings}>
        {bannerImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 flex items-center justify-center">
              <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center">
                {image.text}
              </h2>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [buyprice, setBuyprice] = useState();
  const [count, setCount] = useState();
  const [username, setUsername] = useState('Guest');
  const [buydata, setBuydata] = useState([]);
  const [productinfo, setProductinfo] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const location = useLocation();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${link}/pro/all`);
        const backendProducts = response.data.map(product => {
          let ratingImage = null;
          if (product.rating >= 5) {
            ratingImage = ratingImages[5];
          } else if (product.rating >= 4.5) {
            ratingImage = ratingImages[4.5];
          } else if (product.rating >= 4) {
            ratingImage = ratingImages[4];
          } else if (product.rating >= 3.5) {
            ratingImage = ratingImages[3.5];
          }
          return {
            ...product,
            ratingimg: ratingImage,
          };
        });
        setFilteredProducts([...backendProducts]);
        setUploadedProducts(backendProducts);
      } catch (error) {
        console.error('Error fetching products from backend:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filter and Sort products
  useEffect(() => {
    let filtered = [...uploadedProducts].filter((p) => 
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      (searchText === '' || p.name.toLowerCase().startsWith(searchText.toLowerCase()))
    );

    // Sort products based on selected sort order
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [searchText, selectedCategory, sortOrder, uploadedProducts]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  function pdd(e) {
    setProductinfo(e);
    navigate('/productinfo');
  }

  const hideNavbarAndFooter = ['/login', '/signup', '/admin', '/adminop', '/admincp'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-100 text-gray-900 pt-24">
      {!hideNavbarAndFooter && (
        <>
          <Navbar
            count={count}
            func={handleSearch}
            username={username}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <div className="a" style={{ marginTop: '-32px' }}>
            {location.pathname === '/' && <Banner />}
          </div>
        </>
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Conditionally render Sorting Dropdown only on the '/' route */}
        {location.pathname === '/' && (
          <SortDropdown sortOrder={sortOrder} handleSortChange={handleSortChange} />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((p) => (
                  <Products key={p._id || p.name} data={p} func={setCount} namefunc={setUsername} pi={setProductinfo} />
                ))}
              </div>
            }
          />
          <Route path="/cart" element={<ProtectedRoute element={<Cart func={setBuyprice} funce={setBuydata} />} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/adminop" element={<AdminOrderPanel />} />
          <Route path="/admincp" element={<AdminChatPanel />} />
          <Route path="/buy" element={<ProtectedRoute element={<BuyPage data={buyprice} func={setCount} data2={buydata} />} />} />
          <Route path="/order" element={<ProtectedRoute element={<MyOrder pde={pdd} />} />} />
          <Route path="/productinfo" element={<ProductInfo data={productinfo} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        </Routes>
      </div>
      {!hideNavbarAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
