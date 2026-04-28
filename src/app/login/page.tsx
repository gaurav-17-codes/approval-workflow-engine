// app/login/page.tsx
import Navbar from "@/components/navbar";
import AuthForm from "@/components/authform";

export default function Login() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <AuthForm type="login" />
      </div>
    </>
  );
}