import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Home from './pages/Home';
import Header from './components/Header';
import { Slide, ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Register from './pages/Register';
import AllBlogs from './pages/AllBlogs';
import CreateBlog from './pages/CreateBlog';
import BlogDetails from './pages/BlogDetails';
import ScrollToTop from './components/ScrollToTop';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import About from './pages/About';
import ProfileEdit from './pages/ProfileEdit';
import ProtectedRoute from './utils/ProtectedRoute';
import EditBlog from './pages/EditBlog';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './admin/pages/AdminDashboard';
import ListBlogs from './admin/pages/ListBlogs';
import ListUsers from './admin/pages/ListUsers';
import Bookmarks from './pages/Bookmarks';
import Contact from './pages/Contact';
import Reports from './admin/pages/Reports';
import ContactMessages from './admin/pages/ContactMessages';

function App() {

  return (
    <Router>
      <Header />
      <ToastContainer autoClose={1000} theme="dark" position="top-center" transition={Slide} closeOnClick />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/all-blogs' element={<AllBlogs />} />
        <Route path='/create' element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path='/blog/:id/edit' element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
        <Route path='/blog/:id' element={<BlogDetails />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/profile/:id' element={<Profile />} />
        <Route path='/profile/edit' element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
        <Route path='/about' element={<About />} />
        <Route path='/bookmarks' element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path='/dashboard/admin' element={<ProtectedRoute requiredRole={'admin'}><AdminDashboard /></ProtectedRoute>} />
        <Route path='/dashboard/admin/list-blogs' element={<ProtectedRoute requiredRole={'admin'}><ListBlogs /></ProtectedRoute>} />
        <Route path='/dashboard/admin/list-users' element={<ProtectedRoute requiredRole={'admin'}><ListUsers /></ProtectedRoute>} />
        <Route path='/dashboard/admin/reports' element={<ProtectedRoute requiredRole={'admin'}><Reports /></ProtectedRoute>} />
        <Route path='/dashboard/admin/contacts' element={<ProtectedRoute requiredRole={'admin'}><ContactMessages /></ProtectedRoute>} />
        <Route path='/change-password' element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}
export default App;
