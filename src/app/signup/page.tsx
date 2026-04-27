import Navbar from "@/components/navbar/navbar";
import AuthForm from "@/components/authform";

export default function Signup() {
  return (
    <main>
      <Navbar />
      <AuthForm type="signup" />
    </main>
  );
}