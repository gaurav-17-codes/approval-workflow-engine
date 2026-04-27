import Navbar from "@/components/navbar/navbar";
import AuthForm from "@/components/authform";

export default function Login() {
  return (
    <main>
      <Navbar />
      <AuthForm type="login" />
    </main>
  );
}