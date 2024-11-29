import SignUp from "../pages/shared/SignUp.vue";
import LogIn from "@/pages/shared/LogIn.vue";
import HomePage from "@/pages/shared/HomePage.vue";
import AboutUs from "@/pages/shared/AboutUs.vue";
import ContactUs from "@/pages/shared/ContactUs.vue";
import ForgotPassword from "@/pages/shared/ForgotPassword.vue";
import ResetPassword from "@/pages/shared/ResetPassword.vue";

const baseRoutes = [
  {
    name: "signup",
    component: SignUp,
    path: "/signup",
    meta: { requiresUnauth: true } 
  },
  {
    name: "login",
    component: LogIn,
    path: "/login",
    meta: { requiresUnauth: true } 
  },
  {
    name: "home",
    component: HomePage,
    path: "/",
    meta: { requiresUnauth: true } 
  },
  {
    name: "aboutUs",
    component: AboutUs,
    path: "/about-us",
    meta: { requiresUnauth: true } 
  },
  { name: "contact", component: ContactUs, path: "/contact" },
  {
    name: "forgotPassword",
    component: ForgotPassword,
    path: "/forgot-password",
    meta: { requiresUnauth: true } 
  },
  {
    name: "resetPassword",
    component: ResetPassword,
    path: "/reset-password/:passwordToken",
    props:true,
    meta: { requiresUnauth: true } 
  },
];
 export default baseRoutes;
