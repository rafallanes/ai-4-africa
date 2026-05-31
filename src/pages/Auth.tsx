import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/admin");
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setBusy(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/admin");
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created", description: "You can sign in now." });
    }
  };

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.resetPasswordForEmail(String(fd.get("email")), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email sent", description: "Check your inbox to reset your password." });
      setForgotMode(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title="Sign in — AI 4 Africa" description="Admin sign in for AI 4 Africa" path="/auth" />
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
            <h1 className="text-3xl font-bold">Admin Access</h1>
            <p className="text-muted-foreground">Sign in to manage the platform</p>
          </div>

          {forgotMode ? (
            <Card>
              <CardHeader>
                <CardTitle>Reset password</CardTitle>
                <CardDescription>We'll email you a reset link</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgot} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="femail">Email</Label>
                    <Input id="femail" name="email" type="email" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Sending..." : "Send reset link"}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => setForgotMode(false)}>
                    Back to sign in
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="lemail">Email</Label>
                        <Input id="lemail" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lpassword">Password</Label>
                        <Input id="lpassword" name="password" type="password" required />
                      </div>
                      <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? "Signing in..." : "Sign in"}
                      </Button>
                      <Button type="button" variant="link" className="w-full" onClick={() => setForgotMode(true)}>
                        Forgot password?
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="signup">
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="semail">Email</Label>
                        <Input id="semail" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="spassword">Password</Label>
                        <Input id="spassword" name="password" type="password" required minLength={8} />
                      </div>
                      <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? "Creating..." : "Create account"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
