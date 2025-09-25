import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./component/Login.jsx";
import SignUp from "./component/SignUp.jsx";
import HomePage from "./component/HomePage.jsx";
import LandingPage from './component/LandingPage.jsx';
import GetInTouch from './component/GetInTouch.jsx';
import ProfilePage from './component/ProfilePage.jsx';
import OurServices from './component/OurServices.jsx';
import WhyChooseUs from './component/WhyChooseUs.jsx';
import NutritionCard from './component/NutritionCard.jsx';
import Chatbot from './component/Chatbot.jsx';
import RecipeCard from './component/RecipeCard.jsx';
import SharedRecipePage from './component/SharedRecipePage.jsx';
import StarRating from './component/StarRating.jsx';
import ForgotPassword from './component/ForgotPassword.jsx';

const router = createBrowserRouter([
  {path: "/", element:<LandingPage />},
  { path: "/HomePage", element: <HomePage /> },
  { path: "/signUp", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  {path: "/getInTouch", element: <GetInTouch/>},
  {path:"/profilePage", element:<ProfilePage />},
  {path:"/OurServices", element:<OurServices/>},
  {path: "/whyChooseUs", element:<WhyChooseUs/>},
  {path: "/nutritionCard", element:<NutritionCard />},
  {path: "/chatbot", element:<Chatbot/>},
  {path: "/recipe/:id", element: <RecipeCard />},
  {path: "/recipes/share/:recipeId", element: <SharedRecipePage />},
  {path: "*", element: <div className='text-3xl font-bold text-center mt-20'>404! Page Not Found</div> },
  {path: "/rating", element: <StarRating />},
  {path:"/forgot-password", element:<ForgotPassword />},

]);

function App() {
  return (
    <div className="">
      <RouterProvider router={router} />
    </div>
    
  );
}

export default App;
